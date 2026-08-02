// servicios relacionados con la asistencia de los alumnos a las clases, para el personal de gestión
import * as legajosApi from "../api/legajosApi";
import { getComisiones, obtenerDocenteTitular } from "../api/comisiones";
import { getAsistenciaPorClase, actualizarAsistencia, registrarAsistencia, eliminarAsistencia } from "../api/asistenciasApi";
import { getInscripcionPorId } from "../api/inscripcionesApi";
import { modificarClase, getClases } from "./clasesAdminService";

// obtiene todas las asistencias de una clase con los datos del alumno resueltos
export async function obtenerAsistenciasPorClase(idClase) {
    const response   = await getAsistenciaPorClase(idClase);
    const comisiones = (await getComisiones()).data

    const resultado = await Promise.all(
        response.data.map(async (asistencia) => {
            const inscripcion = (await getInscripcionPorId(asistencia.id_inscripcion)).data;
            const legajo      = (await legajosApi.getLegajoPorId(inscripcion.id_legajo)).data;
            const comision    = comisiones.find(c => c.id_comision_asignatura === inscripcion.id_comision_asignatura);

            return {
                id:              asistencia.id_asistencia,
                id_legajo:       legajo.numero_legajo,
                alumno:          `${legajo.nombre} ${legajo.apellido}`,
               // rango:           legajo.rango,
                id_inscripcion:  inscripcion.id_inscripcion,
                id_comision_asignatura:     inscripcion.id_comision_asignatura,
                codigo_comision: comision?.comision.descripcion   ?? "-",
                materia:         comision?.nombre  ?? "-",

                docente:         obtenerDocenteTitular(comision),
                 horario:         comision?.modalidad  ?? "-",
                id_estado:       asistencia.id_estado,
                observacion:     asistencia.observacion,
            };
        })
    );

    return resultado;
}

export async function registrarAsistenciaService(datos) {
    const response = await registrarAsistencia(datos);
    return response.data;
}

export async function modificarAsistencia(idAsistencia, datos) {
    return await actualizarAsistencia(idAsistencia, datos);
}

// actualiza el estado de la clase automáticamente según si ya pasó la hora de inicio
export async function actualizarEstadoAutomaticamente(clase) {
    const ahora  = new Date();
    const inicio = new Date(`${clase.fecha}T${clase.hora_inicio}`);

    if (clase.estado === "PROGRAMADA" && inicio <= ahora) {
        await modificarClase(clase.id, {
            id_comision_asignatura: clase.id_comision_asignatura,
            estado: "DICTADA",
        });
        return { ...clase, estado: "DICTADA" };
    }

    return clase;
}

// devuelve las clases que ya tienen al menos una asistencia registrada
export async function obtenerHistorialPorComision(idComision) {
    const clases = await getClases(idComision);

    const resultados = await Promise.all(
        clases.map(async (clase) => {
            const asistencias = await obtenerAsistenciasPorClase(clase.id);

            if (asistencias.length === 0) return null;

            return {
                ...clase,
                cantidad_asistencias: asistencias.length,
            };
        })
    );

    return resultados.filter(Boolean);
}

export async function eliminarAsistenciaService(idAsistencia) {
    return await eliminarAsistencia(idAsistencia);
}

// elimina todas las asistencias de una clase yendo una por una
export async function eliminarAsistenciasPorClase(idClase) {
    const asistencias = await obtenerAsistenciasPorClase(idClase);

    if (asistencias.length === 0) return { cantidadEliminada: 0 };

    await Promise.all(
        asistencias.map((a) => eliminarAsistenciaService(a.id))
    );

    return { cantidadEliminada: asistencias.length };
}