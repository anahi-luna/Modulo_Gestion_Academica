import * as asistenciasMock from "../mocks/asistenciasMock";
import * as legajosMock from "../mocks/legajosMock";
import * as comisionesMock from "../mocks/comisionesMock";


//Obtiene todas las asistencias dependiendo de la comision

export async function obtenerAsistenciasPorComision(idComision) {

    const response =
        await asistenciasMock.getAsistenciasPorComision(idComision);

    const comisiones =
        (await comisionesMock.getComisiones()).data;

    const resultado = await Promise.all(

        response.data.map(async (asistencia) => {

            const legajo = (
                await legajosMock.getLegajoPorId(asistencia.id_legajo)
            ).data;

            const comision = comisiones.find(
                c => c.id === asistencia.id_comision
            );

            return {

                id: asistencia.id_asistencia,

                id_legajo: legajo.numero_legajo,

                nombre: `${legajo.nombre} ${legajo.apellido}`,

                dni: legajo.dni,

                rango: legajo.rango,

                id_comision: asistencia.id_comision,

                codigo_comision: comision?.codigo ?? "-",

                materia: comision?.materia ?? "-",

                docente: comision?.docente ?? "-",

                horario: comision?.horario ?? "-",

                estado: asistencia.estado,

            };

        })

    );

    return resultado;
}


//Actualiza la asistencia

export const actualizarAsistencia =
    asistenciasMock.actualizarAsistencia;