// Verifica si el usuario tiene un permiso
export function hasPermission(userPermissions = [], permission) {
  return userPermissions.includes(permission);
}

// Verifica si el usuario tiene rol
// Los nombres de rol se normalizan a MAYÚSCULAS en el backend
// (ver normalizar_nombre_rol en auth/backend), así que comparamos
// sin distinguir mayúsculas/minúsculas para no depender de eso acá.
export function hasRole(userRoles = [], role) {
  const buscado = role.toUpperCase();
  return userRoles.some((r) => typeof r === "string" && r.toUpperCase() === buscado);
}