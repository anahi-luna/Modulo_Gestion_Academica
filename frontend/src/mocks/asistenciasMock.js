const ASISTENCIAS = [
  {
    id_asistencia: 1,
    id_legajo: 124,
    id_comision: 1,
    estado: "PRESENTE",
  },
  {
    id_asistencia: 2,
    id_legajo: 125,
    id_comision: 1,
    estado: "TARDE",
  },
  {
    id_asistencia: 3,
    id_legajo: 126,
    id_comision: 1,
    estado: "AUSENTE",
  },
];

export async function getAsistenciasPorComision(idComision) {

  return {
    status: "success",
    data: ASISTENCIAS.filter(
      (a) => a.id_comision === idComision
    ),
    total: ASISTENCIAS.filter(
      (a) => a.id_comision === idComision
    ).length,
  };
}

export async function getAsistencia(id) {

  return {
    status: "success",
    data: ASISTENCIAS.find(
      (a) => a.id_asistencia === id
    ),
  };
}

export async function actualizarAsistencia(id, idEstado) {

  const asistencia = ASISTENCIAS.find(
    (a) => a.id_asistencia === id
  );

  if (!asistencia) {
    throw new Error("Asistencia no encontrada");
  }

  asistencia.id_estado = idEstado;

  return {
    status: "success",
    data: asistencia,
    message: "Asistencia actualizada correctamente",
  };
}