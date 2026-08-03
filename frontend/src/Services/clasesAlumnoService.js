// Arma "mis clases" del lado del cliente: agarro mis inscripciones,
// y para cada una traigo las clases de esa comisión.
// Armo: 1) la lista agrupada por comisión, y 2) cuál es mi próxima clase.

import { getMisInscripciones } from "../api/inscripcionesApi";
import { getClases } from "./clasesAdminService";

export async function obtenerMisClases() {
    let inscripciones = [];

    try {
        inscripciones = await getMisInscripciones();
    } catch (error) {
        console.error("No pude traer inscripciones:", error);
        return { porComision: [], proximaClase: null };
    }

    if (inscripciones.length === 0) {
        return { porComision: [], proximaClase: null };
    }

    const porComision = await Promise.all(
        inscripciones.map(async (inscripcion) => {
            const clases = await getClases(inscripcion.id_comision_asignatura);
            const ordenadas = [...clases].sort(
                (a, b) => new Date(a.fecha) - new Date(b.fecha)
            );
            return {
                id_comision_asignatura: inscripcion.id_comision_asignatura,
                materia: inscripcion.materia,
                comision: inscripcion.comision,
                clases: ordenadas,
            };
        })
    );

    // de todas mis clases en todas mis comisiones, busco la próxima
    const hoy = new Date().toISOString().slice(0, 10);
    const proximaClase = porComision
        .flatMap((c) => c.clases)
        .filter((clase) => clase.fecha >= hoy)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0] ?? null;

    return { porComision, proximaClase };
}

// versión plana para GestionClases cuando entra un alumno
export async function obtenerMisClasesPlano(idLegajo) {
    const { porComision } = await obtenerMisClases(idLegajo);
    return porComision.flatMap((c) => c.clases);
}