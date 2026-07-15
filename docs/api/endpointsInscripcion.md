# Módulo Inscripciones

---

# Obtener todas las inscripciones

## Endpoint

```http
GET /api/inscripciones/
```

## Descripción

Obtiene el listado de inscripciones registradas.

También permite aplicar filtros mediante parámetros de consulta.

## Parámetros opcionales

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id_estado | Integer | Filtra por estado de inscripción. |
| id_legajo | Integer | Filtra por legajo. |
| id_comision | Integer | Filtra por comisión. |

### Ejemplos

```http
GET /api/inscripciones/
```

```http
GET /api/inscripciones?id_estado=2
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
    "status": "success",
    "message": "Listado de inscripciones.",
    "total": 2,
    "data": [
        {
            "id_inscripcion": 1,
            "id_legajo": 1,
            "id_comision": 2,
            "id_estado": 2,
            "estado": {
                "id_estado": 2,
                "nombre": "Aceptada"
            },
            "fecha_inscripcion": "2026-07-14T10:25:30",
            "id_usuario_creacion": 100,
            "id_usuario_modificacion": 100,
            "ts_creacion": "2026-07-14T10:25:30",
            "ts_modificacion": "2026-07-14T10:45:11"
        }
    ]
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
    "status": "success",
    "message": "Inscripción encontrada.",
    "data": {
        "id_inscripcion": 1,
        "id_legajo": 1,
        "id_comision": 2,
        "id_estado": 2,
        "estado": {
            "id_estado": 2,
            "nombre": "Aceptada"
        },
        "fecha_inscripcion": "2026-07-14T10:25:30",
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": 100,
        "ts_creacion": "2026-07-14T10:25:30",
        "ts_modificacion": "2026-07-14T10:45:11"
    }
}
```

---

# Registrar una inscripción

## Endpoint

```http
POST /api/inscripciones/
```

## Descripción

Registra una nueva inscripción en una comisión.

Toda inscripción se registra inicialmente con el estado **Pendiente**.

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
    "message": "Inscripción registrada correctamente.",
    "data": {
        "id_inscripcion": 5,
        "id_legajo": 1,
        "id_comision": 2,
        "id_estado": 1,
        "estado": {
            "id_estado": 1,
            "nombre": "Pendiente"
        },
        "fecha_inscripcion": "2026-07-15T11:20:15",
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": null,
        "ts_creacion": "2026-07-15T11:20:15",
        "ts_modificacion": null
    }
}
```

## Validaciones

Antes de registrar una inscripción el sistema verifica que:

- Exista el estado **Pendiente**.
- El legajo exista.
- El legajo se encuentre activo.
- La comisión exista.
- La comisión posea cupo disponible.
- Exista el usuario que realiza la operación.
- El alumno no se encuentre previamente inscripto en la misma comisión.

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

### Cambiar estado

```json
{
    "id_estado": 2
}
```

### Cambiar comisión

```json
{
    "id_comision": 3
}
```

### Cambiar ambos campos

```json
{
    "id_estado": 2,
    "id_comision": 3
}
```

## Reglas de negocio

Durante la actualización el sistema:

- Verifica que el nuevo estado exista.
- Verifica que la nueva comisión exista.
- Verifica que la nueva comisión tenga cupo disponible.
- Registra automáticamente el usuario y la fecha de modificación.
- Cuando una inscripción cambia por primera vez al estado **Aceptada**, se genera automáticamente el **Resultado Plan** correspondiente al alumno.

---

# Eliminar inscripción

## Endpoint

```http
DELETE /api/inscripciones/{id}
```

## Descripción

Elimina una inscripción registrada.

## Reglas de negocio

No será posible eliminar una inscripción cuando:

- Posea asistencias registradas.
- Posea calificaciones registradas.

En estos casos el sistema devolverá un error de validación.

---

# Códigos de respuesta

| Código | Descripción |
|---------|-------------|
|200|Operación realizada correctamente.|
|201|Inscripción creada correctamente.|
|400|Error de validación o regla de negocio.|
|404|Recurso no encontrado.|
|500|Error interno del servidor.|

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

# Integraciones

Actualmente el microservicio utiliza **Mocks** para simular la comunicación con otros microservicios.

Los datos simulados corresponden a:

- Legajos
- Comisiones
- Usuarios
- Planes de Asignatura

Cuando una inscripción cambia al estado **Aceptada**, el sistema actualiza automáticamente el **Resultado Plan** del alumno.

En futuras etapas estos Mocks serán reemplazados por llamadas HTTP a los microservicios correspondientes, sin modificar los endpoints documentados.