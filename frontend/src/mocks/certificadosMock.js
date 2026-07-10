// Mock de Certificados. Mismo patrón que el resto de los mocks:
// simula delay de red y devuelve { status, data, message }.
// Cuando exista el microservicio real, sólo hay que reescribir estas
// funciones para que hagan fetch a `${API_URL}/certificados...`.

// Mock de Certificados. Mismo patrón que el resto de los mocks:
// simula delay de red y devuelve { status, data, message }.

const delay = (ms = 300) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const TIPOS_CERTIFICADO = [
  "Aprobación de Materia",
  "Participación en Curso",
  "Finalización de Plan",
];

let CERTIFICADOS = [
  {
    idCertificado: 1,
    id_legajo: 1, // Juan Pérez
    id_comision: 1, // Matafuegos I
    tipo: "Participación en Curso",
    codigo_verificacion: "CERT-A1B2C3",
    fecha_emision: "2026-05-10",
    fecha_vencimiento: null,
    estado: "Emitido",
    firmado_por: "Director Académico",
  },
  {
    idCertificado: 2,
    id_legajo: 2, // Ana Gómez
    id_comision: 1,
    tipo: "Aprobación de Materia",
    codigo_verificacion: "CERT-D4E5F6",
    fecha_emision: "2026-06-20",
    fecha_vencimiento: "2029-06-20",
    estado: "Emitido",
    firmado_por: "Director Académico",
  },
  {
    idCertificado: 3,
    id_legajo: 4, // María Suárez
    id_comision: 6,
    tipo: "Participación en Curso",
    codigo_verificacion: null,
    fecha_emision: null,
    fecha_vencimiento: null,
    estado: "Pendiente",
    firmado_por: null,
  },
];

let nextId = 4;

function generarCodigo() {
  return "CERT-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export async function getCertificadosPorLegajo(idLegajo) {
  await delay();
  return {
    status: "success",
    data: CERTIFICADOS.filter((c) => c.id_legajo === idLegajo),
    message: "Certificados obtenidos correctamente",
  };
}

export async function getCertificados() {
  await delay();
  return {
    status: "success",
    data: CERTIFICADOS,
    message: "Certificados obtenidos correctamente",
  };
}

export async function emitirCertificado({ idCertificado, id_legajo, id_comision, tipo, firmado_por }) {
  await delay(300);

  if (idCertificado) {
    const existente = CERTIFICADOS.find((c) => c.idCertificado === idCertificado);
    if (!existente) throw new Error("Certificado no encontrado");
    existente.estado = "Emitido";
    existente.codigo_verificacion = generarCodigo();
    existente.fecha_emision = new Date().toISOString().slice(0, 10);
    existente.firmado_por = firmado_por;
    return { status: "success", data: existente, message: "Certificado emitido correctamente" };
  }

  const nuevo = {
    idCertificado: nextId++,
    id_legajo,
    id_comision,
    tipo,
    codigo_verificacion: generarCodigo(),
    fecha_emision: new Date().toISOString().slice(0, 10),
    fecha_vencimiento: null,
    estado: "Emitido",
    firmado_por,
  };
  CERTIFICADOS.push(nuevo);
  return { status: "success", data: nuevo, message: "Certificado emitido correctamente" };
}

export async function revocarCertificado(idCertificado) {
  await delay(200);
  const existente = CERTIFICADOS.find((c) => c.idCertificado === idCertificado);
  if (!existente) throw new Error("Certificado no encontrado");
  existente.estado = "Revocado";
  return { status: "success", data: existente, message: "Certificado revocado" };
}