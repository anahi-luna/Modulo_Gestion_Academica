// API para certificados
import API_URL from "./api";

// Obtiene la lista de certificados emitidos, sin filtros
export async function getListaCertificados() {
    try {
        const response = await fetch(`${API_URL}/certificados/`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("Error al obtener los certificados", error);
        throw error;
    }
}
// Obtiene solo los certificados del alumno autenticado
// (el back identifica al alumno por el token, no hace falta mandar el legajo).
export async function getMisCertificados() {
    try {
        const response = await fetch(`${API_URL}/certificados/mis-certificados`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("Error al obtener mis certificados", error);
        throw error;
    }
}

// Obtiene un certificado por su id
export async function getCertificadoPorId(id) {
    try {
        const response = await fetch(`${API_URL}/certificados/${id}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("Error al obtener el certificado", error);
        throw error;
    }
}

// Emite un certificado a partir de un resultado de plan ya cerrado
// (Finalizado o Incompleto). El back decide solo el tipo (Aprobación o
// Participación) y el código de verificación; nosotros solo mandamos
// el id_resultado_plan.
export async function crearCertificado(idResultadoPlan) {
    try {
        const response = await fetch(`${API_URL}/certificados/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_resultado_plan: idResultadoPlan }),
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("Error al emitir el certificado", error);
        throw error;
    }
}

// datos puede traer id_estado_certificado (para revocar, por ejemplo),
// url_documento y/o fecha_vencimiento.
export async function editarCertificado(id, datos) {
    try {
        const response = await fetch(`${API_URL}/certificados/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("Error al actualizar el certificado", error);
        throw error;
    }
}

// Solo para desarrollo.
export async function eliminarCertificado(id) {
    try {
        const response = await fetch(`${API_URL}/certificados/${id}`, {
            method: "DELETE",
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("Error al eliminar el certificado", error);
        throw error;
    }
}