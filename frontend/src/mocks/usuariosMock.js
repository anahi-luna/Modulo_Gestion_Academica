// Mocks de usuarios provisorios, para simular los distintos roles del sistema
// hasta que exista el módulo real de autenticación/usuarios.

export const ROLES = {
  ALUMNO: "ALUMNO",
  PROFESOR: "PROFESOR",
  ADMIN: "ADMIN",
};

export const ADMIN_MOCK = {
  id: 1,
  nombre: "Administrador",
  rol: ROLES.ADMIN,
};

export const ALUMNO_MOCK = {
  id: 2,
  nombre: "Juan Pablo Gonzalez",
  rol: ROLES.ALUMNO,
  id_legajo: 1,
  numero_legajo: "000123",
};

export const PROFESOR_MOCK = {
  id: 3,
  nombre: "Prof. Romero",
  rol: ROLES.PROFESOR,
  id_comision: 6, // la comisión que dicta (ej: COM-403-F)
};