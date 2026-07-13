import * as legajosMock from "../mocks/legajosMock";
import * as comisionesMock from "../mocks/comisionesMock";
// TODO: cuando el back tenga listo /api/calificaciones, comento esta
// línea y descomento la de la api real.
// import { getCalificacionesPorEvaluacion, actualizarCalificacion, registrarCalificaciones } from "../api/calificacionesApi";
import { getCalificacionesPorEvaluacion, actualizarCalificacion, registrarCalificaciones } from "../mocks/calificacionesMock";
import { getInscripcionPorId } from "../api/inscripcionesApi";

const NOTA_APROBACION = 6;

// Obtiene las calificaciones ya cargadas para una evaluación puntual,
// uniendo con legajo/comisión (igual que obtenerAsistenciasPorClase).
export async function obtenerCalificacionesPorEvaluacion(idEvaluacion) {

    const response =
        await getCalificacionesPorEvaluacion(idEvaluacion);

    const comisiones =
        (await comisionesMock.getComisiones()).data;

    const resultado = await Promise.all(

        response.data.map(async (calificacion) => {

            const inscripcion = (await getInscripcionPorId(calificacion.id_inscripcion)).data;

            const legajo = (
                await (legajosMock.getLegajoPorId(inscripcion.id_legajo))
            ).data;

            const comision = comisiones.find(
                c => c.id === inscripcion.id_comision
            );

            return {

                id: calificacion.id_calificacion,

                id_legajo: legajo.numero_legajo,

                alumno: `${legajo.nombre} ${legajo.apellido}`,

                rango: legajo.rango,

                id_inscripcion: inscripcion.id_inscripcion,

                id_comision: inscripcion.id_comision,

                codigo_comision: comision?.codigo ?? "-",

                materia: comision?.materia ?? "-",

                nota: calificacion.nota,

                observacion: calificacion.observacion,

            };

        })

    );

    return resultado;
}

export async function registrarCalificacionesService(datos) {

    const response = await registrarCalificaciones(datos);

    return response.data;

}

// Actualiza la nota/observación de una calificación ya existente
export async function modificarCalificacion(idCalificacion, nota, observacion) {
    return await actualizarCalificacion(idCalificacion, { nota, observacion });
}

// Calcula estado (Aprobado/Desaprobado) para una nota puntual
export function estadoDeNota(nota) {
    if (nota === null || nota === undefined || nota === "") return "Pendiente";
    return Number(nota) >= NOTA_APROBACION ? "Aprobado" : "Desaprobado";
}
