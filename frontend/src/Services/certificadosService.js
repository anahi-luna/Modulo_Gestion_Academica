// Ya está conectado a la API real del back. El certificado es por
// RESULTADO DE PLAN completo, no por materia. El back decide el tipo
// (Aprobación o Participación) según el estado del plan.

import {
    getListaCertificados,
    getMisCertificados,
    crearCertificado,
    editarCertificado,
    subirArchivoCertificado,
} from "../api/certificadosApi";
import { obtenerTodosLosPlanes } from "./planesService";
import API_URL from "../api/api";

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
        url_documento:       c.url_documento,
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

// Adjunta (o reemplaza) el PDF de un certificado ya emitido.
export async function subirArchivo(idCertificado, archivo) {
    const response = await subirArchivoCertificado(idCertificado, archivo);
    return mapearCertificado(response.data);
}

// Abre/descarga el PDF real subido para el certificado. Se pide con
// fetch (no con window.open) porque la ruta requiere el token de
// autenticación, que window.fetch ya agrega automáticamente para
// las llamadas a nuestra API (ver api/api.js); una navegación directa
// del navegador no lo incluiría. Si todavía no tiene archivo
// adjunto, avisa en vez de intentar abrir algo vacío.
export async function descargarCertificado(cert) {
    if (!cert.url_documento) {
        alert("Este certificado todavía no tiene un archivo adjunto.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}${cert.url_documento}`);

        if (!response.ok) {
            throw new Error("No se pudo descargar el archivo del certificado.");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${cert.codigo_verificacion || "certificado"}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error al descargar el certificado", error);
        alert(error.message);
    }
}