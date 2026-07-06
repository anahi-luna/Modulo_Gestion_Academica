# API REST - Módulo de Clases

## Base URL

```text
http://localhost:5000/api/clases/
```

---

# 1. Crear una clase

## Endpoint

```http
POST /api/clases/
```

## Descripción

Registra una nueva clase asociada a una comisión.

## Campos que debe enviar el Frontend

| Campo        | Tipo              | Obligatorio | Descripción                                           |
| ------------ | ----------------- | ----------- | ----------------------------------------------------- |
| id_comision  | Integer           | Sí          | Identificador de la comisión.                         |
| numero_clase | Integer           | Sí          | Número correlativo de la clase dentro de la comisión. |
| fecha        | Date (YYYY-MM-DD) | Sí          | Fecha en la que se dictará la clase.                  |
| hora_inicio  | Time (HH:MM)      | Sí          | Hora de inicio de la clase.                           |
| hora_fin     | Time (HH:MM)      | Sí          | Hora de finalización de la clase.                     |
| tema         | String            | Sí          | Tema que se desarrollará durante la clase.            |

## Request

```json
{
    "id_comision": 2,
    "numero_clase": 1,
    "fecha": "2026-07-06",
    "hora_inicio": "18:00:00",
    "hora_fin": "20:00:00",
    "tema": "Introducción bomberos voluntarios"
}
```

## Campos generados automáticamente por el Backend

> **No deben enviarse en el request.**

| Campo                   | Descripción                                      |
| ----------------------- | ------------------------------------------------ |
| id_clase                | Identificador de la clase.                       |
| estado                  | Se inicializa automáticamente como `PROGRAMADA`. |
| id_usuario_creacion     | Usuario que creó el registro.                    |
| id_usuario_modificacion | Inicialmente es `null`.                          |
| ts_creacion             | Fecha y hora de creación.                        |
| ts_modificacion         | Inicialmente es `null`.                          |

## Response (201)

```json
{
    "data": {
        "estado": "PROGRAMADA",
        "fecha": "2026-07-06",
        "hora_fin": "20:00:00",
        "hora_inicio": "18:00:00",
        "id_clase": 2,
        "id_comision": 2,
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": null,
        "numero_clase": 1,
        "tema": "Introducción bomberos voluntarios",
        "ts_creacion": "2026-07-06T09:13:21.252957",
        "ts_modificacion": null
    },
    "message": "Clase creada correctamente.",
    "status": "success"
}
```

---

# 2. Obtener todas las clases

## Endpoint

```http
GET /api/clases/
```

## Descripción

Obtiene el listado de clases.

## Parámetros opcionales

| Parámetro   | Tipo    | Descripción                                             |
| ----------- | ------- | ------------------------------------------------------- |
| id_comision | Integer | Devuelve únicamente las clases de la comisión indicada. |
| estado      | String  | Devuelve únicamente las clases con el estado indicado.  |

### Ejemplos

Obtiene el listado de todas las clases
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

## Response

```json
{
    "data": [
        {
            "estado": "DICTADA",
            "fecha": "2026-07-03",
            "hora_fin": "20:00:00",
            "hora_inicio": "18:00:00",
            "id_clase": 1,
            "id_comision": 1,
            "id_usuario_creacion": 100,
            "id_usuario_modificacion": 100,
            "numero_clase": 1,
            "tema": "Primeros Auxilios",
            "ts_creacion": "2026-07-03T18:29:48.749675",
            "ts_modificacion": "2026-07-03T18:37:03.943357"
        },
        {
            "estado": "PROGRAMADA",
            "fecha": "2026-07-06",
            "hora_fin": "20:00:00",
            "hora_inicio": "18:00:00",
            "id_clase": 2,
            "id_comision": 2,
            "id_usuario_creacion": 100,
            "id_usuario_modificacion": null,
            "numero_clase": 1,
            "tema": "Introducción bomberos voluntarios",
            "ts_creacion": "2026-07-06T09:13:21.252957",
            "ts_modificacion": null
        }
    ],
    "message": "Listado de clases.",
    "status": "success",
    "total": 2
}
```

