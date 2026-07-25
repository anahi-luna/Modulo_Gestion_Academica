// Servicio para manejar la lógica de autenticación y autorización.

import API_URL from "../api/api";

// Con esto simulo "quién soy" hasta que exista un login de verdad.
// Lo guardo en localStorage para no perder la sesión simulada si
// recargo la página.
const USUARIO_KEY = "usuario_simulado";

export function obtenerUsuarioSimulado() {
    return localStorage.getItem(USUARIO_KEY) || "admin";
}

export function guardarUsuarioSimulado(username) {
    localStorage.setItem(USUARIO_KEY, username);
}

// Le pido al back el usuario actual (con roles + permisos ya armados).
export async function obtenerUsuarioActual(username) {
    try {
        const response = await fetch(`${API_URL}/mock/auth/me?usuario=${username}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "No se pudo obtener el usuario");
        }

        return data.data;
    } catch (error) {
        console.error("Error al obtener el usuario logueado", error);
        throw error;
    }
}

// Traigo el listado completo de usuarios mock, lo uso en el selector
// del Navbar para poder "meterme" como cualquiera de los usuarios de
// prueba que definió mi compañera en el back (admin, docente, alumno, etc).
export async function obtenerUsuarios() {
    try {
        const response = await fetch(`${API_URL}/mock/auth/usuarios`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "No se pudo obtener la lista de usuarios");
        }

        return data.data;
    } catch (error) {
        console.error("Error al obtener los usuarios", error);
        throw error;
    }
}
