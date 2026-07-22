// Ya está conectado a la API real del back. Ojo con algo importante
// que cambió: el Certificado real NO es por materia/comisión (como
// habíamos armado al principio con el mock), sino por RESULTADO DE
// PLAN completo: certifica que un alumno terminó (o abandonó a medio
// camino) su plan de estudios entero, no una materia puntual. El back
// además decide solo qué tipo de certificado corresponde:
// "Aprobación" si el plan quedó Finalizado, "Participación" si quedó
// Incompleto. Nosotros solo mandamos el id_resultado_plan.
import { getLegajoPorId } from "../mocks/legajosMock";
import {
  getListaCertificados,
  crearCertificado,
  editarCertificado,
} from "../api/certificadosApi";
import { obtenerTodosLosPlanes } from "./planesService";

// Coincide con seed/seed_estado_certificado.py y seed_tipo_certificado.py del back.
const ID_ESTADO_REVOCADO = 2;

function mapearCertificado(c) {
  return {
    id: c.id_certificado,
    id_resultado_plan: c.id_resultado_plan,
    tipo: c.tipo?.nombre ?? "-",
    estado: c.estado?.nombre ?? "-",
    codigo_verificacion: c.codigo_verificacion,
    fecha_emision: c.fecha_emision,
    fecha_vencimiento: c.fecha_vencimiento,
  };
}

// Arma una fila por cada resultado de plan (uno por alumno), cruzando
// si ya tiene o no un certificado emitido. Esta es la lista que
// consume la vista de gestión: a diferencia de antes, no hay una fila
// por materia, hay una fila por ALUMNO (por su plan completo).
export async function obtenerFilasCertificados() {
  const [planes, certificadosRes] = await Promise.all([
    obtenerTodosLosPlanes(),
    getListaCertificados(),
  ]);

  const certificados = certificadosRes.data.map(mapearCertificado);

  return planes.map((plan) => {
    const certificado = certificados.find((c) => c.id_resultado_plan === plan.id) ?? null;

    // Solo puede emitirse certificado si el plan ya cerró (Finalizado
    // o Incompleto): mientras esté "En curso" o "Abandonado" no
    // corresponde, así lo valida también el back.
    const elegiblePararCertificado =
      (plan.estado === "Finalizado" || plan.estado === "Incompleto") && !certificado;

    return {
      id_resultado_plan: plan.id,
      id_legajo: plan.id_legajo,
      alumno: plan.alumno,
      numero_legajo: plan.numero_legajo,
      estado_plan: plan.estado,
      avance: plan.avance,
      certificado,
      elegiblePararCertificado,
    };
  });
}

// Certificados de UN alumno (para "Mis certificados"). Como un alumno
// puede tener varios resultados de plan a lo largo del tiempo (poco
// común, pero posible), reviso todos los suyos.
export async function obtenerMisCertificados(idLegajo) {
  const [planes, certificadosRes] = await Promise.all([
    obtenerTodosLosPlanes(),
    getListaCertificados(),
  ]);

  const certificados = certificadosRes.data.map(mapearCertificado);
  const planesDelAlumno = planes.filter((p) => p.id_legajo === idLegajo);

  return planesDelAlumno
    .map((plan) => {
      const certificado = certificados.find((c) => c.id_resultado_plan === plan.id);
      if (!certificado) return null;
      return { ...certificado, id_plan: plan.id_plan };
    })
    .filter(Boolean);
}

export async function emitir(idResultadoPlan) {
  const response = await crearCertificado(idResultadoPlan);
  return mapearCertificado(response.data);
}

export async function revocar(idCertificado) {
  const response = await editarCertificado(idCertificado, {
    id_estado_certificado: ID_ESTADO_REVOCADO,
  });
  return mapearCertificado(response.data);
}

// Genera un archivo simulando la descarga del PDF del certificado.
// Cuando el back tenga la generación real de PDF (url_documento), esto
// se reemplaza por abrir esa URL directamente.
export function descargarCertificado(cert, alumnoNombre) {
  const contenido =
`INSTITUTO DE BOMBEROS - CERTIFICADO
=====================================
Tipo: ${cert.tipo}
Alumno: ${alumnoNombre}
Plan Nº: ${cert.id_plan ?? "-"}
Código de verificación: ${cert.codigo_verificacion}
Fecha de emisión: ${cert.fecha_emision}
=====================================
Documento simulado generado por el frontend.
Cuando el back genere el PDF real (campo url_documento),
este botón va a descargar ese archivo en vez de este texto.`;

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
