# API REST - Módulo de Calificaciones

## Base URL

```text
http://localhost:5000/api/calificaciones/
```

---

# 1. Registrar calificaciones

## Endpoint

```http
POST /api/calificaciones/
```

## Descripción

Registra las calificaciones obtenidas por uno o varios alumnos para una evaluación determinada.

## Campos que debe enviar el Frontend

| Campo | Tipo | Obligatorio | Descripción |
|--------|------|-------------|-------------|
| id_evaluacion | Integer | Sí | Evaluación sobre la cual se registrarán las calificaciones. |
| calificaciones | Array | Sí | Lista de calificaciones a registrar. |

### Campos de cada calificación

| Campo | Tipo | Obligatorio | Descripción |
|--------|------|-------------|-------------|
| id_inscripcion | Integer | Sí | Identificador de la inscripción del alumno. |
| puntaje | Decimal | Sí | Puntaje obtenido por el alumno. |
| observacion | String | No | Observación sobre la evaluación del alumno. |

## Request

```json
{
    "id_evaluacion": 1,
    "calificaciones": [
        {
            "id_inscripcion": 1,
            "puntaje": 80,
            "observacion": "Excelente"
        }
    ]
}
```

## Campos generados automáticamente por el Backend

> **No deben enviarse en el request.**

| Campo | Descripción |
|--------|-------------|
| id_calificacion | Identificador de la calificación. |
| id_usuario_creacion | Usuario que registra la calificación. |
| id_usuario_modificacion | Inicialmente `null`. |
| ts_creacion | Fecha y hora de creación. |
| ts_modificacion | Inicialmente `null`. |

## Response (201)

```json
{
    "data": [
        {
            "evaluacion": {
                "fecha_evaluacion": "2026-07-18",
                "id_evaluacion": 1,
                "id_tipo_evaluacion": 2,
                "puntaje_maximo": 90.0,
                "titulo": "Primer"
            },
            "id_calificacion": 1,
            "id_evaluacion": 1,
            "id_inscripcion": 1,
            "id_usuario_creacion": 100,
            "id_usuario_modificacion": null,
            "observacion": "Excelente",
            "puntaje": 80.0,
            "ts_creacion": "2026-07-11T19:08:16.356185",
            "ts_modificacion": null
        }
    ],
    "message": "Calificaciones registradas correctamente.",
    "status": "success",
    "total": 1
}
```

---

# 2. Obtener todas las calificaciones

## Endpoint

```http
GET /api/calificaciones/
```

## Descripción

Obtiene el listado de calificaciones registradas.

## Parámetros opcionales

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id_evaluacion | Integer | Devuelve únicamente las calificaciones de una evaluación. |
| id_inscripcion | Integer | Devuelve únicamente las calificaciones de una inscripción. |

### Ejemplos

```http
GET /api/calificaciones/
```

```http
GET /api/calificaciones?id_evaluacion=1
```

```http
GET /api/calificaciones?id_inscripcion=1
```

```http
GET /api/calificaciones?id_evaluacion=1&id_inscripcion=1
```

## Response

```json
{
    "data": [
        {
            "evaluacion": {
                "fecha_evaluacion": "2026-07-18",
                "id_evaluacion": 1,
                "id_tipo_evaluacion": 2,
                "puntaje_maximo": 90.0,
                "titulo": "Primer"
            },
            "id_calificacion": 1,
            "id_evaluacion": 1,
            "id_inscripcion": 1,
            "id_usuario_creacion": 100,
            "id_usuario_modificacion": null,
            "observacion": "Excelente",
            "puntaje": 80.0,
            "ts_creacion": "2026-07-11T19:08:16.356185",
            "ts_modificacion": null
        }
    ],
    "message": "Listado de calificaciones.",
    "status": "success",
    "total": 1
}
```

---

# 3. Obtener una calificación

## Endpoint

```http
GET /api/calificaciones/{id_calificacion}
```

## Descripción

Obtiene la información de una calificación mediante su identificador.

