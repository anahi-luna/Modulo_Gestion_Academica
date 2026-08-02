// Arma mis evaluaciones agrupadas por comisión para la vista del alumno.
// Reutiliza obtenerMisInscripciones (mismo back que el resto del sistema)
// y para cada inscripción trae las evaluaciones de esa comisión.

import { obtenerMisInscripciones } from "./inscripcionesService";
import { getEvaluaciones } from "./evaluacionesAdminService";

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

    const porComision = await Promise.all(
        inscripciones.map((inscripcion) =>
            getEvaluaciones(inscripcion.id_comision_asignatura)
        )
    );

    return porComision.flat();
}