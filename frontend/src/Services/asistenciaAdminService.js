// Servicio para manejar la lógica de negocio de asistencias, incluyendo llamadas a la API y procesamiento de datos.
import * as legajosMock from "../mocks/legajosMock";
import * as comisionesMock from "../mocks/comisionesMock";
import { getAsistenciaPorClase, getAsistenciaPorId, actualizarAsistencia, registrarAsistencia, eliminarAsistencia} from "../api/asistenciasApi";
import { getInscripcionPorId } from "../api/inscripcionesApi";
import { modificarClase } from "./clasesAdminService";
import { getClases } from "./clasesAdminService";

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

export async function modificarAsistencia(idAsistencia, datos){
    return await actualizarAsistencia(idAsistencia, datos);

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

//Devuelve las clases que ya se les tomo asistencias
export async function obtenerHistorialPorComision(idComision){
    const clases = await getClases(idComision);

    console.log("Clases de la comisión:", clases);

    const resultados = await Promise.all(
        clases.map(async (clase) => {
            const asistencias = await obtenerAsistenciasPorClase(clase.id);

            console.log(
                `Asistencias de clase ${clase.id}:`,
                asistencias
            );

            if(asistencias.length === 0){
                return null;
            }

            return{
                ...clase,
                    cantidad_asistencias: asistencias.length,
            };
        })
    );

    return resultados.filter(Boolean)
}

//Elimina asistencia
export async function eliminarAsistenciaService(idAsistencia) {
    return await eliminarAsistencia(idAsistencia);
}

//Elimina todas las asistencias por clase, yendo una por una.
export async function eliminarAsistenciasPorClase(
    idClase
) {
    const asistencias =
        await obtenerAsistenciasPorClase(idClase);

    if (asistencias.length === 0) {
        return {
            cantidadEliminada: 0,
        };
    }

    await Promise.all(
        asistencias.map((asistencia) =>
            eliminarAsistenciaService(asistencia.id)
        )
    );

    return {
        cantidadEliminada: asistencias.length,
    };
}