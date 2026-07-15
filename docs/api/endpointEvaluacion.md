# API REST - Módulo Evaluaciones

---

## Base URL

```text
http://localhost:5000/api/evaluaciones/
```

---

# Obtener todas las evaluaciones

## Endpoint

```http
GET /api/evaluaciones
```

## Descripción

Obtiene el listado de evaluaciones registradas.

También permite aplicar filtros mediante parámetros de consulta.

## Parámetros opcionales

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id_comision | Integer | Filtra por comisión. |
| id_tipo_evaluacion | Integer | Filtra por tipo de evaluación. |

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

## Respuesta

```json
{
    "status": "success",
    "message": "Listado de evaluaciones.",
    "total": 1,
    "data": [
        {
            "id_evaluacion": 1,
            "id_comision": 1,
            "id_tipo_evaluacion": 1,
            "tipo_evaluacion": {
                "id_tipo_evaluacion": 1,
                "nombre": "Parcial"
            },
            "titulo": "Primer Parcial",
            "fecha_evaluacion": "2026-07-15",
            "puntaje_maximo": 100,
            "id_evaluacion_origen": null,
            "id_usuario_creacion": 100,
            "id_usuario_modificacion": null,
            "ts_creacion": "2026-07-11T18:39:47.717011",
            "ts_modificacion": null
        }
    ]
}
```

---

# Obtener una evaluación

## Endpoint

```http
GET /api/evaluaciones/{id}
```

## Descripción

Obtiene una evaluación según su identificador.

## Respuesta

```json
{
    "status": "success",
    "message": "Evaluación encontrada.",
    "data": {
        "id_evaluacion": 1,
        "id_comision": 1,
        "id_tipo_evaluacion": 1,
        "tipo_evaluacion": {
            "id_tipo_evaluacion": 1,
            "nombre": "Parcial"
        },
        "titulo": "Primer Parcial",
        "fecha_evaluacion": "2026-07-15",
        "puntaje_maximo": 100,
        "id_evaluacion_origen": null,
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": null,
        "ts_creacion": "2026-07-11T18:39:47.717011",
        "ts_modificacion": null
    }
}
```

---

# Registrar una evaluación

## Endpoint

```http
POST /api/evaluaciones/
```

## Descripción

Registra una nueva evaluación asociada a una comisión.

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

## Campos generados automáticamente

- id_evaluacion
- id_usuario_creacion
- id_usuario_modificacion
- ts_creacion
- ts_modificacion

## Respuesta

```json
{
    "status": "success",
    "message": "Evaluación creada correctamente.",
    "data": {
        "id_evaluacion": 1,
        "id_comision": 1,
        "id_tipo_evaluacion": 1,
        "titulo": "Primer Parcial",
        "fecha_evaluacion": "2026-07-15",
        "puntaje_maximo": 100,
        "id_evaluacion_origen": null,
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": null,
        "ts_creacion": "2026-07-11T18:39:47.717011",
        "ts_modificacion": null
    }
}
```

## Validaciones

Antes de registrar una evaluación el sistema verifica que:

- La comisión exista.
- El tipo de evaluación exista.
- El usuario exista.
- El puntaje máximo sea mayor que cero.
- Si se envía una evaluación origen, esta exista.

---

# Actualizar evaluación

## Endpoint

```http
PUT /api/evaluaciones/{id}
```

## Descripción

Permite modificar una evaluación existente.

Los siguientes campos pueden actualizarse:

- id_comision
- id_tipo_evaluacion
- titulo
- fecha_evaluacion
- puntaje_maximo
- id_evaluacion_origen

## Ejemplo

```json
{
    "id_tipo_evaluacion": 2,
    "titulo": "Recuperatorio Primer Parcial",
    "fecha_evaluacion": "2026-07-18",
    "puntaje_maximo": 100,
    "id_evaluacion_origen": 1
}
```

## Reglas de negocio

Durante la actualización el sistema:

- Verifica que la evaluación exista.
- Verifica que el usuario exista.
- Verifica que la comisión exista.
- Verifica que el tipo de evaluación exista.
- Verifica que el puntaje máximo sea mayor que cero.
- Si se envía una evaluación origen, ésta debe existir.
- Una evaluación no puede ser origen de sí misma.
- Si los datos enviados no producen cambios, no se realiza ninguna actualización en la base de datos.

---

# Eliminar evaluación

## Endpoint

```http
DELETE /api/evaluaciones/{id}
```

## Descripción

Elimina una evaluación registrada.

## Reglas de negocio

No será posible eliminar una evaluación cuando posea calificaciones registradas.

En ese caso el sistema devolverá un error de validación.

---

# Tipos de evaluación

| ID | Tipo |
|----|------|
|1|Parcial|
|2|Recuperatorio|
|3|Final|
|4|Trabajo Práctico|

---

# Códigos de respuesta

| Código | Descripción |
|---------|-------------|
|200|Operación realizada correctamente.|
|201|Evaluación creada correctamente.|
|400|Error de validación o regla de negocio.|
|404|Recurso no encontrado.|
|500|Error interno del servidor.|

---

# Integraciones

Actualmente el microservicio utiliza **Mocks** para simular la comunicación con otros microservicios.

Las consultas simuladas corresponden a:

- Comisiones
- Usuarios
- Tipos de evaluación

En futuras etapas estos Mocks serán reemplazados por llamadas HTTP a los microservicios correspondientes, sin modificar los endpoints documentados.