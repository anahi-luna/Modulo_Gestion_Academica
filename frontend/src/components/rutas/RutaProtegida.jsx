import { Navigate } from "react-router-dom";
import { usePermissions } from "../../context/PermissionsContext";

// Envoltorio para proteger rutas según el PERMISO del usuario (ya no
// según su rol como antes). Le paso el/los permisos que hacen falta
// para entrar a la ruta, y si el usuario no los tiene, lo mando de
// vuelta al Home.
//
// permisoRequerido: puede ser un solo string ("micro2.asistencias.leer")
// o un array de strings, en cuyo caso alcanza con que tenga UNO
// cualquiera de esos permisos para poder entrar.
export default function RutaProtegida({ permisoRequerido, children }) {
    const { usuario, cargando, hasPermission, hasAnyPermission } = usePermissions();

    // Mientras todavía no sé quién es el usuario (primer render, esperando
    // la respuesta de /api/auth/me) no decido nada todavía, para no
    // redirigir de más por las dudas.
    if (cargando) {
        return (
            <div className="flex justify-center py-20 text-gray-400 text-sm">
                Cargando permisos...
            </div>
        );
    }

    if (!usuario) {
        return <Navigate to="/" replace />;
    }

    const tienePermiso = Array.isArray(permisoRequerido)
        ? hasAnyPermission(permisoRequerido)
        : hasPermission(permisoRequerido);

    if (!tienePermiso) {
        return <Navigate to="/" replace />;
    }

    return children;
}
