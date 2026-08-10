// Servicios relacionados con la asistencia de los alumnos a las clases.
// Muestra su propia asistencia en cada comisión en la que está inscripto.

import { obtenerMisInscripciones } from "./inscripcionesService";
import { obtenerMisClasesPlano } from "./clasesAlumnoService";
import { getMisAsistencias } from "../api/asistenciasApi";
import { getEstadosAsistencia } from "../api/catalogosApi";

export async function obtenerMiAsistencia() {
    let inscripciones = [];

    const resumenVacio = { presentes: 0, ausentes: 0, justificados: 0, tarde: 0, registradas: 0, porcentaje: 0 };

    try {
        inscripciones = await obtenerMisInscripciones();
    } catch (error) {
        console.error("No pude traer inscripciones:", error);
        return { porComision: [], resumen: resumenVacio };
    }

    if (inscripciones.length === 0) return { porComision: [], resumen: resumenVacio };

    // Obtener los estados de asistencia desde el backend (no IDs hardcodeados)
    let estadosAsistencia = [];
    try {
        estadosAsistencia = await getEstadosAsistencia();
    } catch (error) {
        console.error("No pude traer los estados de asistencia:", error);
        return { porComision: [], resumen: resumenVacio };
    }

    // Mapa: id_estado_asistencia -> nombre (Ej: 1 -> "Presente")
    const mapaEstados = Object.fromEntries(estadosAsistencia.map((estado) => [estado.id_estado_asistencia, estado.nombre]));
    const clases = await obtenerMisClasesPlano();
    const porComision = await Promise.all(
        inscripciones.map(async (inscripcion) => {
            const clasesComision = clases.filter((clase) => clase.id_comision_asignatura === inscripcion.id_comision_asignatura);

            const detalle = await Promise.all(
                clases.map(async (clase) => {
                    const mia = await getMisAsistencias(clase.id);
                    return {
                        id_clase: clase.id,
                        fecha: clase.fecha,
                        tema: clase.tema,
                        estado: mia.data ? mapaEstados[mia.data.id_estado] ?? "Sin registrar" : "Sin registrar",
                        observacion: mia.data?.observacion || "-"
                    };
                })
            );

            const presentes = detalle.filter((d) => d.estado === "Presente").length;
            const ausentes = detalle.filter((d) => d.estado === "Ausente").length;
            const justificados = detalle.filter((d) => d.estado === "Justificado").length;
            const tarde = detalle.filter((d) => d.estado === "Tarde").length;
            const registradas = presentes + ausentes + justificados + tarde;

            // Tarde cuenta como asistencia a los fines del porcentaje.
            const porcentaje = registradas > 0 ? Math.round(((presentes + tarde) / registradas) * 100) : 0;

            return {
                id_comision_asignatura: inscripcion.id_comision_asignatura,
                materia: inscripcion.materia,
                comision: inscripcion.comision,
                detalle,
                presentes,
                ausentes,
                justificados,
                tarde,
                registradas,
                porcentaje
            };
        })
    );

    // Resumen global: suma los contadores de todas las comisiones.
    const totales = porComision.reduce(
        (acc, c) => ({
            presentes: acc.presentes + c.presentes,
            ausentes: acc.ausentes + c.ausentes,
            justificados: acc.justificados + c.justificados,
            tarde: acc.tarde + c.tarde,
            registradas: acc.registradas + c.registradas
        }),
        { presentes: 0, ausentes: 0, justificados: 0, tarde: 0, registradas: 0 }
    );

    const porcentaje = totales.registradas > 0 ? Math.round(((totales.presentes + totales.tarde) / totales.registradas) * 100) : 0;

    return {
        porComision,
        resumen: { ...totales, porcentaje }
    };
}