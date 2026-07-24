// Arma "mi asistencia" del lado del cliente: agarro mis inscripciones,
// para cada una traigo sus clases, y para cada clase busco mi propio
// registro de asistencia filtrando por mi número de legajo.
// getLegajoPorId sigue siendo del mock porque legajos es el microservicio
// del otro grupo, no el nuestro.

import { obtenerMisInscripciones } from "./inscripcionesService";
import { getClases } from "./clasesAdminService";
import { obtenerAsistenciasPorClase } from "./asistenciaAdminService";
import { getLegajoPorId } from "../mocks/legajosMock";

// mismo mapeo que usa EstadoSelect.jsx en la vista de gestión
const ESTADOS = {
    1: "Presente",
    2: "Ausente",
    3: "Justificado",
    4: "Tarde",
};

export async function obtenerMiAsistencia(idLegajo) {
    // si no hay inscripciones, devuelvo estructura vacía
    let inscripciones = [];

    try {
        inscripciones = await obtenerMisInscripciones(idLegajo);
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
    const legajoRes = await getLegajoPorId(idLegajo);
    const numeroLegajo = legajoRes.data.numero_legajo;

    const porComision = await Promise.all(
        inscripciones.map(async (inscripcion) => {
            const clases = await getClases(inscripcion.id_comision);

            const detalle = await Promise.all(
                clases.map(async (clase) => {
                    const asistenciasClase = await obtenerAsistenciasPorClase(clase.id);
                    const mia = asistenciasClase.find((a) => a.id_legajo === numeroLegajo);

                    return {
                        id_clase: clase.id,
                        fecha: clase.fecha,
                        tema: clase.tema,
                        estado: mia ? ESTADOS[mia.id_estado] ?? "Sin registrar" : "Sin registrar",
                        observacion: mia?.observacion || "-",
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
                id_comision: inscripcion.id_comision,
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