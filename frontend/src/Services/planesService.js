// Servicio de Planes. Las páginas (MiPlan.jsx y ResultadoPlan.jsx) solo
// consumen estas funciones, nunca importan el mock directamente. Mismo
// criterio que certificadosService.js: cuando exista el microservicio
// real, se reescribe este archivo para hacer fetch a `${API_URL}/planes...`
// sin tocar ni una línea de las páginas.

import { getPlanPorLegajo, getPlanes, actualizarEstadoPlan } from "../mocks/planesMock";
import { getLegajoPorId } from "../mocks/legajosMock";
import { emitir } from "./certificadosService";

// Le agrego el % de avance calculado (finalizadas / totales) para no
// tener que repetir esta cuenta en cada página que lo necesite.
function conAvance(plan) {
  if (!plan) return null;
  const avance =
    plan.materias_totales > 0
      ? Math.round((plan.materias_finalizadas / plan.materias_totales) * 100)
      : 0;
  return { ...plan, avance };
}

// El plan de UN alumno (para "Mi plan")
export async function obtenerMiPlan(idLegajo) {
  const respuesta = await getPlanPorLegajo(idLegajo);
  return conAvance(respuesta.data);
}

// Todos los planes, con nombre y número de legajo ya resueltos (para
// "Resultado del plan")
export async function obtenerTodosLosPlanes() {
  const respuesta = await getPlanes();

  return Promise.all(
    respuesta.data.map(async (plan) => {
      const legajoRes = await getLegajoPorId(plan.id_legajo);
      const legajo = legajoRes.data;
      return {
        ...conAvance(plan),
        numero_legajo: legajo.numero_legajo,
        alumno: `${legajo.nombre} ${legajo.apellido}`,
      };
    })
  );
}

// Marca un plan como abandonado
export async function marcarAbandono(idPlan) {
  const respuesta = await actualizarEstadoPlan(idPlan, "Abandono");
  return respuesta.data;
}

// Genera (emite) el certificado de "Finalización de Plan" para un
// alumno que ya completó el 100%. Reutiliza directamente el módulo de
// Certificados que ya existe, no duplico lógica de emisión.
export async function generarCertificadoDePlan(plan, firmadoPor) {
  return emitir({
    id_legajo: plan.id_legajo,
    id_comision: null, // la finalización de plan no es de UNA materia puntual
    tipo: "Finalización de Plan",
    firmado_por: firmadoPor,
  });
}