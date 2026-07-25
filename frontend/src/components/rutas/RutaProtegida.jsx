import { Navigate } from "react-router-dom";
import { usePermissions } from "../../context/PermissionsContext";
// Componente de ruta protegida que verifica si el usuario tiene el permiso requerido para acceder a la ruta.
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
