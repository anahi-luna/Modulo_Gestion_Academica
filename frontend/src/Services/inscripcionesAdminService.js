// Servicio de Administración de Inscripciones
// Toda la comunicación entre la vista Administrador
// y el backend se realiza desde este archivo.

import {
    getListaDeInscripciones,
    getInscripcionPorId,
    actualizarInscripcion,
    eliminarInscripcion,
    getInscripcionesPorComision
} from "../api/inscripcionesApi";

import { getLegajoPorId } from "../api/legajosApi";
import { getComisiones } from "../api/comisiones";

// Obtiene todas las inscripciones
export async function obtenerInscripciones() {

    const response = await getListaDeInscripciones();
    const comisiones = (await getComisiones()).data;
    const resultado = await Promise.all(

        response.data.map(async (inscripcion) => {

            const legajo = (
                await getLegajoPorId(inscripcion.id_legajo)
            ).data;

            const comision = comisiones.find(
                c => c.id_comision_asignatura === inscripcion.id_comision
            );

            return {

                id: inscripcion.id_inscripcion,

                id_legajo: legajo.numero_legajo,

                alumno: `${legajo.nombre} ${legajo.apellido}`,

                id_comision: inscripcion.id_comision,

                comision: comision?.comision.descripcion ?? "-",

                materia: comision?.nombre ?? "-",

                estado: inscripcion.estado.nombre,

                fecha_inscripcion:
                    inscripcion.fecha_inscripcion

            };

        })

    );

    return resultado;
}

// Obtener una inscripción
export async function obtenerInscripcion(id) {

    const response = await getInscripcionPorId(id);
    return response.data;

}

export async function obtenerInscripcionesPorComision(idComision) {

    const response = await getInscripcionesPorComision(idComision);

    const comisiones = (await getComisiones()).data;

    const resultado = await Promise.all(

        response.data.map(async (inscripcion) => {

            const legajo = (
                await getLegajoPorId(inscripcion.id_legajo)
            ).data;

            const comision = comisiones.find(
                c => c.id_comision_asignatura === inscripcion.id_comision
            );

            return {

                id_inscripcion: inscripcion.id_inscripcion,

                id_legajo: legajo.numero_legajo,

                alumno: `${legajo.nombre} ${legajo.apellido}`,

                dni: legajo.dni,

                //rango: legajo.rango,

                id_comision: inscripcion.id_comision,

                materia: comision?.nombre ?? "-",

                estado: inscripcion.estado.nombre,

            };

        })

    );

    return resultado;
}

// Actualizar inscripción
// Puede modificar: id_estado, id_comision o ambos.
export async function actualizarSolicitud(
    idInscripcion,
    datos
) {

    const response =
        await actualizarInscripcion(
            idInscripcion,
            datos
        );

    return response.data;

}

//Eliminar la inscripcion
export async function eliminarSolicitud(idInscripcion){

    return await eliminarInscripcion(idInscripcion);

}

// Obtener todas las comisiones
export async function obtenerComisiones() {

    const response = await getComisiones();

    return response.data;

}