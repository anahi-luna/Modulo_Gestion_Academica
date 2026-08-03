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

function obtenerMateriasAprobadasDeResultados(resultados, todasLasComisiones) {
  return resultados
    .filter((r) => r.estado_academico === "Aprobado")
    .map(
      (r) =>
        todasLasComisiones.find(
          (c) => c.id_comision_asignatura === r.id_comision_asignatura
        )?.plan_asignaturas?.asignatura_id
    )
    .filter(Boolean);
}

function construirMapaNombresDeAsignatura(todasLasComisiones) {
  const mapa = {};
  for (const c of todasLasComisiones) {
    const idAsignatura = c.plan_asignaturas?.asignatura_id;
    if (idAsignatura != null && mapa[idAsignatura] == null) {
      mapa[idAsignatura] = c.nombre;
    }
  }
  return mapa;
}

function enriquecerComisionConPlanYCorrelativas(comision, mapaNombresAsignatura) {
  const correlativas = comision.plan_asignaturas?.correlativas ?? [];

  return {
    ...comision,
    id_plan: comision.plan_asignaturas?.plan_id ?? null,
    correlativas_nombres: correlativas.map(
      (correlativa) =>
        mapaNombresAsignatura[correlativa.asignatura_id] ??
        `Asignatura #${correlativa.asignatura_id}`
    ),
  };
}

// Estados que YA NO ocupan lugar en el cupo
const ESTADOS_NO_OCUPAN_CUPO = new Set([
  "Rechazada",
  "Cancelada",
  "Anulada",
  "Baja",
]);

/**
 * Cuenta inscriptos por comisión a partir de las inscripciones del back.
 * Ocupan cupo todas excepto rechazadas/canceladas/anuladas/baja.
 */
async function contarInscriptosPorComision() {
  const response = await getListaDeInscripciones();
  const lista = response?.data ?? [];

  const conteo = {};

  for (const ins of lista) {
    const id = ins.id_comision_asignatura;
    if (id == null) continue;

    const nombreEstado = ins.estado?.nombre ?? "";
    if (ESTADOS_NO_OCUPAN_CUPO.has(nombreEstado)) continue;

    conteo[id] = (conteo[id] ?? 0) + 1;
  }

  return conteo;
}

function enriquecerComisionConCupo(comision, conteo) {
  const cupo_maximo = comision.cupo_maximo ?? 0;
  const inscriptos = conteo[comision.id_comision_asignatura] ?? 0;

  return {
    ...comision,
    cupo_maximo,
    inscriptos,
    // por si algún componente viejo lee "cupo"
    cupo: cupo_maximo,
  };
}

// Comisiones que el alumno puede cursar (correlativas + cupo real)
export async function obtenerComisionesDisponibles(numeroLegajo) {
  const legajo = await buscarLegajo(numeroLegajo);

  const [comisiones, todasLasComisiones, resultados, conteo] = await Promise.all([
    obtenerComisionesPorIdLegajo(legajo.id_legajo),
    obtenerComisiones(),
    obtenerResultadosAcademicos(legajo.id_legajo),
    contarInscriptosPorComision(),
  ]);

  const materiasAprobadas = obtenerMateriasAprobadasDeResultados(resultados, todasLasComisiones);
  const mapaNombresAsignatura = construirMapaNombresDeAsignatura(todasLasComisiones);

  return comisiones
    .map((c) => enriquecerComisionConCupo(c, conteo))
    .map((c) => enriquecerComisionConPlanYCorrelativas(c, mapaNombresAsignatura))
    .filter((comision) => {
      // 1. Correlativas (seguro si falta plan_asignaturas)
      const correlativas = comision.plan_asignaturas?.correlativas ?? [];

      if (correlativas.length > 0) {
        const cumple = correlativas.every((correlativa) =>
          materiasAprobadas.includes(correlativa.asignatura_id)
        );
        if (!cumple) return false;
      }

      // 2. Cupo real
      if (comision.inscriptos >= comision.cupo_maximo) {
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
    id_comision_asignatura: idComision
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
        const com = comisiones.find(c => c.id_comision_asignatura === ins.id_comision_asignatura);
        return {
            id: ins.id_inscripcion,
            id_comision: ins.id_comision_asignatura,
            id_comision_asignatura: ins.id_comision_asignatura, // ← agregar
            materia: com?.nombre ?? "-",
            comision: com?.comision.descripcion ?? "-",
            horario: com?.modalidad ?? "-",
            estado: ins.estado.nombre,
            fecha_inscripcion: ins.fecha_inscripcion,
        };
    });
}