### Ejemplo

```http
GET /api/calificaciones/1
```

## Response

```json
{
    "data": {
        "evaluacion": {
            "fecha_evaluacion": "2026-07-18",
            "id_evaluacion": 1,
            "id_tipo_evaluacion": 2,
            "puntaje_maximo": 90.0,
            "titulo": "Primer"
        },
        "id_calificacion": 1,
        "id_evaluacion": 1,
        "id_inscripcion": 1,
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": null,
        "observacion": "Excelente",
        "puntaje": 80.0,
        "ts_creacion": "2026-07-11T19:08:16.356185",
        "ts_modificacion": null
    },
    "message": "Calificación encontrada.",
    "status": "success"
}
```

---

# 4. Modificar una calificación

## Endpoint

```http
PUT /api/calificaciones/{id_calificacion}
```

## Descripción

Permite modificar una calificación existente.

## Campos que pueden actualizarse

| Campo | Obligatorio | Observaciones |
|--------|-------------|---------------|
| puntaje | No | Nuevo puntaje obtenido por el alumno. |
| observacion | No | Observación de la evaluación. |

## Request

```json
{
    "puntaje": 75,
    "observacion": "Muy buen desempeño"
}
```

## Response

```json
{
    "data": {
        "evaluacion": {
            "fecha_evaluacion": "2026-07-18",
            "id_evaluacion": 1,
            "id_tipo_evaluacion": 2,
            "puntaje_maximo": 90.0,
            "titulo": "Primer"
        },
        "id_calificacion": 1,
        "id_evaluacion": 1,
        "id_inscripcion": 1,
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": 100,
        "observacion": "Muy buen desempeño",
        "puntaje": 75.0,
        "ts_creacion": "2026-07-11T19:08:16.356185",
        "ts_modificacion": "2026-07-11T19:10:22.394840"
    },
    "message": "Calificación 1 actualizada.",
    "status": "success"
}
```

---

# 5. Eliminar una calificación

## Endpoint

```http
DELETE /api/calificaciones/{id_calificacion}
```

## Descripción

Elimina una calificación registrada.

### Ejemplo

```http
DELETE /api/calificaciones/1
```

## Response

```json
{
    "data": [],
    "message": "Calificación 1 eliminada.",
    "status": "success"
}
```

---

# Validaciones del Backend

## Al registrar calificaciones

El backend valida que:

- Exista la evaluación indicada.
- Exista la inscripción indicada.
- La inscripción pertenezca a la misma comisión de la evaluación.
- Exista el usuario que registra la operación.
- No exista previamente una calificación para esa inscripción en esa misma evaluación.
- El puntaje sea mayor o igual a cero.
- El puntaje no supere el puntaje máximo definido para la evaluación.
- Todos los campos obligatorios hayan sido enviados.

## Al modificar una calificación

El backend valida que:

- La calificación exista.
- Si se modifica el puntaje, este sea mayor o igual a cero.
- El nuevo puntaje no supere el puntaje máximo definido para la evaluación.
- Los datos enviados respeten los tipos definidos por la API.

## Al eliminar una calificación

El backend valida que:

- La calificación exista.
- La eliminación se realice antes del cierre del resultado académico correspondiente. *(Actualmente esta validación queda prevista para futuras versiones del sistema.)*

---

# Reglas de negocio

- Una inscripción solo puede tener **una única calificación** por evaluación.
- Una evaluación puede tener **muchas calificaciones**, una por cada alumno inscripto.
- No es posible registrar una calificación para una inscripción que no pertenezca a la comisión de la evaluación.
- El puntaje obtenido nunca puede superar el puntaje máximo definido para la evaluación.

---

# Códigos de respuesta

| Código | Significado |
|---------|-------------|
| 200 | Operación realizada correctamente. |
| 201 | Recurso creado correctamente. |
| 400 | Error de validación o regla de negocio. |
| 404 | Recurso no encontrado. |
| 500 | Error interno del servidor. |