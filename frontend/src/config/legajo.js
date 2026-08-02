export function obtenerIdLegajo(user) {
  if (!user) return null;

  // Nombre esperado del campo: id_legajo (mismo nombre que se usa en
  // TODO el resto del proyecto: legajosApi.js, planesService.js,
  // certificadosService.js, etc). Si Auth lo manda con otro nombre, o
  // anidado (por ej. user.legajo.id), cambiá SOLO esta línea:
  const idLegajo = user.id_legajo;

  if (idLegajo == null) {
    if (import.meta.env.DEV) {
      console.warn(
        "[legajo] El usuario logueado no tiene id_legajo."
      );
    }
    return null;
  }

  return idLegajo;
}