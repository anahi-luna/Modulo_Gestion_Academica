import { Navigate } from "react-router-dom";

/*
 * Envoltorio para proteger rutas según el rol del usuario.
 * Si el rol del usuario no está en la lista de permitidos,
 * lo redirige al Home.
 */
export default function RutaProtegida({ usuario, rolesPermitidos, children }) {
    if (!rolesPermitidos.includes(usuario.rol)) {
        return <Navigate to="/" replace />;
    }
    return children;
}