---

# 3. Obtener una clase

## Endpoint

```http
GET /api/clases/{id_clase}
```

## Descripción

Obtiene la información de una clase a partir de su identificador.

### Ejemplo

```http
GET /api/clases/1
```

## Response

```json
{
    "data": {
        "estado": "DICTADA",
        "fecha": "2026-07-03",
        "hora_fin": "20:00:00",
        "hora_inicio": "18:00:00",
        "id_clase": 1,
        "id_comision": 1,
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": 100,
        "numero_clase": 1,
        "tema": "Primeros Auxilios",
        "ts_creacion": "2026-07-03T18:29:48.749675",
        "ts_modificacion": "2026-07-03T18:37:03.943357"
    },
    "message": "Clase encontrada.",
    "status": "success"
}
```

---

# 4. Modificar una clase

## Endpoint

```http
PUT /api/clases/{id_clase}
```

## Descripción

Permite modificar los datos de una clase existente.

## Campos que pueden actualizarse

| Campo        | Obligatorio | Observaciones                         |
| ------------ | ----------- | ------------------------------------- |
| id_comision  | Sí          | Debe enviarse siempre.                |
| numero_clase | No          | Debe ser único dentro de la comisión. |
| fecha        | No          | Fecha de la clase.                    |
| hora_inicio  | No          | Hora de inicio.                       |
| hora_fin     | No          | Debe ser mayor que `hora_inicio`.     |
| tema         | No          | Tema de la clase.                     |
| estado       | No          | Estado de la clase.                   |

## Request

```json
{
    "id_comision": 1,
    "tema": "Matafuegos I",
    "estado": "PROGRAMADA"
}
```

## Response

```json
{
    "data": {
        "estado": "PROGRAMADA",
        "fecha": "2026-07-03",
        "hora_fin": "20:00:00",
        "hora_inicio": "18:00:00",
        "id_clase": 1,
        "id_comision": 1,
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": 100,
        "numero_clase": 1,
        "tema": "Matafuegos I",
        "ts_creacion": "2026-07-03T18:29:48.749675",
        "ts_modificacion": "2026-07-06T09:16:51.089947"
    },
    "message": "Clase 1 actualizada.",
    "status": "success"
}
```

---

# 5. Eliminar una clase

## Endpoint

```http
DELETE /api/clases/{id_clase}
```

## Descripción

Elimina una clase del sistema.

### Ejemplo

```http
DELETE /api/clases/2
```

## Response

```json
{
    "data": [],
    "message": "Clase 2 eliminada.",
    "status": "success"
}
```

---

# Validaciones del Backend

## Al crear una clase

El backend valida que:

* Exista la comisión indicada.
* Exista el usuario que registra la operación.
* No exista otra clase con el mismo `numero_clase` dentro de la misma comisión.
* La `hora_fin` sea mayor que la `hora_inicio`.
* Todos los campos obligatorios hayan sido enviados.
* El formato de la fecha sea válido.
* El formato de las horas sea válido.

## Al modificar una clase

El backend valida que:

* La clase exista.
* Si se modifica el `numero_clase`, no esté repetido dentro de la misma comisión.
* Si se modifican las horas, `hora_fin` sea mayor que `hora_inicio`.
* El estado enviado corresponda a un valor válido del Enum `EstadoClase`.
* Los datos enviados respeten los tipos definidos por la API.

---

# Posibles estados de una clase

Actualmente una clase puede encontrarse en alguno de los siguientes estados:

| Estado        |
| --------------|
| PROGRAMADA    |
| DICTADA       |
| SUSPENDIDA    |
| REPROGRAMADA  |

---

# Códigos de respuesta

| Código | Significado                             |
| ------ | --------------------------------------- |
| 200    | Operación realizada correctamente.      |
| 201    | Recurso creado correctamente.           |
| 400    | Error de validación o regla de negocio. |
| 404    | Recurso no encontrado.                  |
| 500    | Error interno del servidor.             |
