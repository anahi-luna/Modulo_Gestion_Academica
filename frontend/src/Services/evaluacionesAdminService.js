// TODO: cuando el back tenga listo /api/evaluaciones, comento la línea
// de abajo y descomento la de la api real. Nada más de este archivo
// cambia porque el mock devuelve exactamente la misma forma de datos.
// import { getListaEvaluaciones, getEvaluacionPorId, crearEvaluacion, editarEvaluacion, eliminarEvaluacion } from "../api/evaluacionesApi";
import { getListaEvaluaciones, getEvaluacionPorId, crearEvaluacion, editarEvaluacion, eliminarEvaluacion } from "../mocks/evaluacionesMock";

import { getComisiones } from "../mocks/comisionesMock";


export async function getEvaluaciones(idComision) {

    const response = await getListaEvaluaciones(idComision);

    const comisiones = (await getComisiones()).data;

    const resultado = response.data.map((evaluacion) => {

        const comision = comisiones.find(
            c => c.id === evaluacion.id_comision
        );

        return {

            id: evaluacion.id_evaluacion,

            id_comision: evaluacion.id_comision,

            codigo: comision?.codigo ?? "-",

            materia: comision?.materia ?? "-",

            docente: comision?.docente ?? "-",

            titulo: evaluacion.titulo,

            tipo: evaluacion.tipo,

            fecha: evaluacion.fecha,

            puntaje_maximo: evaluacion.puntaje_maximo,

        };

    });

    return resultado;

}

export async function getEvaluacion(id) {

    const response = await getEvaluacionPorId(id);

    const comisiones = (await getComisiones()).data;

    const comision = comisiones.find(
        c => c.id === response.data.id_comision
    );

    return {

        id: response.data.id_evaluacion,

        id_comision: response.data.id_comision,

        codigo: comision?.codigo ?? "-",

        materia: comision?.materia ?? "-",

        docente: comision?.docente ?? "-",

        titulo: response.data.titulo,

        tipo: response.data.tipo,

        fecha: response.data.fecha,

        puntaje_maximo: response.data.puntaje_maximo,

    };

}

export async function registrarEvaluacion(datos) {

    return await crearEvaluacion(datos);

}

export async function modificarEvaluacion(id, datos) {

    return await editarEvaluacion(id, datos);

}

export async function borrarEvaluacion(id) {

    return await eliminarEvaluacion(id);

}
