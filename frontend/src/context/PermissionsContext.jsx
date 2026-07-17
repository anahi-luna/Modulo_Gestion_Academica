// Este contexto es el corazón de todo el tema de roles y permisos.
// La idea: en vez de tener AsistenciaAdmin, MisCalificaciones, HomeAdmin,
// HomeAlumno, etc. (una vista por rol), tengo UNA sola vista por módulo,
// y adentro de esa vista pregunto "¿este usuario puede hacer tal cosa?"
// con hasPermission("micro2.asistencias.crear"). Si puede, le muestro el
// botón/input. Si no, se lo oculto (o se lo muestro solo de lectura).
//
// Los permisos no los invento yo en el front: se los pido al back
// (GET /api/auth/me?usuario=X), que ya me arma el usuario con su array
// de permisos resuelto a partir de sus roles (ver roles.yml y
// permisos.yml que dejó mi compañera en el back).

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
    obtenerUsuarioActual,
    obtenerUsuarioSimulado,
    guardarUsuarioSimulado,
} from "../Services/authService";

const PermissionsContext = createContext(null);

export function PermissionsProvider({ children }) {
    // usuario = lo que me devuelve el back: id, usuario, nombre, cargo,
    // email, roles [{id, nombre}] y permisos [ "micro2.x.y", ... ].
    const [usuario, setUsuario] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const cargarUsuario = useCallback(async (username) => {
        setCargando(true);
        setError(null);
        try {
            const data = await obtenerUsuarioActual(username);
            setUsuario(data);
            guardarUsuarioSimulado(username);
        } catch (err) {
            setError(err.message);
            setUsuario(null);
        } finally {
            setCargando(false);
        }
    }, []);

    // Al montar la app, cargo el usuario que quedó "logueado" (simulado)
    // la última vez, o "admin" si es la primera vez que se abre.
    useEffect(() => {
        cargarUsuario(obtenerUsuarioSimulado());
    }, [cargarUsuario]);

    // Esto lo uso desde el selector de usuarios del Navbar para
    // "cambiar de usuario" y ver la app como otro rol distinto.
    function cambiarUsuario(username) {
        cargarUsuario(username);
    }

    // La función clave: recibe una acción tipo "micro2.asistencias.crear"
    // y devuelve true/false según si el usuario la tiene en su array de
    // permisos. Si todavía no cargó el usuario, devuelvo false (mejor
    // ocultar de más mientras carga, que mostrar algo que después no
    // puede usar).
    function hasPermission(accion) {
        if (!usuario) return false;
        return usuario.permisos.includes(accion);
    }

    // Variante para cuando alcanza con CUALQUIERA de varios permisos,
    // por ejemplo para decidir si mostrar la card de un módulo en el
    // Home (con que tenga UNA acción de ese módulo, ya lo dejo entrar).
    function hasAnyPermission(acciones) {
        if (!usuario) return false;
        return acciones.some((accion) => usuario.permisos.includes(accion));
    }

    return (
        <PermissionsContext.Provider
            value={{
                usuario,
                cargando,
                error,
                hasPermission,
                hasAnyPermission,
                cambiarUsuario,
            }}
        >
            {children}
        </PermissionsContext.Provider>
    );
}

// Hook para consumir el contexto fácil desde cualquier componente:
// const { usuario, hasPermission } = usePermissions();
export function usePermissions() {
    const contexto = useContext(PermissionsContext);
    if (!contexto) {
        throw new Error("usePermissions tiene que usarse dentro de un PermissionsProvider");
    }
    return contexto;
}
