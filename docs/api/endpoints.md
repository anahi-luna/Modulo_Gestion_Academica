# API - Microservicio Gestión Académica

Este documento describe los endpoints disponibles del Microservicio de Gestión Académica.

---

# Convenciones

## URL Base

```text
http://localhost:5000/api
```

## Formato de intercambio

```text
JSON
```

## Codificación

```text
UTF-8
```

---

# Módulo Inscripciones

---

# Obtener todas las inscripciones

## Endpoint

```http
GET /api/inscripciones
```

## Descripción

Obtiene el listado de inscripciones registradas.

También permite aplicar filtros mediante parámetros de consulta.

## Parámetros opcionales

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id_estado | Integer | Filtra por estado |
| id_legajo | Integer | Filtra por legajo |
| id_comision | Integer | Filtra por comisión |

### Ejemplos

```http
GET /api/inscripciones
```

```http
GET /api/inscripciones?id_estado=1
```

```http
GET /api/inscripciones?id_legajo=10
```

```http
GET /api/inscripciones?id_comision=3
```

## Respuesta

```json
{
    "data": [
        {
            "estado": {
                "id_estado": 2,
                "nombre": "Aceptada"
            },
            "fecha_inscripcion": "2026-06-27T18:51:57.756703",
            "id_comision": 2,
            "id_estado": 2,
            "id_inscripcion": 1,
            "id_legajo": 1,
            "id_usuario_registro": 100,
            "ts_creacion": "2026-06-27T18:51:57.756703",
            "ts_modificacion": "2026-06-27T18:58:58.686973"
        },
        {
            "estado": {
                "id_estado": 1,
                "nombre": "Pendiente"
            },
            "fecha_inscripcion": "2026-06-27T18:55:25.093686",
            "id_comision": 2,
            "id_estado": 1,
            "id_inscripcion": 2,
            "id_legajo": 2,
            "id_usuario_registro": 100,
            "ts_creacion": "2026-06-27T18:55:25.093686",
            "ts_modificacion": null
        }
    ],
    "message": "Listado de inscripciones.",
    "status": "success",
    "total": 2
}
```

---

# Obtener una inscripción

## Endpoint

```http
GET /api/inscripciones/{id}
```

## Descripción

Obtiene una inscripción según su identificador.

## Respuesta
```json
{
    "data": {
        "estado": {
            "id_estado": 2,
            "nombre": "Aceptada"
        },
        "fecha_inscripcion": "2026-06-27T18:51:57.756703",
        "id_comision": 2,
        "id_estado": 2,
        "id_inscripcion": 1,
        "id_legajo": 1,
        "id_usuario_registro": 100,
        "ts_creacion": "2026-06-27T18:51:57.756703",
        "ts_modificacion": "2026-06-27T18:58:58.686973"
    },
    "message": "Inscripción encontrada.",
    "status": "success"
}
```

---

# Registrar una inscripción

## Endpoint

```http
POST /api/inscripciones
```

## Descripción

Registra una nueva solicitud de inscripción.

El estado inicial siempre será **Pendiente**.

## Request

```json
{
    "id_legajo": 1,
    "id_comision": 2
}
```

## Respuesta exitosa

```json
{
    "status": "success",
    "data": {
        "id_inscripcion": 1,
        "id_legajo": 1,
        "id_comision": 2,
        "id_estado": 1,
        "estado": {
            "id_estado": 1,
            "nombre": "Pendiente"
        },
        "fecha_inscripcion": "2026-06-27T18:55:25",
        "id_usuario_registro": 100,
        "ts_creacion": "2026-06-27T18:55:25",
        "ts_modificacion": null
    },
    "message": "Solicitud de inscripción enviada correctamente"
}
```

---

# Actualizar inscripción

## Endpoint

```http
PUT /api/inscripciones/{id}
```

## Descripción

Permite modificar únicamente:

- Estado de la inscripción.
- Comisión asignada.

## Ejemplo

Cambiar estado

```json
{
    "id_estado": 2
}
```

Cambiar comisión

```json
{
    "id_comision": 3
}
```

También pueden enviarse ambos campos simultáneamente.

---

# Eliminar inscripción

## Endpoint

```http
DELETE /api/inscripciones/{id}
```

## Descripción

Elimina una inscripción registrada.

---

# Códigos de respuesta

| Código | Descripción |
|---------|-------------|
|200|Operación realizada correctamente|
|201|Inscripción creada correctamente|
|400|Error de validación o regla de negocio|
|404|Recurso no encontrado|
|500|Error interno del servidor|

---

# Estados de inscripción

| ID | Estado |
|----|---------|
|1|Pendiente|
|2|Aceptada|
|3|Rechazada|
|4|Cancelada|
|5|Finalizada|

---

# Observaciones

Actualmente el microservicio utiliza **Mocks** para simular la comunicación con otros microservicios.

Los datos simulados corresponden a:

- Legajos
- Comisiones
- Usuarios

En futuras etapas estos Mocks serán reemplazados por llamadas HTTP a los microservicios correspondientes, sin modificar los endpoints documentados.

---

# Próximos módulos

Este documento irá incorporando nuevos endpoints correspondientes a:

- Asistencias
- Calificaciones
- Certificados
- Archivos Digitales