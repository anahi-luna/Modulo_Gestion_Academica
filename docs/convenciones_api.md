# Convenciones de la API REST

> **Estado:** Documento en elaboración.
>
> Este documento será definido en conjunto por los equipos responsables de los tres microservicios, con el objetivo de unificar criterios y mantener una interfaz consistente entre todos los servicios del sistema.

---

# Objetivo

Establecer un conjunto de convenciones comunes para el desarrollo de las APIs REST del proyecto, de manera que todos los microservicios compartan el mismo estándar de comunicación.

---

# Temas a definir

## 1. Formato estándar de respuestas JSON

Se acordará una estructura común para todas las respuestas exitosas y de error.

Ejemplo:

```json
{
    "status": "success",
    "data": [],
    "total": 0,
    "message": ""
}
```

Y para respuestas de error:

```json
{
    "status": "error",
    "message": "",
    "errors": {}
}
```

---

## 2. Códigos HTTP

Definir los códigos HTTP que utilizarán todos los microservicios.

Propuesta inicial:

| Código | Descripción |
|---------|-------------|
| 200 | OK |
| 201 | Recurso creado |
| 400 | Solicitud inválida |
| 401 | No autorizado |
| 403 | Acceso prohibido |
| 404 | Recurso no encontrado |
| 409 | Conflicto |
| 500 | Error interno del servidor |

---

## 3. Convención de nombres

Definir una convención única para los nombres utilizados en las APIs.

Propuesta inicial:

- Utilizar **snake_case** para nombres de atributos JSON.
- Mantener nombres consistentes entre modelos, schemas y respuestas.

Ejemplo:

```json
{
    "id_inscripcion": 1,
    "fecha_inscripcion": "2026-06-27T15:30:00"
}
```

---

## 4. Formato de fechas

Definir un formato único para representar fechas y horas.

Propuesta inicial:

- ISO 8601

Ejemplo:

```text
YYYY-MM-DDTHH:MM:SS
```

Ejemplo:

```text
2026-06-27T15:30:00
```

---

## 5. Campos estándar de las respuestas

Definir los campos obligatorios que deberán incluir todas las respuestas de la API.

Propuesta inicial:

- `status`
- `data`
- `total` (cuando corresponda)
- `message`
- `errors` (solo en respuestas de error)

---

# Pendientes

Este documento deberá revisarse y aprobarse en conjunto con los equipos responsables de los demás microservicios antes de iniciar la integración entre servicios.

Una vez aprobado, estas convenciones serán de cumplimiento obligatorio para todos los microservicios del proyecto.