import API_URL from "./api"; //importamos la url de la api general

// Obtiene la lista de resultados de plan, sin filtros
export async function getListaResultadosPlan() {
    try {
        const response = await fetch(`${API_URL}/resultados-planes/`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("Error al obtener los resultados de plan", error);
        throw error;
    }
}

//trae resultados de plan por id
export async function getResultadoPlanPorId(id) {
    try {
        const response = await fetch(`${API_URL}/resultados-planes/${id}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("Error al obtener el resultado de plan", error);
        throw error;
    }
}

// Cambia el estado del resultado del plan (por ejemplo, a "Abandonado").
// datos: { id_estado_resultado_plan }
export async function actualizarEstadoResultadoPlan(id, datos) {
    try {
        const response = await fetch(`${API_URL}/resultados-planes/${id}`, {
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
        console.error("Error al actualizar el resultado de plan", error);
        throw error;
    }
}

// Solo para desarrollo.
export async function eliminarResultadoPlan(id) {
    try {
        const response = await fetch(`${API_URL}/resultados-planes/${id}`, {
            method: "DELETE",
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("Error al eliminar el resultado de plan", error);
        throw error;
    }
}
