import { Navigate, Route } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { LOGIN_ROUTE } from "../config";
import { HOME_ROUTE } from "../config";

export default function ProtectedRoute({
  children,
  roles = [],
  permissions = [],
}) {
  const {
    isAuthenticated,
    loading,
    hasRole,
    hasPermission,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );
  }
  console.log("loading:", loading);
  console.log("isAuthenticated:", isAuthenticated);
  console.log("LOGIN_ROUTE:", LOGIN_ROUTE);

  if (!isAuthenticated) {
    console.log("Redirigiendo...");
    window.location.replace(LOGIN_ROUTE);
    return null;
  }

  if (
    permissions.length > 0 &&
    !permissions.some((permiso) => hasPermission(permiso))
  ) {
    return <Navigate to={HOME_ROUTE} replace />;
  }

  if (
    roles.length > 0 &&
    !roles.some((rol) => hasRole(rol))
  ) {
    return <Navigate to={HOME_ROUTE} replace />;
  }

  return children;
}