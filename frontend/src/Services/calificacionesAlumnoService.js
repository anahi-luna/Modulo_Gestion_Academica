// Arma "mis calificaciones" del lado del cliente: agarro mis
// inscripciones, para cada una busco las evaluaciones de esa comisión,
// y les cruzo la nota si ya la cargaron.

import { obtenerMisInscripciones } from "./inscripcionesService";
import { getEvaluaciones } from "./evaluacionesAdminService";
import { getCalificacionesPorInscripcion } from "../api/calificacionesApi";

const NOTA_APROBACION = 6;

export async function obtenerMisCalificaciones(idLegajo) {
    // si no hay inscripciones, la vista muestra estado vacío
    let inscripciones = [];

    try {
        inscripciones = await obtenerMisInscripciones(idLegajo);
    } catch (error) {
        console.error("No pude traer inscripciones:", error);
        return [];
    }

    if (inscripciones.length === 0) return [];

    const resultado = await Promise.all(
        inscripciones.map(async (inscripcion) => {
            const [evaluaciones, calificacionesRes] = await Promise.all([
                getEvaluaciones(inscripcion.id_comision),
                getCalificacionesPorInscripcion(inscripcion.id),
            ]);

            const calificaciones = calificacionesRes.data;

            const detalle = evaluaciones.map((ev) => {
                const calif = calificaciones.find(c => c.id_evaluacion === ev.id);
                return {
                    id_evaluacion: ev.id,
                    titulo: ev.titulo,
                    tipo: ev.tipo,
                    fecha: ev.fecha,
                    puntaje_maximo: ev.puntaje_maximo,
                   //nosotros lo llamamos "nota" en la vista, pero en el backend se llama "puntaje"
                    nota: calif?.puntaje ?? null,
                    observacion: calif?.observacion ?? "",
                };
            });

            const cargadas = detalle.filter(d => d.nota !== null);
            const promedio = cargadas.length > 0
                ? cargadas.reduce((acc, d) => acc + d.nota, 0) / cargadas.length
                : null;

            const todasCargadas = detalle.length > 0 && detalle.every(d => d.nota !== null);
            let estado = "Regular";
            if (todasCargadas) {
                estado = promedio >= NOTA_APROBACION ? "Aprobado" : "Desaprobado";
            }

            return {
                id_comision: inscripcion.id_comision,
                comision: inscripcion.comision,
                materia: inscripcion.materia,
                evaluaciones: detalle,
                promedio,
                estado,
            };
        })
    );

    return resultado;
}