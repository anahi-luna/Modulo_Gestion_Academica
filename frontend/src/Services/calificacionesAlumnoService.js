// Arma "mis calificaciones" del lado del cliente: agarro mis
// inscripciones, para cada una busco las evaluaciones de esa comisión,
// y les cruzo la nota si ya la cargaron.

import { obtenerMisInscripciones } from "./inscripcionesService";
import { obtenerMisEvaluacionesPlano } from "./evaluacionesAlumnoService";
import { getMisCalificaciones } from "../api/calificacionesApi";

const NOTA_APROBACION = 6;

export async function obtenerMisCalificaciones() {
    // si no hay inscripciones, la vista muestra estado vacío
    let inscripciones = [];

    try {
        inscripciones = await obtenerMisInscripciones();
    } catch (error) {
        console.error("No pude traer inscripciones:", error);
        return [];
    }

    if (inscripciones.length === 0) return [];

    const [evaluaciones, calificacionesRes] = await Promise.all([
        obtenerMisEvaluacionesPlano(),
        getMisCalificaciones(),
    ]);

    const calificaciones = calificacionesRes.data;

    const resultado = inscripciones.map((inscripcion) => {
        const evaluacionesDeLaComision = evaluaciones.filter(
            (ev) => ev.id_comision_asignatura === inscripcion.id_comision_asignatura
        );

        const detalle = evaluacionesDeLaComision.map((ev) => {
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
            id_comision_asignatura: inscripcion.id_comision_asignatura,
            comision: inscripcion.comision,
            materia: inscripcion.materia,
            evaluaciones: detalle,
            promedio,
            estado,
        };
    });

    return resultado;
}