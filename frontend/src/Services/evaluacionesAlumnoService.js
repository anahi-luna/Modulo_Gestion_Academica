// Arma mis evaluaciones agrupadas por comisión para la vista del alumno.
// Reutiliza obtenerMisInscripciones (mismo back que el resto del sistema)
// y para cada inscripción trae las evaluaciones de esa comisión.

import { obtenerMisInscripciones } from "./inscripcionesService";
import { getMisEvaluaciones } from "../api/evaluacionesApi";
import { getComisiones, obtenerDocenteTitular } from "../api/comisiones";

export async function obtenerMisEvaluacionesPlano(idLegajo) {
    // si no hay inscripciones devuelvo vacío, la vista muestra estado vacío
    let inscripciones = [];

    try {
        inscripciones = await obtenerMisInscripciones(idLegajo);
    } catch (error) {
        console.error("No pude traer inscripciones:", error);
        return [];
    }

    if (inscripciones.length === 0) return [];

    const [evaluacionesResponse, comisionesResponse] = await Promise.all([
        getMisEvaluaciones(),
        getComisiones(),
    ]);

    const comisiones = comisionesResponse.data;

    // mismo formato que devolvía evaluacionesAdminService.getEvaluaciones,
    // para no romper filtros ni tabla de la vista de alumno
    return evaluacionesResponse.data.map((evaluacion) => {
        const comision = comisiones.find(
            (c) => c.id_comision_asignatura === evaluacion.id_comision_asignatura
        );

        return {
            id: evaluacion.id_evaluacion,
            id_comision: evaluacion.id_comision_asignatura,
            id_comision_asignatura: evaluacion.id_comision_asignatura,
            id_tipo_evaluacion: evaluacion.id_tipo_evaluacion,
            codigo: comision?.comision?.descripcion ?? "-",
            materia: comision?.nombre ?? "-",
            docente: obtenerDocenteTitular(comision),
            titulo: evaluacion.titulo,
            tipo: evaluacion.tipo_evaluacion?.nombre ?? "-",
            fecha: evaluacion.fecha_evaluacion,
            puntaje_maximo: evaluacion.puntaje_maximo,
        };
    });
}