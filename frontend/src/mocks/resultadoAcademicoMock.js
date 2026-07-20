// Mock de ResultadoAcademico, armado según el DER que me pasaste. Ahí
// el campo real es "id_estado_academico INT" (una FK a una tabla de
// estados), así que simulo esa tabla acá mismo con ESTADOS_ACADEMICOS
// en vez de guardar el estado como texto suelto.
//
// OJO - simplificación que hice a propósito: el DER liga el resultado
// a un "id_inscripcion", pero en este front todavía no tengo el
// id_inscripcion disponible en el lugar donde se genera el botón
// (la fila de Certificados solo trae id_legajo + id_comision). Así que
// por ahora indexo el resultado por la combinación (id_legajo,
// id_comision), que en este sistema identifica a la misma inscripción
// de forma única. El día que el back exponga id_inscripcion en esa
// fila, esto se cambia para usar ese id directo y quedar 100% fiel al DER.

const delay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const ESTADOS_ACADEMICOS = [
  { id: 1, nombre: "Aprobado" },
  { id: 2, nombre: "Desaprobado" },
  { id: 3, nombre: "Libre" },
];

export function nombreEstadoAcademico(idEstado) {
  return ESTADOS_ACADEMICOS.find((e) => e.id === idEstado)?.nombre ?? "-";
}

let RESULTADOS = [
  {
    idResultadoAcademico: 1,
    id_legajo: 1, // Juan Pérez
    id_comision: 1, // Matafuegos I
    id_estado_academico: 1, // Aprobado
    promedio_final: 8.5,
    porcentaje_asistencia: 92.5,
    fecha_cierre: "2026-06-15",
    observaciones: "Cursada regular, sin inconvenientes.",
    ts_creacion: "2026-06-15T10:00:00",
    ts_modificacion: null,
  },
];

let nextId = 2;

// Busca el resultado de UNA materia cursada por un alumno (para saber
// si ya está finalizada o todavía está pendiente/cursando)
export async function getResultadoPorLegajoYComision(idLegajo, idComision) {
  await delay();
  const resultado =
    RESULTADOS.find(
      (r) => r.id_legajo === idLegajo && r.id_comision === idComision
    ) ?? null;
  return {
    status: "success",
    data: resultado,
    message: resultado
      ? "Resultado académico encontrado"
      : "Todavía no se generó el resultado académico de esta materia",
  };
}

// Todos los resultados de UN alumno (para armar "Mi plan" completo)
export async function getResultadosPorLegajo(idLegajo) {
  await delay();
  return {
    status: "success",
    data: RESULTADOS.filter((r) => r.id_legajo === idLegajo),
  };
}

// Crea el resultado académico si no existía, o lo actualiza si ya
// existía uno para esa misma (legajo, comisión) — así el botón de
// "Generar resultado académico" sirve tanto para cerrar la cursada por
// primera vez como para corregir un dato cargado mal.
export async function guardarResultadoAcademico(datos) {
  await delay(300);
  const existente = RESULTADOS.find(
    (r) => r.id_legajo === datos.id_legajo && r.id_comision === datos.id_comision
  );

  if (existente) {
    Object.assign(existente, datos, {
      ts_modificacion: new Date().toISOString(),
    });
    return {
      status: "success",
      data: existente,
      message: "Resultado académico actualizado correctamente",
    };
  }

  const nuevo = {
    idResultadoAcademico: nextId++,
    ...datos,
    ts_creacion: new Date().toISOString(),
    ts_modificacion: null,
  };
  RESULTADOS.push(nuevo);
  return {
    status: "success",
    data: nuevo,
    message: "Resultado académico generado correctamente",
  };
}
