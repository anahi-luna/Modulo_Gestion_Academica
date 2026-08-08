import API_URL from "./api";

// ============================================================
// ESTADOS DE INSCRIPCIÓN
// ============================================================

export async function getEstadosInscripcion() {
    try {
        const response = await fetch(
            `${API_URL}/catalogos/estados-inscripcion`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "No se pudieron obtener los estados de inscripción."
            );
        }

        return data;
    } catch (error) {
        console.error("Error al obtener los estados de inscripción", error);
        throw error;
    }
}


// ============================================================
// ESTADOS DE ASISTENCIA
// ============================================================

export async function getEstadosAsistencia() {
    try {
        const response = await fetch(
            `${API_URL}/catalogos/estados-asistencia`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "No se pudieron obtener los estados de asistencia."
            );
        }

        return data;
    } catch (error) {
        console.error("Error al obtener los estados de asistencia", error);
        throw error;
    }
}


// ============================================================
// ESTADOS ACADÉMICOS
// ============================================================

export async function getEstadosAcademicos() {
    try {
        const response = await fetch(
            `${API_URL}/catalogos/estados-academicos`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "No se pudieron obtener los estados académicos."
            );
        }

        return data;
    } catch (error) {
        console.error("Error al obtener los estados académicos", error);
        throw error;
    }
}


// ============================================================
// ESTADOS DE RESULTADO DE PLAN
// ============================================================

export async function getEstadosResultadoPlan() {
    try {
        const response = await fetch(
            `${API_URL}/catalogos/estados-resultados-plan`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "No se pudieron obtener los estados de resultado de plan."
            );
        }

        return data;
    } catch (error) {
        console.error("Error al obtener los estados de resultado de plan", error);
        throw error;
    }
}


// ============================================================
// ESTADOS DE CERTIFICADO
// ============================================================

export async function getEstadosCertificado() {
    try {
        const response = await fetch(
            `${API_URL}/catalogos/estados-certificados`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "No se pudieron obtener los estados de certificado."
            );
        }

        return data;
    } catch (error) {
        console.error("Error al obtener los estados de certificado", error);
        throw error;
    }
}


// ============================================================
// TIPOS DE EVALUACIÓN
// ============================================================

export async function getTiposEvaluacion() {
    try {
        const response = await fetch(
            `${API_URL}/catalogos/tipos-evaluacion`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "No se pudieron obtener los tipos de evaluación."
            );
        }

        return data;
    } catch (error) {
        console.error("Error al obtener los tipos de evaluación", error);
        throw error;
    }
}


// ============================================================
// TIPOS DE CERTIFICADO
// ============================================================

export async function getTiposCertificado() {
    try {
        const response = await fetch(
            `${API_URL}/catalogos/tipos-certificado`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "No se pudieron obtener los tipos de certificado."
            );
        }

        return data;
    } catch (error) {
        console.error("Error al obtener los tipos de certificado", error);
        throw error;
    }
}