// servicios relacionados con las evaluaciones de los alumnos, para el personal de gestión 
//  muestra las evaluaciones de cada comisión y permite crear/editar/borrar evaluaciones.
import {
    getListaEvaluaciones,
    getEvaluacionPorId,
    crearEvaluacion,
    editarEvaluacion,
    eliminarEvaluacion,
} from "../api/evaluacionesApi";

import { getComisiones } from "../mocks/comisionesMock";

// Coincide con seed/seed_tipo_evaluacion.py del back.
const TIPOS_EVALUACION = {
    1: "Parcial",
    2: "Recuperatorio",
    3: "Final",
    4: "TP", // "Trabajo Práctico" en el back, lo dejo corto para la UI
};

// El formulario solo ofrece Parcial/TP/Final (ver EvaluacionModal.jsx),
// así que el mapeo inverso cubre esos 3 + Recuperatorio por si se
// necesita más adelante.
const ID_POR_TIPO = {
    Parcial: 1,
    Recuperatorio: 2,
    Final: 3,
    TP: 4,
    "Trabajo Práctico": 4,
};

function idATipo(idTipoEvaluacion, tipoEvaluacionNombre) {
    if (tipoEvaluacionNombre === "Trabajo Práctico") return "TP";
    return tipoEvaluacionNombre ?? TIPOS_EVALUACION[idTipoEvaluacion] ?? "-";
}

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

            tipo: idATipo(evaluacion.id_tipo_evaluacion, evaluacion.tipo_evaluacion?.nombre),

            fecha: evaluacion.fecha_evaluacion,

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

        tipo: idATipo(response.data.id_tipo_evaluacion, response.data.tipo_evaluacion?.nombre),

        fecha: response.data.fecha_evaluacion,

        puntaje_maximo: response.data.puntaje_maximo,

    };

}

// datos viene del formulario con { id_comision, titulo, tipo, fecha,
// puntaje_maximo }. Acá lo traduzco a lo que pide el back:
// { id_comision, id_tipo_evaluacion, titulo, fecha_evaluacion, puntaje_maximo }.
function aPayloadBack(datos) {
    return {
        id_comision: datos.id_comision,
        id_tipo_evaluacion: ID_POR_TIPO[datos.tipo] ?? 1,
        titulo: datos.titulo,
        fecha_evaluacion: datos.fecha,
        puntaje_maximo: datos.puntaje_maximo,
    };
}

export async function registrarEvaluacion(datos) {

    return await crearEvaluacion(aPayloadBack(datos));

}

export async function modificarEvaluacion(id, datos) {

    return await editarEvaluacion(id, aPayloadBack(datos));

}

export async function borrarEvaluacion(id) {

    return await eliminarEvaluacion(id);

}
