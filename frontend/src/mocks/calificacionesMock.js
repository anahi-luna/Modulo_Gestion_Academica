// Mock de Calificaciones y Evaluaciones.
// Mismo patrón que comisionesMock/legajosMock: simula delay de red
// y devuelve { status, data, message } como lo haría el backend real.
// Cuando exista el microservicio de Calificaciones, este es el único
// archivo que hay que reemplazar por llamadas fetch reales.

const delay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let EVALUACIONES = [
  { idEvaluacion: 1, id_comision: 1, titulo: "Parcial 1",                 tipo: "Parcial", puntaje_maximo: 10, fecha: "2026-04-10" },
  { idEvaluacion: 2, id_comision: 1, titulo: "TP Extinción de Incendios", tipo: "TP",       puntaje_maximo: 10, fecha: "2026-05-05" },
  { idEvaluacion: 3, id_comision: 1, titulo: "Final",                    tipo: "Final",    puntaje_maximo: 10, fecha: "2026-06-15" },
  { idEvaluacion: 4, id_comision: 4, titulo: "Parcial 1",                tipo: "Parcial",  puntaje_maximo: 10, fecha: "2026-04-20" },
  { idEvaluacion: 5, id_comision: 4, titulo: "Final",                    tipo: "Final",    puntaje_maximo: 10, fecha: "2026-06-20" },
  { idEvaluacion: 6, id_comision: 6, titulo: "Parcial Único",            tipo: "Parcial",  puntaje_maximo: 10, fecha: "2026-05-30" },
];

let CALIFICACIONES = [
  { idCalificacion: 1, id_legajo: 1, id_comision: 1, id_evaluacion: 1, nota: 7,    observacion: "" },
  { idCalificacion: 2, id_legajo: 1, id_comision: 1, id_evaluacion: 2, nota: 8,    observacion: "Buen desempeño práctico" },
  { idCalificacion: 3, id_legajo: 1, id_comision: 1, id_evaluacion: 3, nota: null, observacion: "" },
  { idCalificacion: 4, id_legajo: 1, id_comision: 4, id_evaluacion: 4, nota: 6,    observacion: "" },
  { idCalificacion: 5, id_legajo: 1, id_comision: 4, id_evaluacion: 5, nota: null, observacion: "" },
  { idCalificacion: 6, id_legajo: 2, id_comision: 1, id_evaluacion: 1, nota: 9, observacion: "" },
  { idCalificacion: 7, id_legajo: 2, id_comision: 1, id_evaluacion: 2, nota: 9, observacion: "" },
  { idCalificacion: 8, id_legajo: 2, id_comision: 1, id_evaluacion: 3, nota: 8, observacion: "" },
  { idCalificacion: 9, id_legajo: 4, id_comision: 6, id_evaluacion: 6, nota: 5, observacion: "Debe reforzar teoría" },
  { idCalificacion: 10, id_legajo: 5, id_comision: 1, id_evaluacion: 1, nota: 4,    observacion: "No alcanzó el mínimo" },
  { idCalificacion: 11, id_legajo: 5, id_comision: 1, id_evaluacion: 2, nota: 6,    observacion: "" },
  { idCalificacion: 12, id_legajo: 5, id_comision: 1, id_evaluacion: 3, nota: null, observacion: "" },
];

let nextEvaluacionId = 7;
let nextCalificacionId = 13;

export async function getEvaluacionesPorComision(idComision) {
  await delay();
  return {
    status: "success",
    data: EVALUACIONES.filter((e) => e.id_comision === idComision),
    message: "Evaluaciones obtenidas correctamente",
  };
}

export async function crearEvaluacion({ id_comision, titulo, tipo, puntaje_maximo, fecha }) {
  await delay();
  const nueva = {
    idEvaluacion: nextEvaluacionId++,
    id_comision,
    titulo,
    tipo,
    puntaje_maximo: puntaje_maximo ?? 10,
    fecha,
  };
  EVALUACIONES.push(nueva);
  return { status: "success", data: nueva, message: "Evaluación creada correctamente" };
}

export async function getCalificacionesPorLegajo(idLegajo) {
  await delay();
  return {
    status: "success",
    data: CALIFICACIONES.filter((c) => c.id_legajo === idLegajo),
    message: "Calificaciones obtenidas correctamente",
  };
}

export async function getCalificacionesPorComision(idComision) {
  await delay();
  return {
    status: "success",
    data: CALIFICACIONES.filter((c) => c.id_comision === idComision),
    message: "Calificaciones obtenidas correctamente",
  };
}

export async function guardarCalificacion({ id_legajo, id_comision, id_evaluacion, nota, observacion }) {
  await delay(200);

  if (nota !== null && (nota < 0 || nota > 10)) {
    throw new Error("La nota debe estar entre 0 y 10");
  }

  const existente = CALIFICACIONES.find(
    (c) => c.id_legajo === id_legajo && c.id_evaluacion === id_evaluacion
  );

  if (existente) {
    existente.nota = nota;
    existente.observacion = observacion ?? existente.observacion;
    return { status: "success", data: existente, message: "Calificación actualizada correctamente" };
  }

  const nueva = {
    idCalificacion: nextCalificacionId++,
    id_legajo,
    id_comision,
    id_evaluacion,
    nota,
    observacion: observacion ?? "",
  };
  CALIFICACIONES.push(nueva);
  return { status: "success", data: nueva, message: "Calificación registrada correctamente" };
}