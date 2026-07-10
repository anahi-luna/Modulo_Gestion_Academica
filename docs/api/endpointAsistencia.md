# API REST - Módulo de Asistencias

## Base URL

```text
http://localhost:5000/api/asistencias/
```

---

# Flujo de registro de asistencias

Antes de registrar una asistencia el Frontend debe seguir el siguiente flujo:

1. Obtener las inscripciones de una comisión.
2. Obtener las clases de esa comisión.
3. Seleccionar una clase con estado **DICTADA**.
4. Mostrar el listado de alumnos inscriptos.
5. Registrar la asistencia de todos los alumnos mediante un único request.

> **Importante:** Solo es posible registrar asistencias para clases con estado **DICTADA**.

---

# 1. Registrar asistencias

## Endpoint

```http
POST /api/asistencias/
```

## Descripción

Registra la asistencia de todos los alumnos de una clase.

## Request

```json
{
    "id_clase": 2,
    "asistencias": [
        {
            "id_inscripcion": 3,
            "id_estado": 1,
            "observacion": "Presente"
        },
        {
            "id_inscripcion": 4,
            "id_estado": 1,
            "observacion": "Presente"
        }
    ]
}
```

## Campos generados por el Backend

- id_asistencia
- tipo_registro (MANUAL)
- id_usuario_creacion
- id_usuario_modificacion
- ts_creacion
- ts_modificacion

## Response (201)

```json
{
    "data": [
        {
            "clase": {
                "estado": "DICTADA",
                "fecha": "2026-07-06",
                "hora_fin": "20:00:00",
                "hora_inicio": "18:00:00",
                "id_clase": 2,
                "id_comision": 1,
                "id_usuario_creacion": 100,
                "id_usuario_modificacion": 100,
                "numero_clase": 2,
                "tema": "Matafuegos I",
                "ts_creacion": "2026-07-10T10:30:48.131004",
                "ts_modificacion": "2026-07-10T10:39:47.905339"
            },
            "estado": {
                "id_estado_asistencia": 1,
                "nombre": "Presente"
            },
            "id_asistencia": 2,
            "id_clase": 2,
            "id_estado": 1,
            "id_inscripcion": 3,
            "id_usuario_creacion": 100,
            "id_usuario_modificacion": null,
            "observacion": "Presente",
            "tipo_registro": "MANUAL",
            "ts_creacion": "2026-07-10T10:47:49.004982",
            "ts_modificacion": null
        }
    ],
    "message": "Asistencias registradas correctamente.",
    "status": "success",
    "total": 2
}
```

---

# 2. Obtener todas las asistencias

## Endpoint

```http
GET /api/asistencias/
```

## Parámetros opcionales

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id_clase | Integer | Filtra por clase. |
| id_inscripcion | Integer | Filtra por inscripción. |

### Ejemplos

```http
GET /api/asistencias/
```

```http
GET /api/asistencias?id_clase=2
```

```http
GET /api/asistencias?id_inscripcion=3
```

## Response

```json
{
    "data": [
        {
            "clase": {
                "estado": "DICTADA",
                "fecha": "2026-07-06",
                "hora_fin": "20:00:00",
                "hora_inicio": "18:00:00",
                "id_clase": 1,
                "id_comision": 2,
                "id_usuario_creacion": 100,
                "id_usuario_modificacion": 100,
                "numero_clase": 1,
                "tema": "Matafuegos I",
                "ts_creacion": "2026-07-10T10:30:14.264854",
                "ts_modificacion": "2026-07-10T10:32:21.678524"
            },
            "estado": {
                "id_estado_asistencia": 2,
                "nombre": "Ausente"
            },
            "id_asistencia": 1,
            "id_clase": 1,
            "id_estado": 2,
            "id_inscripcion": 1,
            "id_usuario_creacion": 100,
            "id_usuario_modificacion": 100,
            "observacion": "No llego",
            "tipo_registro": "MANUAL",
            "ts_creacion": "2026-07-10T10:36:53.265438",
            "ts_modificacion": "2026-07-10T10:53:16.015214"
        }
    ],
    "message": "Listado de asistencias.",
    "status": "success",
    "total": 3
}
```

---

# 3. Obtener una asistencia

## Endpoint

```http
GET /api/asistencias/{id_asistencia}
```

## Response

```json
{
    "data": {
        "clase": {
            "estado": "DICTADA",
            "fecha": "2026-07-06",
            "hora_fin": "20:00:00",
            "hora_inicio": "18:00:00",
            "id_clase": 1,
            "id_comision": 2,
            "id_usuario_creacion": 100,
            "id_usuario_modificacion": 100,
            "numero_clase": 1,
            "tema": "Matafuegos I",
            "ts_creacion": "2026-07-10T10:30:14.264854",
            "ts_modificacion": "2026-07-10T10:32:21.678524"
        },
        "estado": {
            "id_estado_asistencia": 2,
            "nombre": "Ausente"
        },
        "id_asistencia": 1,
        "id_clase": 1,
        "id_estado": 2,
        "id_inscripcion": 1,
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": 100,
        "observacion": "No llego",
        "tipo_registro": "MANUAL",
        "ts_creacion": "2026-07-10T10:36:53.265438",
        "ts_modificacion": "2026-07-10T10:53:16.015214"
    },
    "message": "Asistencia encontrada.",
    "status": "success"
}
```

---

# 4. Modificar una asistencia

## Endpoint

```http
PUT /api/asistencias/{id_asistencia}
```

## Campos modificables

- id_estado
- observacion

## Request

```json
{
    "id_estado": 2,
    "observacion": "No llego"
}
```

## Response

```json
{
    "data": {
        "clase": {
            "estado": "DICTADA",
            "id_clase": 1,
            "id_comision": 2,
            "numero_clase": 1,
            "tema": "Matafuegos I"
        },
        "estado": {
            "id_estado_asistencia": 2,
            "nombre": "Ausente"
        },
        "id_asistencia": 1,
        "id_clase": 1,
        "id_estado": 2,
        "id_inscripcion": 1,
        "observacion": "No llego",
        "tipo_registro": "MANUAL",
        "id_usuario_modificacion": 100,
        "ts_modificacion": "2026-07-10T10:53:16.015214"
    },
    "message": "Asistencia 1 actualizada.",
    "status": "success"
}
```

---

# Validaciones del Backend

Al registrar una asistencia el sistema valida:

- La clase existe.
- La clase está en estado **DICTADA**.
- El usuario existe.
- La inscripción existe.
- La inscripción pertenece a la comisión de la clase.
- El estado de asistencia existe.
- No exista una asistencia registrada para esa inscripción y clase.

Al modificar una asistencia el sistema valida:

- La asistencia existe.
- La clase asociada existe.
- La clase continúa en estado **DICTADA**.
- El estado de asistencia exista.
- Solo puedan modificarse el estado y la observación.

---

# Estados de asistencia

| Id | Estado |
|----|---------|
| 1 | Presente |
| 2 | Ausente |
| 3 | Justificado |
| 4 | Tarde |

---

# Tipo de registro

Actualmente el sistema registra las asistencias mediante:

- MANUAL

> En futuras versiones se incorporará el registro mediante código QR.

---

# Códigos de respuesta

| Código | Descripción |
|---------|-------------|
| 200 | Operación exitosa. |
| 201 | Recurso creado correctamente. |
| 400 | Error de validación o regla de negocio. |
| 404 | Recurso no encontrado. |
| 500 | Error interno del servidor. |