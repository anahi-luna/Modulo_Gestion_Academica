import API_URL from "./api";

// Genera en bloque los resultados académicos de TODOS los alumnos
// aceptados de una comisión ya finalizada (el back calcula promedio y
// asistencia solo, no se le manda nada de eso). Por diseño del back,
// esto NO es por alumno ni por certificado: es por comisión completa.
export async function generarResultadosAcademicos(idComision) {
    try {
        const response = await fetch(`${API_URL}/resultados-academicos/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_comision: idComision }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("Error al generar los resultados académicos", error);
        throw error;
    }
}

// Obtiene la lista de resultados académicos, sin filtros
export async function getListaResultadosAcademicos() {
    try {
        const response = await fetch(`${API_URL}/resultados-academicos/`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("Error al obtener los resultados académicos", error);
        throw error;
    }
}

// Obtiene un resultado académico por su id
export async function getResultadoAcademicoPorId(id) {
    try {
        const response = await fetch(`${API_URL}/resultados-academicos/${id}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("Error al obtener el resultado académico", error);
        throw error;
    }
}

// Solo para desarrollo, según el comentario del back en la ruta.
export async function eliminarResultadoAcademico(id) {
    try {
        const response = await fetch(`${API_URL}/resultados-academicos/${id}`, {
            method: "DELETE",
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("Error al eliminar el resultado académico", error);
        throw error;
    }
}
