import { getListaClases, getClasePorId, crearClase, editarClase, eliminarClase } from "../api/clasesApi";

import { getComisiones, obtenerDocenteTitular } from "../api/comisiones";

// Obtiene todas las clases de una comisión
export async function getClases(idComision) {

    const response = await getListaClases(idComision);

    const comisiones = (await getComisiones()).data;

    const resultado = response.data.map((clase) => {

        const comision = comisiones.find(
            c => c.id_comision_asignatura === clase.id_comision_asignatura
        );

        return {

            id: clase.id_clase,

            id_comision_asignatura: clase.id_comision_asignatura,

            numero_clase: clase.numero_clase,

            codigo: comision?.comision.descripcion ?? "-",

            materia: comision?.nombre ?? "-",

            docente: obtenerDocenteTitular(comision),

            tema: clase.tema,

            fecha: clase.fecha,

            hora_inicio: clase.hora_inicio,

            hora_fin: clase.hora_fin,

            horario: `${clase.hora_inicio} - ${clase.hora_fin}`,

            estado: clase.estado,

        };

    });

    return resultado;

}

export async function getClase(id) {

    const response = await getClasePorId(id);

    const comisiones = (await getComisiones()).data;

    const comision = comisiones.find(
        c => c.id_comision_asignatura === response.data.id_comision_asignatura
    );

    return {

        id: response.data.id_clase,

        id_comision_asignatura: response.data.id_comision_asignatura,

        numero_clase: response.data.numero_clase,

        codigo: comision?.comision.descripcion ?? "-",

        materia: comision?.nombre ?? "-",

        docente: obtenerDocenteTitular(comision),

        tema: response.data.tema,

        fecha: response.data.fecha,

        hora_inicio: response.data.hora_inicio,

        hora_fin: response.data.hora_fin,

        horario: `${response.data.hora_inicio} - ${response.data.hora_fin}`,

        estado: response.data.estado,

    };

}


export async function registrarClase(datos) {

    return await crearClase(datos);

}

export async function modificarClase(id, datos) {

    return await editarClase(id, datos);

}

export async function borrarClase(id) {

    return await eliminarClase(id);

}