# API - Microservicio Gestión Académica

Este documento describe los endpoints disponibles del Microservicio de Gestión Académica.

---

# Convenciones

- URL Base

```text
http://localhost:5000/api
```

- Formato de intercambio de datos

```text
JSON
```

- Codificación

```text
UTF-8
```

---

# Módulo Inscripciones

---

## Obtener todas las inscripciones

### Endpoint

```http
GET /api/inscripciones
```

### Descripción

Obtiene el listado completo de inscripciones registradas.

### Respuesta exitosa

```json
{
    "status": "success",
    "data": [
        {
            "id_inscripcion": 1,
            "id_legajo": 1,
            "id_comision": 1,
            "id_estado": 1,
            "fecha_inscripcion": "2026-06-27T15:30:00",
            "id_usuario_registro": 100,
            "ts_creacion": "2026-06-27T15:30:00",
            "ts_modificacion": null
        }
    ],
    "total": 1,
    "message": "Listado de inscripciones."
}
```

---

## Obtener una inscripción

### Endpoint

```http
GET /api/inscripciones/{id}
```

### Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id | Integer | Identificador de la inscripción |

### Descripción

Obtiene una inscripción específica.

---

## Registrar inscripciones

### Endpoint

```http
POST /api/inscripciones
```

### Descripción

Registra un lote de solicitudes de inscripción enviadas desde otro microservicio.

### Request

```json
{
    "inscripciones": [
        {
            "id_legajo": 1,
            "id_comision": 1
        },
        {
            "id_legajo": 2,
            "id_comision": 1
        }
    ]
}
```

### Respuesta

```json
{
    "status": "success",
    "data": [],
    "total": 2,
    "message": "Solicitud recibida correctamente."
}
```

---

## Actualizar inscripción

### Endpoint

```http
PUT /api/inscripciones/{id}
```

### Descripción

Permite modificar únicamente:

- Estado de la inscripción.
- Comisión asignada.

### Ejemplo Request

```json
{
    "id_estado": 2
}
```

o

```json
{
    "id_comision": 3
}
```

---

## Eliminar inscripción

### Endpoint

```http
DELETE /api/inscripciones/{id}
```

### Descripción

Elimina una inscripción registrada.

---

# Estados de Inscripción

Actualmente el sistema administra los siguientes estados:

| ID | Estado |
|----|---------|
| 1 | Pendiente |
| 2 | Aceptada |
| 3 | Rechazada |
| 4 | Cancelada |
| 5 | Finalizada |

---

# Próximos módulos

Este documento irá incorporando nuevos endpoints a medida que avance el desarrollo del microservicio.

- Asistencias
- Calificaciones
- Certificados
- Archivos Digitales