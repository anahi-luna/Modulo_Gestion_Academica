import * as legajosMock from "../mocks/legajosMock";
import * as comisionesMock from "../mocks/comisionesMock";
import { getAsistenciaPorClase, getAsistenciaPorId, actualizarAsistencia, registrarAsistencia} from "../api/asistenciasApi";
import { getInscripcionPorId } from "../api/inscripcionesApi";


//Obtiene todas las asistencias dependiendo de la comision

export async function obtenerAsistenciasPorClase(idClase) {

    const response =
        await getAsistenciaPorClase(idClase);

    const comisiones =
        (await comisionesMock.getComisiones()).data;

    const resultado = await Promise.all(

        response.data.map(async (asistencia) => {

            const inscripcion = await getListaDeInscripciones(asistencia.id_inscripcion);

            const legajo = (
                await legajosMock.getLegajoPorId(asistencia.id_legajo)
            ).data;

            const comision = comisiones.find(
                c => c.id === asistencia.id_comision
            );

            return {

                id: asistencia.id_asistencia,

                id_legajo: legajo.numero_legajo,

                alumno: `${legajo.nombre} ${legajo.apellido}`,

                dni: legajo.dni,

                rango: legajo.rango,

                id_inscripcion: inscripcion.id_inscripcion,

                id_comision: inscripcion.id_comision,

                codigo_comision: comision?.codigo ?? "-",

                materia: comision?.materia ?? "-",

                docente: comision?.docente ?? "-",

                horario: comision?.horario ?? "-",

                estado: asistencia.estado.nombre,

                observacion: asistencia.observacion,

            };

        })

    );

    return resultado;
}


//Actualiza la asistencia

export async function modificarAsistencia(idAsistencia, idEstado){
    return await actualizarAsistencia(idAsistencia, idEstado);

}

    