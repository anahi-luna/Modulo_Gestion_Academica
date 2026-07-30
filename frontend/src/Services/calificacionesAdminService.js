import * as legajosApi from "../api/legajosApi";
import { getComisiones } from "../api/comisiones";
import { getCalificacionesPorEvaluacion, actualizarCalificacion, registrarCalificaciones, eliminarCalificacion } from "../api/calificacionesApi";
import { getInscripcionPorId } from "../api/inscripcionesApi";
import { getListaEvaluaciones } from "../api/evaluacionesApi";

const NOTA_APROBACION = 6;

// Obtiene las calificaciones ya cargadas para una evaluación puntual,
// uniendo con legajo/comisión (igual que obtenerAsistenciasPorClase).
export async function obtenerCalificacionesPorEvaluacion(idEvaluacion) {

    const response =
        await getCalificacionesPorEvaluacion(idEvaluacion);

    const comisiones = (await getComisiones()).data;


    const resultado = await Promise.all(

        response.data.map(async (calificacion) => {

            const inscripcion = (await getInscripcionPorId(calificacion.id_inscripcion)).data;

            const legajo = (
            await (legajosApi.getLegajoPorId(inscripcion.id_legajo))
            ).data;

            const comision = comisiones.find(
                c => c.id_comision_asignatura === inscripcion.id_comision_asignatura
            );

            return {

                // Guardo el id_calificacion real: lo necesito después
                // en guardarCalificaciones para saber si esta fila hay
                // que actualizarla (PUT) en vez de crearla (POST).
                id: calificacion.id_calificacion,

                id_legajo: legajo.numero_legajo,

                alumno: `${legajo.nombre} ${legajo.apellido}`,

                //rango: legajo.rango,

                id_inscripcion: inscripcion.id_inscripcion,

                id_comision_asignatura: inscripcion.id_comision_asignatura,

                codigo_comision: comision?.comision.descripcion ?? "-",

                materia: comision?.nombre ?? "-",

                nota: calificacion.puntaje,

                observacion: calificacion.observacion,

            };

        })

    );

    return resultado;
}

// Recibe { id_evaluacion, calificaciones: [{ id?, id_inscripcion, nota,
// observacion }] }. Las filas con "id" (ya tenían una calificación
// cargada) se actualizan con PUT; las que no tienen "id" y tienen una
// nota puesta se crean juntas con un solo POST en bloque.
export async function registrarCalificacionesService(datos) {

    const conNotaCargada = datos.calificaciones.filter(
        c => c.nota !== null && c.nota !== "" && c.nota !== undefined
    );

    const nuevas = conNotaCargada.filter(c => !c.id);

    const existentes = conNotaCargada.filter(c => c.id);

    const tareas = [];

    if (nuevas.length > 0) {
        tareas.push(
            registrarCalificaciones({
                id_evaluacion: datos.id_evaluacion,
                calificaciones: nuevas.map(c => ({
                    id_inscripcion: c.id_inscripcion,
                    puntaje: Number(c.nota),
                    observacion: c.observacion || undefined,
                })),
            })
        );
    }

    for (const c of existentes) {
        tareas.push(
            actualizarCalificacion(c.id, {
                puntaje: Number(c.nota),
                observacion: c.observacion || undefined,
            })
        );
    }

    return await Promise.all(tareas);

}

// Actualiza la nota/observación de una calificación ya existente
export async function modificarCalificacion(idCalificacion, nota, observacion) {
    return await actualizarCalificacion(idCalificacion, { puntaje: Number(nota), observacion });
}

// Calcula estado (Aprobado/Desaprobado) para una nota puntual
export function estadoDeNota(nota) {
    if (nota === null || nota === undefined || nota === "") return "Pendiente";
    return Number(nota) >= NOTA_APROBACION ? "Aprobado" : "Desaprobado";
}


export async function eliminarCalificacionService(idCalificacion) {
    return await eliminarCalificacion(idCalificacion);
}

export async function eliminarCalificacionesPorEvaluacion(idEvaluacion) {

    const calificaciones = await obtenerCalificacionesPorEvaluacion(idEvaluacion);

    if (calificaciones.length === 0) {
        return {
            cantidadEliminada: 0,
        };
    }

    await Promise.all(
        calificaciones.map((calificacion) => eliminarCalificacionService(calificacion.id))
    );

    return {
        cantidadEliminada: calificaciones.length,
    };
}

export async function obtenerHistorialCalificacionesPorComision(idComision) {
    const response = await getListaEvaluaciones(idComision);

    const evaluaciones = response.data ?? [];

    const evaluacionesConCalificaciones =
        await Promise.all(
            evaluaciones.map(async (evaluacion) => {
                const calificaciones = await obtenerCalificacionesPorEvaluacion(evaluacion.id_evaluacion);

                if (calificaciones.length === 0) {
                    return null;
                }

                return {
                    id: evaluacion.id_evaluacion,
                    id_comision_asignatura: evaluacion.id_comision_asignatura,
                    titulo: evaluacion.titulo,
                    tipo: evaluacion.tipo_evaluacion?.nombre ?? "-",
                    fecha: evaluacion.fecha_evaluacion,
                    puntaje_maximo: evaluacion.puntaje_maximo,
                    cantidad_calificaciones: calificaciones.length,
                };
            })
        );

    return evaluacionesConCalificaciones.filter(Boolean);
}