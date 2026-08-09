// Servicios relacionados con las evaluaciones de los alumnos, para el personal de gestión.
// Muestra las evaluaciones de cada comisión y permite crear / editar / eliminar evaluaciones.
// Los tipos de evaluación se obtienen desde el catálogo del backend. No se hardcodean IDs ni nombres.

import {
    getListaEvaluaciones,
    getEvaluacionPorId,
    crearEvaluacion,
    editarEvaluacion,
    eliminarEvaluacion
} from "../api/evaluacionesApi";
import { getComisiones, obtenerDocenteTitular } from "../api/comisiones";
import { getTiposEvaluacion } from "../api/catalogosApi";

// ============================================================
// OBTENER EVALUACIONES
// ============================================================

export async function getEvaluaciones(idComision) {
    const response = await getListaEvaluaciones(idComision);
    const comisiones = (await getComisiones()).data;
    const tiposEvaluacion = await getTiposEvaluacion();

    return response.data.map((evaluacion) => {
        const comision = comisiones.find((c) => c.id_comision_asignatura === evaluacion.id_comision_asignatura);
        const tipoEvaluacion = tiposEvaluacion.find((tipo) => tipo.id_tipo_evaluacion === evaluacion.id_tipo_evaluacion);

        return {
            id: evaluacion.id_evaluacion,
            id_comision: evaluacion.id_comision_asignatura,
            id_comision_asignatura: evaluacion.id_comision_asignatura,
            id_tipo_evaluacion: evaluacion.id_tipo_evaluacion,
            codigo: comision?.comision?.descripcion ?? "-",
            materia: comision?.nombre ?? "-",
            docente: obtenerDocenteTitular(comision),
            titulo: evaluacion.titulo,
            tipo: tipoEvaluacion?.nombre ?? evaluacion.tipo_evaluacion?.nombre ?? "-",
            fecha: evaluacion.fecha_evaluacion,
            puntaje_maximo: evaluacion.puntaje_maximo
        };
    });
}

// ============================================================
// OBTENER UNA EVALUACIÓN
// ============================================================

export async function getEvaluacion(id) {
    const response = await getEvaluacionPorId(id);
    const comisiones = (await getComisiones()).data;
    const tiposEvaluacion = await getTiposEvaluacion();

    const evaluacion = response.data;
    const comision = comisiones.find((c) => c.id_comision_asignatura === evaluacion.id_comision_asignatura);
    const tipoEvaluacion = tiposEvaluacion.find((tipo) => tipo.id_tipo_evaluacion === evaluacion.id_tipo_evaluacion);

    return {
        id: evaluacion.id_evaluacion,
        id_comision: evaluacion.id_comision_asignatura,
        id_comision_asignatura: evaluacion.id_comision_asignatura,
        id_tipo_evaluacion: evaluacion.id_tipo_evaluacion,
        codigo: comision?.comision?.descripcion ?? "-",
        materia: comision?.nombre ?? "-",
        docente: obtenerDocenteTitular(comision),
        titulo: evaluacion.titulo,
        tipo: tipoEvaluacion?.nombre ?? evaluacion.tipo_evaluacion?.nombre ?? "-",
        fecha: evaluacion.fecha_evaluacion,
        puntaje_maximo: evaluacion.puntaje_maximo
    };
}

// ============================================================
// CONVERTIR DATOS DEL FORMULARIO AL BACKEND
// ============================================================

function aPayloadBack(datos) {
    return {
        id_comision_asignatura: Number(datos.id_comision_asignatura ?? datos.id_comision),
        id_tipo_evaluacion: Number(datos.id_tipo_evaluacion),
        titulo: datos.titulo,
        fecha_evaluacion: datos.fecha,
        puntaje_maximo: Number(datos.puntaje_maximo)
    };
}

// ============================================================
// ACCIONES DE CREAR, MODIFICAR Y ELIMINAR
// ============================================================

export async function registrarEvaluacion(datos) { return await crearEvaluacion(aPayloadBack(datos)); }

export async function modificarEvaluacion(id, datos) { return await editarEvaluacion(id, aPayloadBack(datos)); }

export async function borrarEvaluacion(id) { return await eliminarEvaluacion(id); }