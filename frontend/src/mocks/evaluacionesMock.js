// Mock de evaluaciones. Lo armé con las mismas funciones y la misma forma
// de respuesta que va a tener api/evaluacionesApi.js cuando el back esté
// listo, para no tener que tocar nada en los Services después: el día que
// cambie el import de este archivo por el de la api real, todo el resto
// sigue funcionando igual.

const delay = (ms = 300) =>
    new Promise((resolve) => setTimeout(resolve, ms));

// Evaluaciones de prueba. Le puse notas ya cargadas a la evaluación 1
// (comisión 1) para poder ver la planilla llena apenas entro, sin
// depender de que existan inscripciones reales en el back.
let EVALUACIONES = [
    { id_evaluacion: 1, id_comision: 1, titulo: "Parcial 1",                 tipo: "Parcial", fecha: "2026-04-10", puntaje_maximo: 10 },
    { id_evaluacion: 2, id_comision: 1, titulo: "TP Extinción de Incendios", tipo: "TP",       fecha: "2026-05-05", puntaje_maximo: 10 },
    { id_evaluacion: 3, id_comision: 1, titulo: "Final",                    tipo: "Final",    fecha: "2026-06-15", puntaje_maximo: 10 },

    { id_evaluacion: 4, id_comision: 4, titulo: "Parcial 1",                tipo: "Parcial",  fecha: "2026-04-20", puntaje_maximo: 10 },
    { id_evaluacion: 5, id_comision: 4, titulo: "Final",                    tipo: "Final",    fecha: "2026-06-20", puntaje_maximo: 10 },

    { id_evaluacion: 6, id_comision: 6, titulo: "Parcial Único",            tipo: "Parcial",  fecha: "2026-05-30", puntaje_maximo: 10 },
];

let siguienteId = 7;

export async function getListaEvaluaciones(idComision) {
    await delay();

    const data = idComision
        ? EVALUACIONES.filter(ev => ev.id_comision === idComision)
        : EVALUACIONES;

    return {
        status: "success",
        data,
        message: "Evaluaciones obtenidas correctamente",
    };
}

export async function getEvaluacionPorId(id) {
    await delay();

    const evaluacion = EVALUACIONES.find(ev => ev.id_evaluacion === Number(id));

    if (!evaluacion) {
        return { status: "error", data: null, message: "Evaluación no encontrada" };
    }

    return { status: "success", data: evaluacion, message: "Evaluación obtenida correctamente" };
}

export async function crearEvaluacion(datos) {
    await delay();

    const nueva = {
        id_evaluacion: siguienteId++,
        id_comision: datos.id_comision,
        titulo: datos.titulo,
        tipo: datos.tipo,
        fecha: datos.fecha,
        puntaje_maximo: datos.puntaje_maximo ?? 10,
    };

    EVALUACIONES.push(nueva);

    return { status: "success", data: nueva, message: "Evaluación creada correctamente" };
}

export async function editarEvaluacion(id, datos) {
    await delay();

    const evaluacion = EVALUACIONES.find(ev => ev.id_evaluacion === Number(id));

    if (!evaluacion) {
        return { status: "error", data: null, message: "Evaluación no encontrada" };
    }

    Object.assign(evaluacion, datos);

    return { status: "success", data: evaluacion, message: "Evaluación actualizada correctamente" };
}

export async function eliminarEvaluacion(id) {
    await delay();

    EVALUACIONES = EVALUACIONES.filter(ev => ev.id_evaluacion !== Number(id));

    // eliminarCalificacionesDeEvaluacion(id);

    return { status: "success", data: null, message: "Evaluación eliminada correctamente" };
}