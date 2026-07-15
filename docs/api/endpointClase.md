# API REST - Módulo Clases

---

# Obtener todas las clases

## Endpoint

```http
GET /api/clases/
```

## Descripción

Obtiene el listado de clases registradas.

También permite aplicar filtros mediante parámetros de consulta.

## Parámetros opcionales

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| id_comision | Integer | Filtra las clases de una comisión. |
| estado | String | Filtra por estado de la clase. |

### Ejemplos

```http
GET /api/clases/
```

```http
GET /api/clases?id_comision=2
```

```http
GET /api/clases?estado=PROGRAMADA
```

```http
GET /api/clases?id_comision=2&estado=PROGRAMADA
```

## Respuesta

```json
{
    "status": "success",
    "message": "Listado de clases.",
    "total": 2,
    "data": [
        {
            "id_clase": 1,
            "id_comision": 1,
            "numero_clase": 1,
            "fecha": "2026-07-03",
            "hora_inicio": "18:00:00",
            "hora_fin": "20:00:00",
            "tema": "Primeros Auxilios",
            "estado": "DICTADA",
            "id_usuario_creacion": 100,
            "id_usuario_modificacion": 100,
            "ts_creacion": "2026-07-03T18:29:48.749675",
            "ts_modificacion": "2026-07-03T18:37:03.943357"
        }
    ]
}
```

---

# Obtener una clase

## Endpoint

```http
GET /api/clases/{id}
```

## Descripción

Obtiene una clase según su identificador.

## Respuesta

```json
{
    "status": "success",
    "message": "Clase encontrada.",
    "data": {
        "id_clase": 1,
        "id_comision": 1,
        "numero_clase": 1,
        "fecha": "2026-07-03",
        "hora_inicio": "18:00:00",
        "hora_fin": "20:00:00",
        "tema": "Primeros Auxilios",
        "estado": "DICTADA",
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": 100,
        "ts_creacion": "2026-07-03T18:29:48.749675",
        "ts_modificacion": "2026-07-03T18:37:03.943357"
    }
}
```

---

# Registrar una clase

## Endpoint

```http
POST /api/clases/
```

## Descripción

Registra una nueva clase asociada a una comisión.

Toda clase nueva se registra automáticamente con el estado **PROGRAMADA**.

## Request

```json
{
    "id_comision": 2,
    "numero_clase": 1,
    "fecha": "2026-07-06",
    "hora_inicio": "18:00:00",
    "hora_fin": "20:00:00",
    "tema": "Introducción a Bomberos Voluntarios"
}
```

## Respuesta exitosa

```json
{
    "status": "success",
    "message": "Clase creada correctamente.",
    "data": {
        "id_clase": 2,
        "id_comision": 2,
        "numero_clase": 1,
        "fecha": "2026-07-06",
        "hora_inicio": "18:00:00",
        "hora_fin": "20:00:00",
        "tema": "Introducción a Bomberos Voluntarios",
        "estado": "PROGRAMADA",
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": null,
        "ts_creacion": "2026-07-06T09:13:21.252957",
        "ts_modificacion": null
    }
}
```

## Validaciones

Antes de registrar una clase el sistema verifica que:

- La comisión exista.
- El número de clase no se encuentre repetido dentro de la misma comisión.
- La hora de finalización sea mayor que la hora de inicio.
- Exista el usuario que realiza la operación.

---

# Actualizar clase

## Endpoint

```http
PUT /api/clases/{id}
```

## Descripción

Permite modificar una clase existente.

Pueden actualizarse los siguientes campos:

- numero_clase
- fecha
- hora_inicio
- hora_fin
- tema
- estado

## Ejemplo

```json
{
    "tema": "Matafuegos I",
    "estado": "PROGRAMADA"
}
```

## También puede modificarse el número de clase

```json
{
    "numero_clase": 2
}
```

## Reglas de negocio

Durante la actualización el sistema:

- Verifica que la clase exista.
- Valida que el nuevo número de clase no se encuentre repetido dentro de la misma comisión.
- Verifica que la hora de finalización sea mayor que la hora de inicio.
- Actualiza automáticamente el usuario y la fecha de modificación.

---

# Eliminar clase

## Endpoint

```http
DELETE /api/clases/{id}
```

## Descripción

Elimina una clase registrada.

## Reglas de negocio

No será posible eliminar una clase cuando posea asistencias registradas.

En ese caso el sistema devolverá un error de validación.

---

# Estados de clase

| Estado |
|---------|
| PROGRAMADA |
| DICTADA |
| SUSPENDIDA |
| REPROGRAMADA |

---

# Códigos de respuesta

| Código | Descripción |
|---------|-------------|
|200|Operación realizada correctamente.|
|201|Clase creada correctamente.|
|400|Error de validación o regla de negocio.|
|404|Recurso no encontrado.|
|500|Error interno del servidor.|

---

# Integraciones

Actualmente el microservicio utiliza **Mocks** para simular la comunicación con otros microservicios.

Las consultas simuladas corresponden a:

- Comisiones
- Usuarios

En futuras etapas estos Mocks serán reemplazados por llamadas HTTP a los microservicios correspondientes, sin modificar los endpoints documentados.