// Mock de asistencia del Alumno, asociada a Clases (día puntual).
// Nota: el mock de asistencia del panel admin (asistenciasMock.js) guarda
// la asistencia directamente por comisión (sin fecha) y usa ids de legajo
// que no coinciden con legajosMock. Para "asistencia por día" del alumno
// se necesita el id_clase (que sí tiene fecha), así que se arma este mock
// nuevo y consistente, sin tocar el que ya usa el panel de administración.

const delay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const ASISTENCIAS = [
  { idAsistencia: 1, id_legajo: 1, id_clase: 1, id_comision: 1, estado: "Presente", observacion: "" },
  { idAsistencia: 2, id_legajo: 1, id_clase: 2, id_comision: 1, estado: "Ausente",  observacion: "Aviso médico" },
  { idAsistencia: 3, id_legajo: 1, id_clase: 4, id_comision: 1, estado: "Tarde",    observacion: "Llegó 15 min tarde" },
  { idAsistencia: 4, id_legajo: 2, id_clase: 1, id_comision: 1, estado: "Presente", observacion: "" },
  { idAsistencia: 5, id_legajo: 2, id_clase: 2, id_comision: 1, estado: "Presente", observacion: "" },
  { idAsistencia: 6, id_legajo: 2, id_clase: 4, id_comision: 1, estado: "Presente", observacion: "" },
  { idAsistencia: 7, id_legajo: 5, id_clase: 1, id_comision: 1, estado: "Ausente", observacion: "" },
  { idAsistencia: 8, id_legajo: 5, id_clase: 2, id_comision: 1, estado: "Presente", observacion: "" },
];

export async function getAsistenciasPorLegajo(idLegajo) {
  await delay();
  return {
    status: "success",
    data: ASISTENCIAS.filter((a) => a.id_legajo === idLegajo),
    message: "Asistencias obtenidas correctamente",
  };
}