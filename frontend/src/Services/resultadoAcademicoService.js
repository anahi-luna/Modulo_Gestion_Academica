// Mismo patrón que certificadosService.js y planesService.js: las
// páginas y componentes SOLO importan de acá, nunca del mock
// directamente. Cuando el back tenga listo el endpoint real de
// ResultadoAcademico, este es el único archivo que hay que reescribir
// para pegarle a `${API_URL}/resultado-academico...`.

import {
  getResultadoPorLegajoYComision,
  getResultadosPorLegajo,
  guardarResultadoAcademico,
  ESTADOS_ACADEMICOS,
  nombreEstadoAcademico,
} from "../mocks/resultadoAcademicoMock";

export { ESTADOS_ACADEMICOS, nombreEstadoAcademico };

// El resultado de UNA materia puntual (null si todavía no se generó,
// es decir la cursada sigue en curso / pendiente de cierre)
export async function obtenerResultadoAcademico(idLegajo, idComision) {
  const respuesta = await getResultadoPorLegajoYComision(idLegajo, idComision);
  return respuesta.data;
}

// Todos los resultados académicos ya generados para un alumno (los
// uso en "Mi plan" para saber qué materias están finalizadas)
export async function obtenerResultadosAcademicos(idLegajo) {
  const respuesta = await getResultadosPorLegajo(idLegajo);
  return respuesta.data;
}

// Genera (o corrige) el resultado académico de una materia cursada.
// datos: { id_legajo, id_comision, id_estado_academico, promedio_final,
//          porcentaje_asistencia, fecha_cierre, observaciones }
export async function generarResultadoAcademico(datos) {
  const respuesta = await guardarResultadoAcademico(datos);
  return respuesta.data;
}
