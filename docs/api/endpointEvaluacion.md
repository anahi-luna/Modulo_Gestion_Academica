# API REST - Módulo de Evaluaciones

## Base URL

```text
http://localhost:5000/api/evaluaciones/
```

---

# 1. Crear una evaluación

## Endpoint

```http
POST /api/evaluaciones/
```

## Descripción

Registra una nueva evaluación asociada a una comisión.

## Campos que debe enviar el Frontend

| Campo | Tipo | Obligatorio | Descripción |
|--------|------|-------------|-------------|
| id_comision | Integer | Sí | Comisión a la que pertenece la evaluación. |
| id_tipo_evaluacion | Integer | Sí | Tipo de evaluación (Parcial, Recuperatorio, Final, etc.). |
| titulo | String | Sí | Nombre o título de la evaluación. |
| fecha_evaluacion | Date (YYYY-MM-DD) | Sí | Fecha en la que se realizará la evaluación. |
| puntaje_maximo | Integer | Sí | Puntaje máximo que puede obtener el alumno. |
| id_evaluacion_origen | Integer | No | Evaluación origen en caso de tratarse de un recuperatorio. |

## Request

```json
{
    "id_comision": 1,
    "id_tipo_evaluacion": 1,
    "titulo": "Primer Parcial",
    "fecha_evaluacion": "2026-07-15",
    "puntaje_maximo": 100
}
```

## Campos generados automáticamente por el Backend

> **No deben enviarse en el request.**

| Campo | Descripción |
|--------|-------------|
| id_evaluacion | Identificador de la evaluación. |
| id_usuario_creacion | Usuario que registra la evaluación. |
| id_usuario_modificacion | Inicialmente `null`. |
| ts_creacion | Fecha y hora de creación. |
| ts_modificacion | Inicialmente `null`. |

## Response (201)

```json
{
    "data": {
        "fecha_evaluacion": "2026-07-15",
        "id_comision": 1,
        "id_evaluacion": 1,
        "id_evaluacion_origen": null,
        "id_tipo_evaluacion": 1,
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": null,
        "puntaje_maximo": 100,
        "tipo_evaluacion": {
            "id_tipo_evaluacion": 1,
            "nombre": "Parcial"
        },
        "titulo": "Primer Parcial",
        "ts_creacion": "2026-07-11T18:39:47.717011",
        "ts_modificacion": null
    },
    "message": "Evaluación creada correctamente.",
    "status": "success"
}
```

---

# 2. Obtener todas las evaluaciones

## Endpoint

```http
GET /api/evaluaciones/
```

## Descripción

Obtiene el listado de evaluaciones registradas.

## Parámetros opcionales

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id_comision | Integer | Devuelve únicamente las evaluaciones de la comisión indicada. |
| id_tipo_evaluacion | Integer | Devuelve únicamente las evaluaciones del tipo indicado. |

### Ejemplos

```http
GET /api/evaluaciones/
```

```http
GET /api/evaluaciones?id_comision=1
```

```http
GET /api/evaluaciones?id_tipo_evaluacion=1
```

```http
GET /api/evaluaciones?id_comision=1&id_tipo_evaluacion=1
```

## Response

```json
{
    "data": [
        {
            "fecha_evaluacion": "2026-07-15",
            "id_comision": 1,
            "id_evaluacion": 1,
            "id_evaluacion_origen": null,
            "id_tipo_evaluacion": 1,
            "id_usuario_creacion": 100,
            "id_usuario_modificacion": null,
            "puntaje_maximo": 100,
            "tipo_evaluacion": {
                "id_tipo_evaluacion": 1,
                "nombre": "Parcial"
            },
            "titulo": "Primer Parcial",
            "ts_creacion": "2026-07-11T18:39:47.717011",
            "ts_modificacion": null
        }
    ],
    "message": "Listado de evaluaciones.",
    "status": "success",
    "total": 1
}
```

---

# 3. Obtener una evaluación

## Endpoint

```http
GET /api/evaluaciones/{id_evaluacion}
```

## Descripción

Obtiene la información de una evaluación mediante su identificador.

