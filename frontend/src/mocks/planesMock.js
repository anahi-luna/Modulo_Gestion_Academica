// Mock de "Resultado del plan" (avance del alumno respecto de su plan
// de estudios). Mismo patrón que el resto de los mocks: simula el
// delay de red y devuelve { status, data, message }.
// id_legajo hace referencia a los mismos ids que usa legajosMock.

const delay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

let PLANES = [
  {
    id_plan: 1,
    id_legajo: 1, // Juan Pérez (mismo legajo que usa el usuario "alumno" de prueba)
    codigo_plan: "PLAN-2026-A",
    materias_totales: 12,
    materias_aprobadas: 12,
    materias_finalizadas: 12,
    estado: "Aprobado",
  },
  {
    id_plan: 2,
    id_legajo: 2, // Ana Gómez
    codigo_plan: "PLAN-2026-A",
    materias_totales: 12,
    materias_aprobadas: 6,
    materias_finalizadas: 8,
    estado: "En curso",
  },
  {
    id_plan: 3,
    id_legajo: 4, // María Suárez
    codigo_plan: "PLAN-2026-A",
    materias_totales: 12,
    materias_aprobadas: 4,
    materias_finalizadas: 9,
    estado: "Incompleto",
  },
  {
    id_plan: 4,
    id_legajo: 5, // Pedro Fernández
    codigo_plan: "PLAN-2026-A",
    materias_totales: 12,
    materias_aprobadas: 2,
    materias_finalizadas: 3,
    estado: "Abandono",
  },
];

// Plan de UN alumno (vista "Mi plan")
export async function getPlanPorLegajo(idLegajo) {
  await delay();
  const plan = PLANES.find((p) => p.id_legajo === idLegajo);
  return {
    status: "success",
    data: plan ?? null,
    message: plan ? "Plan obtenido correctamente" : "El legajo no tiene un plan asignado",
  };
}

// Todos los planes (vista "Resultado del plan", admin/director o quien gestione esto)
export async function getPlanes() {
  await delay();
  return {
    status: "success",
    data: PLANES,
    message: "Planes obtenidos correctamente",
  };
}

// Cambia el estado de un plan (lo usamos para "Marcar abandono")
export async function actualizarEstadoPlan(idPlan, estado) {
  await delay(200);
  const plan = PLANES.find((p) => p.id_plan === idPlan);
  if (!plan) throw new Error("Plan no encontrado");
  plan.estado = estado;
  return {
    status: "success",
    data: plan,
    message: "Estado del plan actualizado",
  };
}