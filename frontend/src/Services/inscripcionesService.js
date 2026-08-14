// Servicio de Inscripciones

import { getLegajoPorNumero, getLegajoPorId } from "../api/legajosApi";
import {
    getComisiones,
    getComisionesPorIdLegajo
} from "../api/comisiones";
import { obtenerResultadosAcademicos } from "./resultadoAcademicoService";

import {
    crearInscripcion,
    getMisInscripciones,
    getConteoComisiones
} from "../api/inscripcionesApi";

import { getEstadosAcademicos } from "../api/catalogosApi";

// ============================================================
// LEGAJOS
// ============================================================

// Buscar un legajo por su número
export async function buscarLegajo(numeroLegajo) {
    const response = await getLegajoPorNumero(numeroLegajo);
    const legajo = response.data;

    if (!legajo.activo) {
        throw new Error(
            "El legajo se encuentra inactivo y no puede realizar inscripciones."
        );
    }

    return legajo;
}

// Buscar un legajo por su id
export async function buscarLegajoPorId(idLegajo) {
    const response = await getLegajoPorId(idLegajo);
    const legajo = response.data;

    if (!legajo.activo) {
        throw new Error(
            "El legajo se encuentra inactivo y no puede realizar inscripciones."
        );
    }

    return legajo;
}

// ============================================================
// COMISIONES
// ============================================================

// Obtener todas las comisiones
export async function obtenerComisiones() {
    const response = await getComisiones();
    return response.data;
}

export async function obtenerComisionesPorIdLegajo(idLegajo) {
    const response = await getComisionesPorIdLegajo(idLegajo);
    return response.data;
}

// ============================================================
// ESTADOS ACADÉMICOS / CORRELATIVAS
// ============================================================

async function obtenerIdEstadoAcademicoAprobado() {
    const estados = await getEstadosAcademicos();

    return estados.find(
        (estado) => estado.nombre === "Aprobado"
    )?.id_estado_academico;
}

function obtenerMateriasAprobadasDeResultados(
    resultados,
    todasLasComisiones,
    idEstadoAprobado
) {
    if (!idEstadoAprobado) {
        return [];
    }

    return resultados
        .filter(
            (resultado) =>
                resultado.id_estado_academico === idEstadoAprobado
        )
        .map(
            (resultado) =>
                todasLasComisiones.find(
                    (comision) =>
                        comision.id_comision_asignatura ===
                        resultado.id_comision_asignatura
                )?.plan_asignaturas?.asignatura_id
        )
        .filter(Boolean);
}

function construirMapaNombresDeAsignatura(todasLasComisiones) {
    const mapa = {};

    for (const comision of todasLasComisiones) {
        const idAsignatura =
            comision.plan_asignaturas?.asignatura_id;

        if (
            idAsignatura != null &&
            mapa[idAsignatura] == null
        ) {
            mapa[idAsignatura] = comision.nombre;
        }
    }

    return mapa;
}

function enriquecerComisionConPlanYCorrelativas(
    comision,
    mapaNombresAsignatura
) {
    const correlativas =
        comision.plan_asignaturas?.correlativas ?? [];

    return {
        ...comision,

        id_plan:
            comision.plan_asignaturas?.plan_id ?? null,

        correlativas_nombres: correlativas.map(
            (correlativa) =>
                mapaNombresAsignatura[
                correlativa.asignatura_id
                ] ??
                `Asignatura #${correlativa.asignatura_id}`
        ),
    };
}

// ============================================================
// CUPOS
// ============================================================

/**
 * Obtiene la cantidad de inscriptos por comisión.
 *
 * La lógica de qué estados ocupan cupo ya pertenece al backend.
 * El frontend solamente consume el conteo resultante.
 */
async function contarInscriptosPorComision() {
    const response = await getConteoComisiones();

    const conteo = {};

    (response.data ?? []).forEach((item) => {
        conteo[item.id_comision_asignatura] =
            item.inscriptos;
    });

    return conteo;
}

function enriquecerComisionConCupo(comision, conteo) {
    const cupo_maximo = comision.cupo_maximo ?? 0;

    const inscriptos =
        conteo[comision.id_comision_asignatura] ?? 0;

    return {
        ...comision,

        cupo_maximo,

        inscriptos,

        // Compatibilidad con componentes anteriores
        cupo: cupo_maximo,
    };
}

