import * as legajosMock from "../mocks/legajosMock";
import * as comisionesMock from "../mocks/comisionesMock";
import { getAsistenciaPorClase, getAsistenciaPorId, actualizarAsistencia, registrarAsistencia} from "../api/asistenciasApi";
import { getInscripcionPorId } from "../api/inscripcionesApi";
import { modificarClase } from "./clasesAdminService";


//Obtiene todas las asistencias dependiendo de la comision

export async function obtenerAsistenciasPorClase(idClase) {

    const response =
        await getAsistenciaPorClase(idClase);

    const comisiones =
        (await comisionesMock.getComisiones()).data;

    const resultado = await Promise.all(

        response.data.map(async (asistencia) => {

            const inscripcion = (await getInscripcionPorId(asistencia.id_inscripcion)).data;

            const legajo = (
                await (legajosMock.getLegajoPorId(inscripcion.id_legajo))
            ).data;

            const comision = comisiones.find(
                c => c.id === inscripcion.id_comision
            );

            return {

                id: asistencia.id_asistencia,

                id_legajo: legajo.numero_legajo,

                alumno: `${legajo.nombre} ${legajo.apellido}`,

                rango: legajo.rango,

                id_inscripcion: inscripcion.id_inscripcion,

                id_comision: inscripcion.id_comision,

                codigo_comision: comision?.codigo ?? "-",

                materia: comision?.materia ?? "-",

                docente: comision?.docente ?? "-",

                horario: comision?.horario ?? "-",

                id_estado: asistencia.id_estado,

                observacion: asistencia.observacion,

            };

        })

    );

    return resultado;
}

export async function registrarAsistenciaService(datos) {

    const response = await registrarAsistencia(datos);

    return response.data;

}

//Actualiza la asistencia

export async function modificarAsistencia(idAsistencia, idEstado){
    return await actualizarAsistencia(idAsistencia, idEstado);

}

//Actualiza el estado de la clase automaticamente segun la hora y dia de la clase,
//para poder tomar asistencia
export async function actualizarEstadoAutomaticamente(clase) {
    const ahora = new Date();
    const inicio = new Date(`${clase.fecha}T${clase.hora_inicio}`);

    if (
        clase.estado === "PROGRAMADA" &&
        inicio <= ahora
    ) {
        await modificarClase(clase.id, {
            id_comision: clase.id_comision,
            estado: "DICTADA"
        });

        return {
            ...clase,
            estado: "DICTADA"
        };
    }

    return clase;
}