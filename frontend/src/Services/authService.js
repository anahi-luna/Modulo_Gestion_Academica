// Servicio de autenticación / permisos.
// Por ahora no tengo login real, así que lo que hago es pedirle al back
// el usuario "logueado" mandándole el username por query param
// (?usuario=docente, ?usuario=admin, etc). El back me devuelve el usuario
// con sus roles Y ya resueltos en un array de permisos tipo
// "micro2.asistencias.crear". Con eso arma después el hasPermission.

import API_URL from "./api";

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
        const response = await fetch(`${API_URL}/auth/me?usuario=${username}`);
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
        const response = await fetch(`${API_URL}/auth/usuarios`);
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
