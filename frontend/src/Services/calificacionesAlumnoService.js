// Esto arma "mis calificaciones" del lado del cliente: agarro mis
// inscripciones, para cada una busco las evaluaciones de esa comisión,
// y les cruzo la nota si ya la cargaron. El día que exista un endpoint
// tipo /api/calificaciones?id_legajo=X esto se simplifica mucho, pero
// mientras tanto lo armo así.

import { obtenerMisInscripciones } from "./inscripcionesService";
import { getEvaluaciones } from "./evaluacionesAdminService";

// Ya está conectado a la API real (getCalificacionesPorInscripcion).
import { getCalificacionesPorInscripcion } from "../api/calificacionesApi";

const NOTA_APROBACION = 6;

// Datos de prueba para poder ver la pantalla del alumno andando aunque
// todavía no haya inscripciones cargadas en el back (obtenerMisInscripciones
// pega contra /api/inscripciones real, así que si el back está caído o
// vacío para este legajo, no rompo la vista: uso este fallback).
const INSCRIPCIONES_FALLBACK = [
    { id: 1, id_comision: 1, materia: "Matafuegos I", comision: "COM-101-A" },
];

async function obtenerMisInscripcionesConFallback(idLegajo) {
    try {
        const inscripciones = await obtenerMisInscripciones(idLegajo);
        if (inscripciones.length > 0) return inscripciones;
        return INSCRIPCIONES_FALLBACK;
    } catch (error) {
        console.warn("No pude traer inscripciones reales, uso datos de prueba:", error);
        return INSCRIPCIONES_FALLBACK;
    }
}

export async function obtenerMisCalificaciones(idLegajo) {

    const inscripciones = await obtenerMisInscripcionesConFallback(idLegajo);

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
                    // El back llama a este campo "puntaje"; toda la UI de
                    // acá para adentro sigue hablando de "nota".
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