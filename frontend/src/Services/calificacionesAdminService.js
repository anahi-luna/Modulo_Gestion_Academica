import * as legajosMock from "../mocks/legajosMock";
import * as comisionesMock from "../mocks/comisionesMock";

// Ya está conectado a la API real del back. Dos cosas importantes que
// tuve que resolver acá (no en la UI) para que todo siga funcionando
// igual que antes:
//
// 1. El back llama al campo de la nota "puntaje", no "nota". Toda la
//    UI (CalificacionTabla, AlumnoNotaRow, etc.) sigue hablando de
//    "nota" puertas para adentro; la traducción puntaje<->nota queda
//    encapsulada acá.
//
// 2. El back NO permite volver a registrar una calificación que ya
//    existe para esa (evaluación, inscripción): POST /calificaciones
//    tira error "La calificación ya fue registrada" si ya hay una. Por
//    eso "Guardar calificaciones" ya no manda todo el lote por POST
//    como antes: separa las filas SIN nota previa (recién cargadas,
//    van por POST en bloque) de las filas que YA tenían una
//    calificación (van por PUT una por una, solo si cambiaron).
import { getCalificacionesPorEvaluacion, actualizarCalificacion, registrarCalificaciones } from "../api/calificacionesApi";
import { getInscripcionPorId } from "../api/inscripcionesApi";

const NOTA_APROBACION = 6;

// Obtiene las calificaciones ya cargadas para una evaluación puntual,
// uniendo con legajo/comisión (igual que obtenerAsistenciasPorClase).
export async function obtenerCalificacionesPorEvaluacion(idEvaluacion) {

    const response =
        await getCalificacionesPorEvaluacion(idEvaluacion);

    const comisiones =
        (await comisionesMock.getComisiones()).data;

    const resultado = await Promise.all(

        response.data.map(async (calificacion) => {

            const inscripcion = (await getInscripcionPorId(calificacion.id_inscripcion)).data;

            const legajo = (
                await (legajosMock.getLegajoPorId(inscripcion.id_legajo))
            ).data;

            const comision = comisiones.find(
                c => c.id === inscripcion.id_comision
            );

            return {

                // Guardo el id_calificacion real: lo necesito después
                // en guardarCalificaciones para saber si esta fila hay
                // que actualizarla (PUT) en vez de crearla (POST).
                id: calificacion.id_calificacion,

                id_legajo: legajo.numero_legajo,

                alumno: `${legajo.nombre} ${legajo.apellido}`,

                rango: legajo.rango,

                id_inscripcion: inscripcion.id_inscripcion,

                id_comision: inscripcion.id_comision,

                codigo_comision: comision?.codigo ?? "-",

                materia: comision?.materia ?? "-",

                nota: calificacion.puntaje,

                observacion: calificacion.observacion,

            };

        })

    );

    return resultado;
}

// Recibe { id_evaluacion, calificaciones: [{ id?, id_inscripcion, nota,
// observacion }] }. Las filas con "id" (ya tenían una calificación
// cargada) se actualizan con PUT; las que no tienen "id" y tienen una
// nota puesta se crean juntas con un solo POST en bloque.
export async function registrarCalificacionesService(datos) {

    const conNotaCargada = datos.calificaciones.filter(
        c => c.nota !== null && c.nota !== "" && c.nota !== undefined
    );

    const nuevas = conNotaCargada.filter(c => !c.id);

    const existentes = conNotaCargada.filter(c => c.id);

    const tareas = [];

    if (nuevas.length > 0) {
        tareas.push(
            registrarCalificaciones({
                id_evaluacion: datos.id_evaluacion,
                calificaciones: nuevas.map(c => ({
                    id_inscripcion: c.id_inscripcion,
                    puntaje: Number(c.nota),
                    observacion: c.observacion || undefined,
                })),
            })
        );
    }

    for (const c of existentes) {
        tareas.push(
            actualizarCalificacion(c.id, {
                puntaje: Number(c.nota),
                observacion: c.observacion || undefined,
            })
        );
    }

    return await Promise.all(tareas);

}

// Actualiza la nota/observación de una calificación ya existente
export async function modificarCalificacion(idCalificacion, nota, observacion) {
    return await actualizarCalificacion(idCalificacion, { puntaje: Number(nota), observacion });
}

// Calcula estado (Aprobado/Desaprobado) para una nota puntual
export function estadoDeNota(nota) {
    if (nota === null || nota === undefined || nota === "") return "Pendiente";
    return Number(nota) >= NOTA_APROBACION ? "Aprobado" : "Desaprobado";
}
