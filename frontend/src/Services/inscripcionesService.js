// Servicio de Inscripciones
import { getLegajoPorNumero } from "../api/legajosApi";
import { getComisiones, getComisionesPorIdLegajo } from "../api/comisiones";
import { crearInscripcion } from "../api/inscripcionesApi";
import { getListaDeInscripciones } from "../api/inscripcionesApi";
import { obtenerResultadosAcademicos } from "./resultadoAcademicoService";


// Buscar un legajo
export async function buscarLegajo(numeroLegajo) {
    const response = await getLegajoPorNumero(numeroLegajo);
    const legajo = response.data;
    // Validación local para evitar continuar
    // con el flujo si el legajo está inactivo.
    if (!legajo.activo) {
        throw new Error(
            "El legajo se encuentra inactivo y no puede realizar inscripciones."
        );
    }
    return legajo;
}

// Obtener todas las comisiones
export async function obtenerComisiones() {
    const response = await getComisiones();
    return response.data;
}

export async function obtenerComisionesPorIdLegajo(idLegajo) {
    const response = await getComisionesPorIdLegajo(idLegajo);
    return response.data;
}

async function obtenerMateriasAprobadas(idLegajo) {
    const resultados = await obtenerResultadosAcademicos(idLegajo);
    const comisiones = await obtenerComisiones();

    return resultados
        .filter(r => r.estado_academico === "Aprobado")
        .map(r => comisiones.find(c => c.id_comision_asignatura === r.id_comision)?.plan_asignaturas?.asignatura_id)
        .filter(Boolean);
}

// Obtener únicamente las comisiones que el alumno puede cursar
export async function obtenerComisionesDisponibles(numeroLegajo) {

    const legajo = await buscarLegajo(numeroLegajo);

    const comisiones = await obtenerComisionesPorIdLegajo(legajo.id_Legajo);
    const materiasAprobadas = await obtenerMateriasAprobadas(legajo.id_legajo);

    return comisiones.filter((comision) => {


        // 1. Validar correlativas (Chequear que sea necesario)
        if (comision.plan_asignaturas.correlativas.length > 0) {

            const cumpleCorrelativas =
                comision.plan_asignaturas.correlativas.every(correlativa =>
                    materiasAprobadas.includes(correlativa.asignatura_id)
                );

            if (!cumpleCorrelativas) {
                return false;
            }

        }

        // 2. Validar cupo disponible (Cuando rebe haga calculo modificar)
        if (comision.inscriptos >= comision.cupo) {
            return false;
        }

        return true;

    });

}

// Carga toda la información necesaria para iniciar
// el proceso de inscripción.
// La vista solamente consume este método.
export async function cargarDatosInscripcion(numeroLegajo) {

    const legajo = await buscarLegajo(numeroLegajo);

    const comisiones =
        await obtenerComisionesDisponibles(numeroLegajo);

    return {
        legajo,
        comisiones
    };
}

// Crear una solicitud de inscripción
export async function crearSolicitudInscripcion(
    numeroLegajo,
    idComision
) {

    const legajo = await buscarLegajo(numeroLegajo);

    const comisiones = await obtenerComisiones();
    const comision = comisiones.find(
        c => c.id_comision_asignatura === idComision
    )

    // Enviamos la solicitud al backend por POST
    const response = await crearInscripcion({

        id_legajo: legajo.id_legajo,
        id_comision: idComision

    });

    // Si el backend rechazó la inscripción,
    // propagamos el mensaje hacia la vista.
    if (response.status !== "success") {
        throw new Error(response.message);
    }

    const data = response.data;

    // Adaptamos la respuesta para la vista
    return {

        status: response.status,
        message: response.message,

        data: {

            id: data.id_inscripcion,

            id_legajo: legajo.numero_legajo,

            alumno: `${legajo.nombre} ${legajo.apellido}`,

            comision: comision?.comision.descripcion ?? "-",

            materia: comision?.nombre ?? "-",

            estado: data.estado.nombre,

            fecha_inscripcion: data.fecha_inscripcion,

            motivo: null

        }

    };

}

// Obtiene las inscripciones del legajo del alumno logueado.
export async function obtenerMisInscripciones(idLegajo) {

    const response = await getListaDeInscripciones();
    const comisiones = await obtenerComisiones();

    const mias = response.data.filter(
        ins => ins.id_legajo === idLegajo
    );
    //(Modificar horario cuando este)
    return mias.map(ins => {
        const com = comisiones.find(c => c.id_comision_asignatura === ins.id_comision);
        return {
            id: ins.id_inscripcion,
            id_comision: ins.id_comision,
            materia: com?.nombre ?? "-",
            comision: com?.comision.descripcion ?? "-",
            horario: com?.modalidad ?? "-",
            estado: ins.estado.nombre,
            fecha_inscripcion: ins.fecha_inscripcion
        };
    });
}