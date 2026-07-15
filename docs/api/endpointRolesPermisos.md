# API - Mock de Autenticación y Autorización

Este módulo simula el comportamiento del Microservicio de Autenticación mientras dicho servicio se encuentra en desarrollo.

Su objetivo es permitir que el Frontend implemente el control de acceso a pantallas, botones y funcionalidades según los roles y permisos del usuario autenticado.

---

# URL Base

```text
http://localhost:5000/api/auth
```

---

# Flujo de trabajo

El Frontend deberá seguir el siguiente flujo al iniciar la aplicación.

1. El usuario inicia sesión (Login).
2. El Frontend obtiene el usuario autenticado.
3. El Backend devuelve:
   - Información del usuario.
   - Roles asignados.
   - Lista de permisos.
4. El Frontend guarda esta información (Context, Redux, Zustand, etc.).
5. Cada componente consulta la lista de permisos para decidir si puede mostrarse o no.

---

# Obtener usuario autenticado

## Endpoint

```http
GET /api/auth/me
```

## Descripción

Devuelve el usuario autenticado junto con todos sus roles y permisos.

Mientras el Microservicio de Autenticación no esté disponible, el usuario puede simularse mediante el parámetro de consulta `usuario`.

Si no se envía dicho parámetro, se utilizará el usuario **docente** por defecto.

---

## Ejemplos

Usuario por defecto

```http
GET /api/auth/me
```

Administrador

```http
GET /api/auth/me?usuario=admin
```

Director

```http
GET /api/auth/me?usuario=director
```

Docente

```http
GET /api/auth/me?usuario=docente
```

Alumno

```http
GET /api/auth/me?usuario=alumno
```

---

## Respuesta

```json
{
    "status": "success",
    "message": "Usuario autenticado.",
    "data": {
        "id": 5,
        "usuario": "docente",
        "nombre": "Laura Martínez",
        "cargo": "Docente",
        "email": "laura.martinez@instituto.edu.ar",
        "activo": true,
        "roles": [
            {
                "id": 10,
                "nombre": "Docencia"
            }
        ],
        "permisos": [
            "micro2.clases.leer",
            "micro2.clases.actualizar",
            "micro2.asistencias.crear",
            "micro2.asistencias.leer",
            "micro2.asistencias.actualizar",
            "micro2.evaluaciones.crear",
            "micro2.evaluaciones.leer",
            "micro2.evaluaciones.actualizar",
            "micro2.calificaciones.crear",
            "micro2.calificaciones.leer",
            "micro2.calificaciones.actualizar"
        ]
    }
}
```

---

# Obtener todos los usuarios

## Endpoint

```http
GET /api/auth/usuarios
```

## Descripción

Obtiene el listado completo de usuarios simulados disponibles para realizar pruebas.

Este endpoint es únicamente para desarrollo.

---

## Respuesta

```json
{
    "status": "success",
    "message": "Listado de usuarios.",
    "total": 8,
    "data": [
        {
            "id": 1,
            "usuario": "admin",
            "nombre": "Juan Pérez",
            "cargo": "Administrador del Sistema",
            "roles": [
                {
                    "id": 1,
                    "nombre": "Administrador Microservicio"
                }
            ],
            "permisos": [
                "micro2.inscripciones.crear",
                "... etc ..."
            ]
        }
    ]
}
```

---

# Obtener usuario por ID

## Endpoint

```http
GET /api/auth/usuarios/{id}
```

## Ejemplo

```http
GET /api/auth/usuarios/5
```

---

# Obtener usuario por username

## Endpoint

```http
GET /api/auth/usuarios/username/{username}
```

## Ejemplo

```http
GET /api/auth/usuarios/username/docente
```

---

# Estructura de la respuesta

## Usuario

| Campo | Tipo | Descripción |
|--------|------|-------------|
| id | Integer | Identificador del usuario |
| usuario | String | Nombre de usuario |
| nombre | String | Nombre completo |
| cargo | String | Cargo institucional |
| email | String | Correo electrónico |
| activo | Boolean | Estado del usuario |

---

## Roles

Cada usuario puede poseer uno o más roles.

```json
[
    {
        "id": 10,
        "nombre": "Docencia"
    }
]
```

---

## Permisos

Los permisos determinan las acciones habilitadas para el usuario.

Ejemplo:

```json
[
    "micro2.inscripciones.leer",
    "micro2.clases.actualizar",
    "micro2.asistencias.crear",
    "micro2.certificados.emitir"
]
```

Cada permiso corresponde a una acción específica del microservicio.

---

# Cómo utilizar los permisos en el Frontend

Se recomienda almacenar el usuario autenticado y la lista de permisos en un estado global (Context API, Redux, Zustand, etc.).

Luego cada componente podrá validar si un permiso existe antes de renderizar una funcionalidad.

Ejemplo:

```javascript
const puedeEmitir = permisos.includes(
    "micro2.certificados.emitir"
);

if (puedeEmitir) {
    // Mostrar botón Emitir Certificado
}
```

Otro ejemplo:

```javascript
const puedeEditar = permisos.includes(
    "micro2.inscripciones.actualizar"
);
```

---

# Permisos disponibles

## Inscripciones

- micro2.inscripciones.crear
- micro2.inscripciones.leer
- micro2.inscripciones.actualizar
- micro2.inscripciones.eliminar

## Clases

- micro2.clases.crear
- micro2.clases.leer
- micro2.clases.actualizar
- micro2.clases.eliminar

## Asistencias

- micro2.asistencias.crear
- micro2.asistencias.leer
- micro2.asistencias.actualizar
- micro2.asistencias.eliminar

## Evaluaciones

- micro2.evaluaciones.crear
- micro2.evaluaciones.leer
- micro2.evaluaciones.actualizar
- micro2.evaluaciones.eliminar

## Calificaciones

- micro2.calificaciones.crear
- micro2.calificaciones.leer
- micro2.calificaciones.actualizar
- micro2.calificaciones.eliminar

## Resultado Académico

- micro2.resultado_academico.generar
- micro2.resultado_academico.leer
- micro2.resultado_academico.eliminar

## Resultado Plan

- micro2.resultado_plan.leer
- micro2.resultado_plan.actualizar
- micro2.resultado_plan.eliminar

## Certificados

- micro2.certificados.emitir
- micro2.certificados.leer
- micro2.certificados.actualizar
- micro2.certificados.eliminar

## Reportes

- micro2.reportes.leer

---

# Importante

Este módulo utiliza información simulada mediante archivos YAML.

Cuando el Microservicio de Autenticación (MS3) esté disponible, estos endpoints serán reemplazados por llamadas reales al servicio de autenticación.

El formato de respuesta se mantendrá, por lo que el Frontend no deberá modificar la implementación de los componentes, únicamente la URL del servicio.