// ============================================================
// COMISIONES DISPONIBLES
// ============================================================

export async function obtenerComisionesDisponibles(idLegajo) {
    const legajo = await buscarLegajoPorId(idLegajo);

    const [
        comisiones,
        todasLasComisiones,
        resultados,
        conteo,
        idEstadoAprobado
    ] = await Promise.all([
        obtenerComisionesPorIdLegajo(legajo.id_legajo),
        obtenerComisiones(),
        obtenerResultadosAcademicos(legajo.id_legajo),
        contarInscriptosPorComision(),
        obtenerIdEstadoAcademicoAprobado(),
    ]);

    const materiasAprobadas =
        obtenerMateriasAprobadasDeResultados(
            resultados,
            todasLasComisiones,
            idEstadoAprobado
        );

    const mapaNombresAsignatura =
        construirMapaNombresDeAsignatura(
            todasLasComisiones
        );

    return comisiones
        .map((comision) =>
            enriquecerComisionConCupo(
                comision,
                conteo
            )
        )
        .map((comision) =>
            enriquecerComisionConPlanYCorrelativas(
                comision,
                mapaNombresAsignatura
            )
        )
        .filter((comision) => {
            //VALIDACIÓN DE MATERIA YA APROBADA
            const idAsignatura =
                comision.plan_asignaturas?.asignatura_id;

            if (
                idAsignatura != null &&
                materiasAprobadas.includes(idAsignatura)
            ) {
                return false;
            }

            //VALIDACIÓN DE CORRELATIVAS
            const correlativas =
                comision.plan_asignaturas?.correlativas ?? [];

            if (correlativas.length > 0) {
                const cumple = correlativas.every(
                    (correlativa) =>
                        materiasAprobadas.includes(
                            correlativa.asignatura_id
                        )
                );

                if (!cumple) {
                    return false;
                }
            }

            //VALIDACIÓN DE CUPO
            if (
                comision.inscriptos >=
                comision.cupo_maximo
            ) {
                return false;
            }

            return true;
        });
}

// CARGA INICIAL DE INSCRIPCIÓN
export async function cargarDatosInscripcion(idLegajo) {
    const legajo = await buscarLegajoPorId(idLegajo);

    const comisiones =
        await obtenerComisionesDisponibles(idLegajo);

    return {
        legajo,
        comisiones,
    };
}

// ============================================================
// CREAR SOLICITUD
// ============================================================

export async function crearSolicitudInscripcion(
    idLegajo,
    idComision
) {
    const legajo = await buscarLegajoPorId(idLegajo);

    const comisiones = await obtenerComisiones();

    const comision = comisiones.find(
        (c) =>
            c.id_comision_asignatura === idComision
    );

    const response = await crearInscripcion({
        id_legajo: legajo.id_legajo,
        id_comision_asignatura: idComision,
    });

    if (response.status !== "success") {
        throw new Error(response.message);
    }

    const data = response.data;

    return {
        status: response.status,
        message: response.message,

        data: {
            id: data.id_inscripcion,

            id_legajo: legajo.numero_legajo,

            alumno:
                `${legajo.nombre} ${legajo.apellido}`,

            comision:
                comision?.comision?.descripcion ?? "-",

            materia:
                comision?.nombre ?? "-",

            id_estado: data.id_estado,

            estado:
                data.estado?.nombre ?? "-",

            fecha_inscripcion:
                data.fecha_inscripcion,

            motivo: null,
        },
    };
}

// ============================================================
// MIS INSCRIPCIONES
// ============================================================

export async function obtenerMisInscripciones() {
    const response = await getMisInscripciones();

    const comisiones =
        await obtenerComisiones();

    return response.data.map((inscripcion) => {
        const comision = comisiones.find(
            (c) =>
                c.id_comision_asignatura ===
                inscripcion.id_comision_asignatura
        );

        return {
            id: inscripcion.id_inscripcion,

            id_comision:
                inscripcion.id_comision_asignatura,

            id_comision_asignatura:
                inscripcion.id_comision_asignatura,

            id_estado:
                inscripcion.id_estado,

            materia:
                comision?.nombre ?? "-",

            comision:
                comision?.comision?.descripcion ?? "-",

            horario:
                comision?.modalidad ?? "-",

            estado:
                inscripcion.estado?.nombre ?? "-",

            fecha_inscripcion:
                inscripcion.fecha_inscripcion,
        };
    });
}