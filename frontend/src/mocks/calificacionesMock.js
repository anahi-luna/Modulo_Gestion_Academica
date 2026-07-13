// Mock de calificaciones. Mismo criterio que evaluacionesMock.js: mismas
// funciones y misma forma de respuesta que va a tener api/calificacionesApi.js,
// así el día de mañana solo cambio el import en el Service y listo.
//
//id_inscripcion acá tiene que coincidir con un
// id_inscripcion real que exista en el back (porque PanelDetalleCalificaciones
// después busca ese id_inscripcion contra /api/inscripciones para sacar
// el legajo y el nombre del alumno). 

const delay = (ms = 300) =>
    new Promise((resolve) => setTimeout(resolve, ms));

let CALIFICACIONES = [
    // Notas de ejemplo para la evaluación 1 (Parcial 1, comisión 1).
    // id_inscripcion 1 y 2 son un ejemplo,después tengo que remplazar con los reales de la base
    { id_calificacion: 1, id_inscripcion: 1, id_evaluacion: 1, nota: 7, observacion: "" },
    { id_calificacion: 2, id_inscripcion: 2, id_evaluacion: 1, nota: 9, observacion: "" },
];

let siguienteId = 3;

export async function getCalificacionesPorEvaluacion(idEvaluacion) {
    await delay();

    return {
        status: "success",
        data: CALIFICACIONES.filter(c => c.id_evaluacion === Number(idEvaluacion)),
        message: "Calificaciones obtenidas correctamente",
    };
}

export async function getCalificacionesPorInscripcion(idInscripcion) {
    await delay();

    return {
        status: "success",
        data: CALIFICACIONES.filter(c => c.id_inscripcion === Number(idInscripcion)),
        message: "Calificaciones obtenidas correctamente",
    };
}

export async function getCalificacionPorId(id) {
    await delay();

    const calificacion = CALIFICACIONES.find(c => c.id_calificacion === Number(id));

    if (!calificacion) {
        return { status: "error", data: null, message: "Calificación no encontrada" };
    }

    return { status: "success", data: calificacion, message: "Calificación obtenida correctamente" };
}

// Actualiza una calificación puntual ya creada (nota y/o observación)
export async function actualizarCalificacion(idCalificacion, datos) {
    await delay(200);

    const calificacion = CALIFICACIONES.find(c => c.id_calificacion === Number(idCalificacion));

    if (!calificacion) {
        return { status: "error", data: null, message: "Calificación no encontrada" };
    }

    Object.assign(calificacion, datos);

    return { status: "success", data: calificacion, message: "Calificación actualizada correctamente" };
}

// Guarda en bloque todas las notas de una evaluación. Por cada alumno:
// si ya tenía nota cargada la piso, si no existe la creo.
export async function registrarCalificaciones(datos) {
    await delay(300);

    const { id_evaluacion, calificaciones } = datos;

    calificaciones.forEach(({ id_inscripcion, nota, observacion }) => {

        const existente = CALIFICACIONES.find(
            c => c.id_inscripcion === id_inscripcion && c.id_evaluacion === id_evaluacion
        );

        if (existente) {
            existente.nota = nota;
            existente.observacion = observacion;
        } else {
            CALIFICACIONES.push({
                id_calificacion: siguienteId++,
                id_inscripcion,
                id_evaluacion,
                nota,
                observacion,
            });
        }

    });

    return { status: "success", data: null, message: "Calificaciones guardadas correctamente" };
}