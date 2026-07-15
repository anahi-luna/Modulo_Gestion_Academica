# API REST - Módulo Certificados

---

## Base URL

```text
http://localhost:5000/api/certificados
```

---

# Descripción

El módulo Certificados permite emitir certificados académicos una vez finalizado un Plan de Estudios.

Durante la generación el sistema determina automáticamente:

- Tipo de certificado.
- Código único de verificación.
- Estado inicial.
- Fecha de emisión.

Cada certificado queda asociado a un único Resultado Plan.

---

# Obtener todos los certificados

## Endpoint

```http
GET /api/certificados
```

## Descripción

Obtiene el listado completo de certificados emitidos.

## Respuesta

```json
{
    "status": "success",
    "message": "Listado de certificados.",
    "total": 2,
    "data": [
        {
            "id_certificado": 1,
            "id_resultado_plan": 4,
            "tipo_certificado": {
                "id_tipo_certificado": 1,
                "nombre": "Aprobación"
            },
            "codigo_verificacion": "CERT-A4F82B19",
            "fecha_emision": "2026-07-15",
            "fecha_vencimiento": null,
            "url_documento": null,
            "estado": {
                "id_estado_certificado": 1,
                "nombre": "Emitido"
            },
            "id_usuario_creacion": 100,
            "id_usuario_modificacion": null,
            "ts_creacion": "2026-07-15T18:42:33",
            "ts_modificacion": null
        }
    ]
}
```

---

# Obtener un certificado

## Endpoint

```http
GET /api/certificados/{id}
```

## Descripción

Obtiene la información de un certificado mediante su identificador.

## Respuesta

```json
{
    "status": "success",
    "message": "Certificado encontrado.",
    "data": {
        "id_certificado": 1,
        "id_resultado_plan": 4,
        "tipo_certificado": {
            "id_tipo_certificado": 1,
            "nombre": "Aprobación"
        },
        "codigo_verificacion": "CERT-A4F82B19",
        "fecha_emision": "2026-07-15",
        "fecha_vencimiento": null,
        "url_documento": null,
        "estado": {
            "id_estado_certificado": 1,
            "nombre": "Emitido"
        },
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": null,
        "ts_creacion": "2026-07-15T18:42:33",
        "ts_modificacion": null
    }
}
```

---

# Emitir certificado

## Endpoint

```http
POST /api/certificados
```

## Descripción

Genera automáticamente un certificado correspondiente a un Resultado Plan.

El sistema determina el tipo de certificado según el estado final del plan.

## Request

```json
{
    "id_resultado_plan": 4
}
```

## Respuesta

```json
{
    "status": "success",
    "message": "Certificado emitido correctamente.",
    "data": {
        "id_certificado": 1,
        "id_resultado_plan": 4,
        "tipo_certificado": {
            "id_tipo_certificado": 1,
            "nombre": "Aprobación"
        },
        "codigo_verificacion": "CERT-A4F82B19",
        "fecha_emision": "2026-07-15",
        "fecha_vencimiento": null,
        "url_documento": null,
        "estado": {
            "id_estado_certificado": 1,
            "nombre": "Emitido"
        }
    }
}
```

---

# Validaciones

Antes de emitir un certificado el sistema verifica que:

- Exista el usuario que realiza la operación.
- Exista el Resultado Plan.
- El Plan de Estudios haya finalizado.
- El Plan no se encuentre en estado **Abandonado**.
- No exista previamente un certificado para ese Resultado Plan.
- Exista el tipo de certificado correspondiente.
- Exista el estado **Emitido**.

---

# Determinación automática del tipo de certificado

El sistema determina el tipo de certificado utilizando el estado del Resultado Plan.

| Estado del Resultado Plan | Certificado emitido |
|----------------------------|---------------------|
| Finalizado | Aprobación |
| Incompleto | Participación |

---

# Código de verificación

Cada certificado posee un código único generado automáticamente.

Ejemplo:

```text
CERT-A4F82B19
```

Este código puede utilizarse posteriormente para validar la autenticidad del certificado.

---

# Modificar certificado

## Endpoint

```http
PUT /api/certificados/{id}
```

## Descripción

Permite modificar información administrativa del certificado.

## Campos modificables

- id_estado_certificado
- url_documento
- fecha_vencimiento

## Ejemplo

```json
{
    "id_estado_certificado": 2,
    "url_documento": "https://servidor/certificados/certificado-15.pdf",
    "fecha_vencimiento": "2028-12-31"
}
```

## Reglas de negocio

Durante la actualización el sistema:

- Verifica que el certificado exista.
- Verifica que el estado exista.
- Registra automáticamente el usuario y la fecha de modificación.

---

# Eliminar certificado

## Endpoint

```http
DELETE /api/certificados/{id}
```

## Descripción

Elimina un certificado.

> **Importante:** Este endpoint se encuentra disponible únicamente para tareas de desarrollo y pruebas.

---

# Estados del certificado

| ID | Estado |
|----|---------|
|1|Emitido|
|2|Anulado|
|3|Vencido|

---

# Tipos de certificado

| ID | Tipo |
|----|------|
|1|Aprobación|
|2|Participación|

---

# Códigos de respuesta

| Código | Descripción |
|---------|-------------|
|200|Operación realizada correctamente.|
|201|Certificado emitido correctamente.|
|400|Error de validación o regla de negocio.|
|404|Recurso no encontrado.|
|500|Error interno del servidor.|

---

# Integraciones

Actualmente el microservicio utiliza **Mocks** para simular la comunicación con otros microservicios.

Las consultas simuladas corresponden a:

- Usuarios
- Resultado Plan
- Tipos de Certificado
- Estados de Certificado

Además, el módulo utiliza la información del **Resultado Plan** para determinar automáticamente el tipo de certificado que corresponde emitir.

---

# Observaciones

Cada Resultado Plan puede tener **un único certificado**.

El certificado se genera únicamente cuando el Plan de Estudios ha finalizado.

Durante la emisión el sistema genera automáticamente:

- Código único de verificación.
- Tipo de certificado.
- Estado inicial (**Emitido**).
- Fecha de emisión.

La URL del documento y la fecha de vencimiento pueden completarse posteriormente cuando el certificado digital sea generado o publicado.