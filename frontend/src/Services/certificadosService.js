// Ya está conectado a la API real del back. El certificado es por
// RESULTADO DE PLAN completo, no por materia. El back decide el tipo
// (Aprobación o Participación) según el estado del plan.

import {
    getListaCertificados,
    getMisCertificados,
    crearCertificado,
    editarCertificado,
} from "../api/certificadosApi";
import { obtenerTodosLosPlanes } from "./planesService";

// coincide con seed/seed_estado_certificado.py del back
const ID_ESTADO_REVOCADO = 2;

function mapearCertificado(c) {
    return {
        id:                  c.id_certificado,
        id_resultado_plan:   c.id_resultado_plan,
        tipo:                c.tipo?.nombre    ?? "-",
        estado:              c.estado?.nombre  ?? "-",
        codigo_verificacion: c.codigo_verificacion,
        fecha_emision:       c.fecha_emision,
        fecha_vencimiento:   c.fecha_vencimiento,
    };
}

// una fila por alumno (por su resultado de plan), cruzando si ya tiene
// o no un certificado emitido. Esta es la lista que consume la vista de gestión.
export async function obtenerFilasCertificados() {
    const [planes, certificadosRes] = await Promise.all([
        obtenerTodosLosPlanes(),
        getListaCertificados(),
    ]);

    const certificados = certificadosRes.data.map(mapearCertificado);

    return planes.map((plan) => {
        const certificado = certificados.find(
            (c) => c.id_resultado_plan === plan.id
        ) ?? null;

        // solo se puede emitir si el plan ya cerró (Finalizado o Incompleto)
        const elegiblePararCertificado =
            (plan.estado === "Finalizado" || plan.estado === "Incompleto") && !certificado;

        return {
            id_resultado_plan: plan.id,
            id_legajo:         plan.id_legajo,
            alumno:            plan.alumno,
            numero_legajo:     plan.numero_legajo,
            estado_plan:       plan.estado,
            avance:            plan.avance,
            certificado,
            elegiblePararCertificado,
        };
    });
}

// certificados del alumno autenticado (para "Mis certificados"). El
// back ya filtra por el alumno logueado; acá solo cruzamos cada
// certificado con su resultado de plan para pegarle el id_plan.
// idLegajo ya no hace falta mandarlo, pero se mantiene el parámetro
// para no romper a quienes llaman a esta función.
// eslint-disable-next-line no-unused-vars
export async function obtenerMisCertificados(idLegajo) {
    const [planes, certificadosRes] = await Promise.all([
        obtenerTodosLosPlanes(),
        getMisCertificados(),
    ]);

    const certificados = certificadosRes.data.map(mapearCertificado);

    return certificados.map((certificado) => {
        const plan = planes.find((p) => p.id === certificado.id_resultado_plan);
        return { ...certificado, id_plan: plan?.id_plan };
    });
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

// cuando el back tenga url_documento real, esto se reemplaza por abrir esa URL
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
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${cert.codigo_verificacion || "certificado"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}