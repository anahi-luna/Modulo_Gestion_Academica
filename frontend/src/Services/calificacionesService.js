// Servicio de Calificaciones
// Igual que inscripcionesService.js: la vista solo consume estas funciones,
// nunca importa los mocks directamente.

import { getLegajoPorId } from "../mocks/legajosMock";
import { getComisiones } from "../mocks/comisionesMock";
import {
  getEvaluacionesPorComision,
  getCalificacionesPorLegajo,
  getCalificacionesPorComision,
  guardarCalificacion,
  crearEvaluacion,
} from "../mocks/calificacionesMock";

const NOTA_APROBACION = 6;

export async function obtenerMisCalificaciones(idLegajo) {
  const [califsRes, comisionesRes] = await Promise.all([
    getCalificacionesPorLegajo(idLegajo),
    getComisiones(),
  ]);

  const calificaciones = califsRes.data;
  const comisiones = comisionesRes.data;
  const idsComisiones = [...new Set(calificaciones.map((c) => c.id_comision))];

  const resultado = await Promise.all(
    idsComisiones.map(async (idComision) => {
      const comision = comisiones.find((c) => c.id === idComision);
      const evaluacionesRes = await getEvaluacionesPorComision(idComision);
      const evaluaciones = evaluacionesRes.data;

      const detalle = evaluaciones.map((ev) => {
        const calif = calificaciones.find((c) => c.id_evaluacion === ev.idEvaluacion);
        return {
          idEvaluacion: ev.idEvaluacion,
          titulo: ev.titulo,
          tipo: ev.tipo,
          fecha: ev.fecha,
          puntaje_maximo: ev.puntaje_maximo,
          nota: calif?.nota ?? null,
          observacion: calif?.observacion ?? "",
        };
      });

      const cargadas = detalle.filter((d) => d.nota !== null);
      const promedio =
        cargadas.length > 0
          ? cargadas.reduce((acc, d) => acc + d.nota, 0) / cargadas.length
          : null;

      const todasCargadas = detalle.every((d) => d.nota !== null);
      let estado = "Regular";
      if (todasCargadas) {
        estado = promedio >= NOTA_APROBACION ? "Aprobado" : "Desaprobado";
      }

      return {
        id_comision: idComision,
        comision: comision?.codigo ?? "-",
        materia: comision?.materia ?? "-",
        docente: comision?.docente ?? "-",
        evaluaciones: detalle,
        promedio,
        estado,
      };
    })
  );

  return resultado;
}

export async function obtenerComisionesParaGestion(idComisionDocente = null) {
  const response = await getComisiones();
  if (idComisionDocente) {
    return response.data.filter((c) => c.id === idComisionDocente);
  }
  return response.data;
}

export async function obtenerPlanillaDeComision(idComision) {
  const [evaluacionesRes, calificacionesRes] = await Promise.all([
    getEvaluacionesPorComision(idComision),
    getCalificacionesPorComision(idComision),
  ]);

  const evaluaciones = evaluacionesRes.data;
  const calificaciones = calificacionesRes.data;
  const idsLegajos = [...new Set(calificaciones.map((c) => c.id_legajo))];

  const filas = await Promise.all(
    idsLegajos.map(async (idLegajo) => {
      const legajoRes = await getLegajoPorId(idLegajo);
      const legajo = legajoRes.data;

      const notas = evaluaciones.reduce((acc, ev) => {
        const calif = calificaciones.find(
          (c) => c.id_legajo === idLegajo && c.id_evaluacion === ev.idEvaluacion
        );
        acc[ev.idEvaluacion] = calif?.nota ?? null;
        return acc;
      }, {});

      return {
        id_legajo: idLegajo,
        numero_legajo: legajo.numero_legajo,
        alumno: `${legajo.nombre} ${legajo.apellido}`,
        notas,
      };
    })
  );

  return { evaluaciones, filas };
}

export async function cargarNota({ id_legajo, id_comision, id_evaluacion, nota, observacion }) {
  const notaNumerica = nota === "" || nota === null ? null : Number(nota);
  const response = await guardarCalificacion({
    id_legajo,
    id_comision,
    id_evaluacion,
    nota: notaNumerica,
    observacion,
  });
  return response.data;
}

export async function nuevaEvaluacion(datos) {
  const response = await crearEvaluacion(datos);
  return response.data;
}