import { getListaCertificados, getMisCertificados, crearCertificado, editarCertificado, subirArchivoCertificado } from "../api/certificadosApi";
import { obtenerTodosLosPlanes, obtenerMisPlanes } from "./planesService";
import { getEstadosCertificado, getEstadosResultadoPlan } from "../api/catalogosApi";
import API_URL from "../api/api";

// MAPEO DE CERTIFICADO
function mapearCertificado(c) {
    return {
        id: c.id_certificado,
        id_resultado_plan: c.id_resultado_plan,
        id_estado_certificado: c.estado?.id_estado_certificado,
        estado: c.estado?.nombre ?? "-",
        id_tipo_certificado: c.tipo?.id_tipo_certificado,
        tipo: c.tipo?.nombre ?? "-",
        codigo_verificacion: c.codigo_verificacion,
        fecha_emision: c.fecha_emision,
        fecha_vencimiento: c.fecha_vencimiento,
        url_documento: c.url_documento,
    };
}

// CERTIFICADOS PARA GESTIÓN
export async function obtenerFilasCertificados() {
    const [planes, certificadosRes, estadosResultadoPlan] = await Promise.all([
        obtenerTodosLosPlanes(),
        getListaCertificados(),
        getEstadosResultadoPlan(),
    ]);

    const certificados = (certificadosRes.data ?? []).map(mapearCertificado);
    const estadoFinalizado = estadosResultadoPlan.find((estado) => estado.nombre === "Finalizado");
    const estadoIncompleto = estadosResultadoPlan.find((estado) => estado.nombre === "Incompleto");
    const estadosElegibles = [estadoFinalizado?.nombre, estadoIncompleto?.nombre].filter(Boolean);

    return planes.map((plan) => {
        const certificado = certificados.find((c) => c.id_resultado_plan === plan.id) ?? null;
        const elegiblePararCertificado = estadosElegibles.includes(plan.estado) && !certificado;

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

// CERTIFICADOS DEL ALUMNO
export async function obtenerMisCertificados(idLegajo) {
    const [planes, certificadosRes] = await Promise.all([obtenerMisPlanes(), getMisCertificados()]);
    const certificados = (certificadosRes.data ?? []).map(mapearCertificado);

    return certificados.map((certificado) => {
        const plan = planes.find((p) => p.id === certificado.id_resultado_plan);
        return { ...certificado, id_plan: plan?.id_plan };
    });
}

// EMITIR CERTIFICADO
export async function emitir(idResultadoPlan) {
    const response = await crearCertificado(idResultadoPlan);
    return mapearCertificado(response.data);
}

// REVOCAR CERTIFICADO
export async function revocar(idCertificado) {
    const estados = await getEstadosCertificado();
    const estadoRevocado = estados.find((estado) => estado.nombre === "Revocado");

    if (!estadoRevocado) throw new Error("No se encontró el estado 'Revocado' en el catálogo de certificados.");

    const response = await editarCertificado(idCertificado, { id_estado_certificado: estadoRevocado.id_estado_certificado });
    return mapearCertificado(response.data);
}

// ADJUNTAR / REEMPLAZAR ARCHIVO
export async function subirArchivo(idCertificado, archivo) {
    const response = await subirArchivoCertificado(idCertificado, archivo);
    return mapearCertificado(response.data);
}

// DESCARGAR CERTIFICADO
export async function descargarCertificado(cert) {
    if (!cert.url_documento) {
        alert("Este certificado todavía no tiene un archivo adjunto.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}${cert.url_documento}`);
        if (!response.ok) throw new Error("No se pudo descargar el archivo del certificado.");

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