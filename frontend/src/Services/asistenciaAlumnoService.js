// servicios relacionados con la asistencia de los alumnos a las clases, para el alumno
//  muestra su propia asistencia en cada comisión en la que está inscripto.
import { obtenerMisInscripciones } from "./inscripcionesService";
import { getClases } from "./clasesAdminService";
import { getMisAsistencias } from "../api/asistenciasApi";

// mismo mapeo que usa EstadoSelect.jsx en la vista de gestión
const ESTADOS = {
    1: "Presente",
    2: "Ausente",
    3: "Justificado",
    4: "Tarde",
};

export async function obtenerMiAsistencia() {
    // si no hay inscripciones, devuelvo estructura vacía
    let inscripciones = [];

    try {
        inscripciones = await obtenerMisInscripciones();
    } catch (error) {
        console.error("No pude traer inscripciones:", error);
        return { porComision: [], resumen: { presentes: 0, ausentes: 0, justificados: 0, tarde: 0, registradas: 0, porcentaje: 0 } };
    }

    if (inscripciones.length === 0) {
        return {
            porComision: [],
            resumen: { presentes: 0, ausentes: 0, justificados: 0, tarde: 0, registradas: 0, porcentaje: 0 },
        };
    }

    // necesito el número de legajo (string) para encontrarme entre
    // todos los integrantes de cada clase, que es lo que devuelve
    // obtenerAsistenciasPorClase en el campo id_legajo


    const porComision = await Promise.all(
        inscripciones.map(async (inscripcion) => {
            const clases = await getClases(inscripcion.id_comision_asignatura);

            const detalle = await Promise.all(
                clases.map(async (clase) => {
                    const mia = await getMisAsistencias(clase.id);

                    return {
                        id_clase: clase.id,
                        fecha: clase.fecha,
                        tema: clase.tema,
                        estado: mia.data ? ESTADOS[mia.data.id_estado] ?? "Sin registrar" : "Sin registrar",
                        observacion: mia.data ?.observacion || "-",
                    };
                })
            );

            const presentes    = detalle.filter((d) => d.estado === "Presente").length;
            const ausentes     = detalle.filter((d) => d.estado === "Ausente").length;
            const justificados = detalle.filter((d) => d.estado === "Justificado").length;
            const tarde        = detalle.filter((d) => d.estado === "Tarde").length;
            const registradas  = presentes + ausentes + justificados + tarde;

            // tarde cuenta como asistencia a los fines del %
            const porcentaje = registradas > 0
                ? Math.round(((presentes + tarde) / registradas) * 100)
                : 0;

            return {
                id_comision: inscripcion.id_comision_asignatura,
                materia: inscripcion.materia,
                comision: inscripcion.comision,
                detalle,
                presentes,
                ausentes,
                justificados,
                tarde,
                registradas,
                porcentaje,
            };
        })
    );

    // resumen global: sumo los contadores de todas las comisiones
    const totales = porComision.reduce(
        (acc, c) => ({
            presentes:    acc.presentes    + c.presentes,
            ausentes:     acc.ausentes     + c.ausentes,
            justificados: acc.justificados + c.justificados,
            tarde:        acc.tarde        + c.tarde,
            registradas:  acc.registradas  + c.registradas,
        }),
        { presentes: 0, ausentes: 0, justificados: 0, tarde: 0, registradas: 0 }
    );

    const porcentaje = totales.registradas > 0
        ? Math.round(((totales.presentes + totales.tarde) / totales.registradas) * 100)
        : 0;

    return {
        porComision,
        resumen: { ...totales, porcentaje },
    };
}