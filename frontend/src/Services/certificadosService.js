// Servicio de Certificados. Las vistas (pages) SOLO consumen estas funciones,
// nunca importan el mock directamente. Cuando exista el microservicio real,
// se reescribe este archivo para hacer fetch a `${API_URL}/certificados...`
// sin tener que tocar ni una línea de las pages ni de los componentes.

import { getLegajoPorId } from "../mocks/legajosMock";
import { getComisiones } from "../mocks/comisionesMock";
import {
  getCertificadosPorLegajo,
  getCertificados,
  emitirCertificado,
  revocarCertificado,
} from "../mocks/certificadosMock";

// Certificados de un alumno, con el nombre de la materia/comisión ya resuelto
// (para no tener que hacer el cruce de datos en la vista)
export async function obtenerMisCertificados(idLegajo) {
  const [certRes, comisionesRes] = await Promise.all([
    getCertificadosPorLegajo(idLegajo),
    getComisiones(),
  ]);
  const comisiones = comisionesRes.data;

  return certRes.data.map((cert) => {
    const comision = comisiones.find((c) => c.id === cert.id_comision);
    return {
      ...cert,
      comision: comision?.codigo ?? "-",
      materia: comision?.materia ?? "-",
    };
  });
}

// Todos los certificados, con nombre de alumno y materia resueltos (vista Admin)
export async function obtenerTodosLosCertificados() {
  const [certRes, comisionesRes] = await Promise.all([
    getCertificados(),
    getComisiones(),
  ]);
  const comisiones = comisionesRes.data;

  return Promise.all(
    certRes.data.map(async (cert) => {
      const legajoRes = await getLegajoPorId(cert.id_legajo);
      const legajo = legajoRes.data;
      const comision = comisiones.find((c) => c.id === cert.id_comision);
      return {
        ...cert,
        alumno: `${legajo.nombre} ${legajo.apellido}`,
        numero_legajo: legajo.numero_legajo,
        comision: comision?.codigo ?? "-",
        materia: comision?.materia ?? "-",
      };
    })
  );
}

export async function emitir(datos) {
  const response = await emitirCertificado(datos);
  return response.data;
}

export async function revocar(idCertificado) {
  const response = await revocarCertificado(idCertificado);
  return response.data;
}

// Genera un archivo simulando la descarga del PDF del certificado.
// Cuando el backend esté listo, esto se reemplaza por la URL real del PDF.
export function descargarCertificado(cert, alumnoNombre) {
  const contenido =
`INSTITUTO DE BOMBEROS - CERTIFICADO
=====================================
Tipo: ${cert.tipo}
Alumno: ${alumnoNombre}
Materia/Curso: ${cert.materia}
Comisión: ${cert.comision}
Código de verificación: ${cert.codigo_verificacion}
Fecha de emisión: ${cert.fecha_emision}
Firmado por: ${cert.firmado_por ?? "-"}
=====================================
Documento simulado generado por el frontend (mock).
Cuando el módulo de Certificados esté conectado al backend,
este botón va a descargar el PDF real emitido por el sistema.`;

  const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${cert.codigo_verificacion || "certificado"}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}