### Ejemplo

```http
GET /api/evaluaciones/1
```

## Response

```json
{
    "data": {
        "fecha_evaluacion": "2026-07-15",
        "id_comision": 1,
        "id_evaluacion": 1,
        "id_evaluacion_origen": null,
        "id_tipo_evaluacion": 1,
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": null,
        "puntaje_maximo": 100,
        "tipo_evaluacion": {
            "id_tipo_evaluacion": 1,
            "nombre": "Parcial"
        },
        "titulo": "Primer Parcial",
        "ts_creacion": "2026-07-11T18:39:47.717011",
        "ts_modificacion": null
    },
    "message": "Evaluación encontrada.",
    "status": "success"
}
```

---

# 4. Modificar una evaluación

## Endpoint

```http
PUT /api/evaluaciones/{id_evaluacion}
```

## Descripción

Permite modificar los datos de una evaluación existente.

## Campos que pueden actualizarse

| Campo | Obligatorio | Observaciones |
|--------|-------------|---------------|
| id_comision | Sí | Debe corresponder a una comisión existente. |
| id_tipo_evaluacion | Sí | Debe existir el tipo de evaluación. |
| titulo | No | Título de la evaluación. |
| fecha_evaluacion | No | Fecha de la evaluación. |
| puntaje_maximo | No | Debe ser mayor que cero. |
| id_evaluacion_origen | No | Se utiliza para recuperatorios cuando corresponda. |

## Request

```json
{
    "id_comision": 1,
    "id_tipo_evaluacion": 2,
    "titulo": "Primer",
    "fecha_evaluacion": "2026-07-18",
    "puntaje_maximo": 90
}
```

## Response

```json
{
    "data": {
        "fecha_evaluacion": "2026-07-18",
        "id_comision": 1,
        "id_evaluacion": 1,
        "id_evaluacion_origen": null,
        "id_tipo_evaluacion": 2,
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": 100,
        "puntaje_maximo": 90,
        "tipo_evaluacion": {
            "id_tipo_evaluacion": 2,
            "nombre": "Recuperatorio"
        },
        "titulo": "Primer",
        "ts_creacion": "2026-07-11T18:39:47.717011",
        "ts_modificacion": "2026-07-11T18:47:32.851618"
    },
    "message": "Evaluación 1 actualizada.",
    "status": "success"
}
```

---

# 5. Eliminar una evaluación

## Endpoint

```http
DELETE /api/evaluaciones/{id_evaluacion}
```

## Descripción

Elimina una evaluación del sistema.

### Ejemplo

```http
DELETE /api/evaluaciones/1
```

## Response

```json
{
    "data": [],
    "message": "Evaluación 1 eliminada.",
    "status": "success"
}
```

---

# Validaciones del Backend

## Al crear una evaluación

El backend valida que:

- Exista la comisión indicada.
- Exista el tipo de evaluación.
- Exista el usuario que registra la operación.
- El puntaje máximo sea mayor que cero.
- Todos los campos obligatorios hayan sido enviados.
- La fecha tenga un formato válido.

## Al modificar una evaluación

El backend valida que:

- La evaluación exista.
- La comisión exista.
- El tipo de evaluación exista.
- El puntaje máximo sea mayor que cero.
- Los datos enviados respeten los tipos definidos por la API.

## Al eliminar una evaluación

El backend valida que:

- La evaluación exista.
- **No posea calificaciones asociadas.** En caso de existir calificaciones registradas para esa evaluación, la eliminación será rechazada para preservar la integridad de la información académica.

---

# Tipos de evaluación

Actualmente el sistema contempla los siguientes tipos de evaluación:

| Id | Tipo |
|----|------|
| 1 | Parcial |
| 2 | Recuperatorio |
| 3 | Final |
| 4 | Trabajo Práctico |

---

# Códigos de respuesta

| Código | Significado |
|---------|-------------|
| 200 | Operación realizada correctamente. |
| 201 | Recurso creado correctamente. |
| 400 | Error de validación o regla de negocio. |
| 404 | Recurso no encontrado. |
| 500 | Error interno del servidor. |