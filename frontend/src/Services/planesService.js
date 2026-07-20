// Servicio de Planes. Las páginas (MiPlan.jsx y ResultadoPlan.jsx) solo
// consumen estas funciones, nunca importan el mock directamente. Mismo
// criterio que certificadosService.js: cuando exista el microservicio
// real, se reescribe este archivo para hacer fetch a `${API_URL}/planes...`
// sin tocar ni una línea de las páginas.

import { getPlanPorLegajo, getPlanes, actualizarEstadoPlan } from "../mocks/planesMock";
import { getLegajoPorId } from "../mocks/legajosMock";
import { emitir } from "./certificadosService";
import { obtenerMisCalificaciones } from "./calificacionesAlumnoService";
import { obtenerResultadosAcademicos, nombreEstadoAcademico } from "./resultadoAcademicoService";

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

// Arma, materia por materia, el detalle que se ve en "Mi plan":
// reutilizo obtenerMisCalificaciones (que ya trae, por cada comisión
// en la que el alumno está inscripto, sus evaluaciones y notas) y le
// cruzo el ResultadoAcademico si ya se generó. Si existe resultado
// académico para esa (legajo, comisión), la materia está FINALIZADA y
// muestro ese cierre; si no existe todavía, está PENDIENTE (cursando)
// y muestro las evaluaciones cargadas hasta ahora, igual que en Mis
// Calificaciones.
export async function obtenerMisMateriasDePlan(idLegajo) {
  const [materias, resultados] = await Promise.all([
    obtenerMisCalificaciones(idLegajo),
    obtenerResultadosAcademicos(idLegajo),
  ]);

  return materias.map((materia) => {
    const resultado = resultados.find((r) => r.id_comision === materia.id_comision);

    if (!resultado) {
      // Todavía no se generó el resultado académico: pendiente/cursando.
      return { ...materia, finalizada: false };
    }

    return {
      ...materia,
      finalizada: true,
      resultado: {
        ...resultado,
        estado_academico: nombreEstadoAcademico(resultado.id_estado_academico),
      },
    };
  });
}