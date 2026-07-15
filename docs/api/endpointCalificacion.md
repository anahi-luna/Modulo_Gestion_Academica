# API REST - Módulo Calificaciones

---

## Base URL

```text
http://localhost:5000/api/calificaciones/
```

---

# Obtener todas las calificaciones

## Endpoint

```http
GET /api/calificaciones/
```

## Descripción

Obtiene el listado de calificaciones registradas.

También permite aplicar filtros mediante parámetros de consulta.

## Parámetros opcionales

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id_evaluacion | Integer | Filtra las calificaciones de una evaluación. |
| id_inscripcion | Integer | Filtra las calificaciones de una inscripción. |

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

## Respuesta

```json
{
    "status": "success",
    "message": "Listado de calificaciones.",
    "total": 1,
    "data": [
        {
            "id_calificacion": 1,
            "id_evaluacion": 1,
            "id_inscripcion": 1,
            "puntaje": 80,
            "observacion": "Excelente",
            "evaluacion": {
                "id_evaluacion": 1,
                "titulo": "Primer Parcial",
                "puntaje_maximo": 100
            },
            "id_usuario_creacion": 100,
            "id_usuario_modificacion": null,
            "ts_creacion": "2026-07-11T19:08:16",
            "ts_modificacion": null
        }
    ]
}
```

---

# Obtener una calificación

## Endpoint

```http
GET /api/calificaciones/{id}
```

## Descripción

Obtiene una calificación según su identificador.

## Respuesta

```json
{
    "status": "success",
    "message": "Calificación encontrada.",
    "data": {
        "id_calificacion": 1,
        "id_evaluacion": 1,
        "id_inscripcion": 1,
        "puntaje": 80,
        "observacion": "Excelente",
        "evaluacion": {
            "id_evaluacion": 1,
            "titulo": "Primer Parcial",
            "puntaje_maximo": 100
        },
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": null,
        "ts_creacion": "2026-07-11T19:08:16",
        "ts_modificacion": null
    }
}
```

---

# Registrar calificaciones

## Endpoint

```http
POST /api/calificaciones/
```

## Descripción

Registra las calificaciones correspondientes a una evaluación.

Todas las calificaciones enviadas se registran mediante una única solicitud.

## Request

```json
{
    "id_evaluacion": 1,
    "calificaciones": [
        {
            "id_inscripcion": 1,
            "puntaje": 80,
            "observacion": "Excelente"
        },
        {
            "id_inscripcion": 2,
            "puntaje": 65,
            "observacion": "Regular"
        }
    ]
}
```

## Campos generados automáticamente

- id_calificacion
- id_usuario_creacion
- id_usuario_modificacion
- ts_creacion
- ts_modificacion

## Respuesta

```json
{
    "status": "success",
    "message": "Calificaciones registradas correctamente.",
    "total": 2,
    "data": [
        {
            "id_calificacion": 1,
            "id_evaluacion": 1,
            "id_inscripcion": 1,
            "puntaje": 80,
            "observacion": "Excelente",
            "id_usuario_creacion": 100,
            "id_usuario_modificacion": null,
            "ts_creacion": "2026-07-11T19:08:16",
            "ts_modificacion": null
        }
    ]
}
```

## Validaciones

Antes de registrar las calificaciones el sistema verifica que:

- La evaluación exista.
- El usuario exista.
- La inscripción exista.
- La inscripción pertenezca a la misma comisión de la evaluación.
- No exista previamente una calificación para esa inscripción en esa evaluación.
- El puntaje sea mayor o igual a cero.
- El puntaje no supere el puntaje máximo definido para la evaluación.

---

# Actualizar calificación

## Endpoint

```http
PUT /api/calificaciones/{id}
```

## Descripción

Permite modificar una calificación existente.

Los únicos campos modificables son:

- puntaje
- observacion

## Request

```json
{
    "puntaje": 75,
    "observacion": "Muy buen desempeño"
}
```

## Reglas de negocio

Durante la actualización el sistema:

- Verifica que la calificación exista.
- Verifica que el usuario exista.
- Verifica que la evaluación asociada exista.
- El puntaje no puede ser negativo.
- El puntaje no puede superar el puntaje máximo definido para la evaluación.
- Si no hubo cambios en los datos enviados, no se realiza ninguna actualización en la base de datos.

---

# Eliminar calificación

## Endpoint

```http
DELETE /api/calificaciones/{id}
```

## Descripción

Elimina una calificación registrada.

---

# Reglas de negocio

- Una inscripción solo puede poseer una calificación por evaluación.
- Una evaluación puede tener múltiples calificaciones.
- La inscripción debe pertenecer a la comisión de la evaluación.
- El puntaje nunca puede superar el puntaje máximo de la evaluación.
- El puntaje nunca puede ser negativo.

---

# Códigos de respuesta

| Código | Descripción |
|---------|-------------|
|200|Operación realizada correctamente.|
|201|Calificaciones registradas correctamente.|
|400|Error de validación o regla de negocio.|
|404|Recurso no encontrado.|
|500|Error interno del servidor.|

---

# Integraciones

Actualmente el microservicio utiliza **Mocks** para simular la comunicación con otros microservicios.

Las consultas simuladas corresponden a:

- Evaluaciones
- Inscripciones
- Usuarios

En futuras etapas estos Mocks serán reemplazados por llamadas HTTP a los microservicios correspondientes, sin modificar los endpoints documentados.