# API REST - Módulo Asistencias

---

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

# Obtener todas las asistencias

## Endpoint

```http
GET /api/asistencias/
```

## Descripción

Obtiene el listado de asistencias registradas.

También permite aplicar filtros mediante parámetros de consulta.

## Parámetros opcionales

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id_clase | Integer | Filtra las asistencias de una clase. |
| id_inscripcion | Integer | Filtra las asistencias de una inscripción. |

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

## Respuesta

```json
{
    "status": "success",
    "message": "Listado de asistencias.",
    "total": 3,
    "data": [
        {
            "id_asistencia": 1,
            "id_clase": 1,
            "id_inscripcion": 1,
            "id_estado": 2,
            "estado": {
                "id_estado_asistencia": 2,
                "nombre": "Ausente"
            },
            "clase": {
                "id_clase": 1,
                "estado": "DICTADA"
            },
            "tipo_registro": "MANUAL",
            "observacion": "No llegó",
            "id_usuario_creacion": 100,
            "id_usuario_modificacion": 100,
            "ts_creacion": "2026-07-10T10:36:53",
            "ts_modificacion": "2026-07-10T10:53:16"
        }
    ]
}
```

---

# Obtener una asistencia

## Endpoint

```http
GET /api/asistencias/{id}
```

## Descripción

Obtiene una asistencia según su identificador.

## Respuesta

```json
{
    "status": "success",
    "message": "Asistencia encontrada.",
    "data": {
        "id_asistencia": 1,
        "id_clase": 1,
        "id_inscripcion": 1,
        "id_estado": 2,
        "estado": {
            "id_estado_asistencia": 2,
            "nombre": "Ausente"
        },
        "tipo_registro": "MANUAL",
        "observacion": "No llegó",
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": 100,
        "ts_creacion": "2026-07-10T10:36:53",
        "ts_modificacion": "2026-07-10T10:53:16"
    }
}
```

---

# Registrar asistencias

## Endpoint

```http
POST /api/asistencias/
```

## Descripción

Registra las asistencias correspondientes a una clase.

Todas las asistencias enviadas se registran mediante una única solicitud.

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

## Campos generados automáticamente

- id_asistencia
- tipo_registro (**MANUAL**)
- id_usuario_creacion
- id_usuario_modificacion
- ts_creacion
- ts_modificacion

## Respuesta

```json
{
    "status": "success",
    "message": "Asistencias registradas correctamente.",
    "total": 2,
    "data": [
        {
            "id_asistencia": 2,
            "id_clase": 2,
            "id_inscripcion": 3,
            "id_estado": 1,
            "tipo_registro": "MANUAL",
            "observacion": "Presente",
            "id_usuario_creacion": 100,
            "id_usuario_modificacion": null,
            "ts_creacion": "2026-07-10T10:47:49",
            "ts_modificacion": null
        }
    ]
}
```

## Validaciones

Antes de registrar asistencias el sistema verifica que:

- La clase exista.
- La clase se encuentre en estado **DICTADA**.
- Exista el usuario que realiza la operación.
- La inscripción exista.
- La inscripción pertenezca a la comisión de la clase.
- El estado de asistencia exista.
- No exista previamente una asistencia para esa inscripción y esa clase.

---

# Actualizar asistencia

## Endpoint

```http
PUT /api/asistencias/{id}
```

## Descripción

Permite modificar una asistencia existente.

Los únicos campos modificables son:

- id_estado
- observacion

## Request

```json
{
    "id_estado": 2,
    "observacion": "No llegó"
}
```

## Reglas de negocio

Durante la actualización el sistema:

- Verifica que la asistencia exista.
- Verifica que el usuario exista.
- Verifica que la clase exista.
- Solo permite modificar asistencias de clases con estado **DICTADA**.
- Verifica que el estado de asistencia exista.
- Si no hubo cambios en los datos enviados, no se realiza ninguna actualización en la base de datos.

---

# Eliminar asistencia

## Endpoint

```http
DELETE /api/asistencias/{id}
```

## Descripción

Elimina una asistencia registrada.

> **Importante:** Este endpoint se encuentra disponible únicamente para tareas de desarrollo y pruebas.

---

# Estados de asistencia

| ID | Estado |
|----|---------|
|1|Presente|
|2|Ausente|
|3|Justificado|
|4|Tarde|

---

# Tipo de registro

Actualmente todas las asistencias son registradas mediante:

- **MANUAL**

> En futuras versiones se incorporará el registro mediante código QR.

---

# Códigos de respuesta

| Código | Descripción |
|---------|-------------|
|200|Operación realizada correctamente.|
|201|Asistencia registrada correctamente.|
|400|Error de validación o regla de negocio.|
|404|Recurso no encontrado.|
|500|Error interno del servidor.|

---

# Integraciones

Actualmente el microservicio utiliza **Mocks** para simular la comunicación con otros microservicios.

Las consultas simuladas corresponden a:

- Clases
- Inscripciones
- Usuarios
- Estados de asistencia

En futuras etapas estos Mocks serán reemplazados por llamadas HTTP a los microservicios correspondientes, sin modificar los endpoints documentados.