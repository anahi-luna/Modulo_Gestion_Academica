// Arma "mis clases" (próximas clases) del lado del cliente: agarro mis
// inscripciones, y para cada una traigo las clases de esa comisión.
// Con eso armo: 1) la lista agrupada por comisión (para el Home y para
// "Mi plan"/detalle), y 2) cuál es mi próxima clase en general (la más
// cercana entre TODAS mis comisiones).
//
// Nota: esto duplica el fetch de clases que también hace
// asistenciaAlumnoService.js. Los dejo separados a propósito para que
// cada service sea independiente y fácil de leer; si el día de mañana
// se nota lento, se puede compartir un único fetch entre los dos.

import { obtenerMisInscripciones } from "./inscripcionesService";
import { getClases } from "./clasesAdminService";

// Mismo fallback que usa calificacionesAlumnoService.js: si todavía no
// hay inscripciones reales cargadas para este legajo, uso datos de
// prueba para que la pantalla no quede vacía.
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

export async function obtenerMisClases(idLegajo) {
  const inscripciones = await obtenerMisInscripcionesConFallback(idLegajo);

  const porComision = await Promise.all(
    inscripciones.map(async (inscripcion) => {
      const clases = await getClases(inscripcion.id_comision);
      const ordenadas = [...clases].sort(
        (a, b) => new Date(a.fecha) - new Date(b.fecha)
      );
      return {
        id_comision: inscripcion.id_comision,
        materia: inscripcion.materia,
        comision: inscripcion.comision,
        clases: ordenadas,
      };
    })
  );

  // De todas mis clases en todas mis comisiones, busco la próxima
  // (fecha de hoy en adelante), sea de la comisión que sea.
  const hoy = new Date().toISOString().slice(0, 10);
  const proximaClase = porComision
    .flatMap((c) => c.clases)
    .filter((clase) => clase.fecha >= hoy)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0] ?? null;

  return { porComision, proximaClase };
}