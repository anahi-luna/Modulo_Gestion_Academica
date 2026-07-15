# API REST - Módulo Resultado Académico

---

## Base URL

```text
http://localhost:5000/api/resultados-academicos/
```

---

# Descripción

El módulo de Resultado Académico genera automáticamente el resultado final de los alumnos pertenecientes a una comisión una vez finalizado el cursado.

Durante este proceso el sistema calcula:

- Porcentaje de asistencia.
- Promedio final.
- Estado académico.
- Fecha del resultado.

Además:

- Finaliza automáticamente la inscripción del alumno.
- Actualiza el avance del Resultado Plan.

---

# Obtener todos los resultados académicos

## Endpoint

```http
GET /api/resultados-academicos
```

## Descripción

Obtiene el listado completo de resultados académicos generados.

## Respuesta

```json
{
    "status": "success",
    "message": "Listado de resultados académicos.",
    "total": 2,
    "data": [
        {
            "id_resultado_academico": 1,
            "id_inscripcion": 3,
            "porcentaje_asistencia": 92.5,
            "promedio_final": 87.5,
            "fecha_resultado": "2026-07-15",
            "estado_academico": {
                "id_estado_academico": 1,
                "nombre": "Aprobado"
            },
            "id_usuario_creacion": 100,
            "ts_creacion": "2026-07-15T20:10:18"
        }
    ]
}
```

---

# Obtener un resultado académico

## Endpoint

```http
GET /api/resultados-academicos/{id}
```

## Descripción

Obtiene un resultado académico según su identificador.

## Respuesta

```json
{
    "status": "success",
    "message": "Resultado académico encontrado.",
    "data": {
        "id_resultado_academico": 1,
        "id_inscripcion": 3,
        "porcentaje_asistencia": 92.5,
        "promedio_final": 87.5,
        "fecha_resultado": "2026-07-15",
        "estado_academico": {
            "id_estado_academico": 1,
            "nombre": "Aprobado"
        },
        "id_usuario_creacion": 100,
        "ts_creacion": "2026-07-15T20:10:18"
    }
}
```

---

# Generar resultados académicos

## Endpoint

```http
POST /api/resultados-academicos/
```

## Descripción

Genera automáticamente el resultado académico de todos los alumnos aceptados pertenecientes a una comisión.

Este proceso calcula el porcentaje de asistencia, el promedio final y determina el estado académico correspondiente.

## Request

```json
{
    "id_comision": 5
}
```

## Respuesta

```json
{
    "status": "success",
    "message": "Resultados académicos generados correctamente.",
    "total": 20,
    "data": [
        {
            "id_resultado_academico": 1,
            "id_inscripcion": 3,
            "porcentaje_asistencia": 92.5,
            "promedio_final": 87.5,
            "fecha_resultado": "2026-07-15",
            "estado_academico": {
                "id_estado_academico": 1,
                "nombre": "Aprobado"
            }
        }
    ]
}
```

---

# Validaciones

Antes de generar los resultados académicos el sistema verifica que:

- Exista el usuario que realiza la operación.
- La comisión haya finalizado.
- Existan alumnos con inscripción aceptada.
- La inscripción continúe en estado **Aceptada**.
- El alumno no posea previamente un resultado académico.
- Existan las reglas académicas del Plan de Asignatura.
- Exista la comisión.
- Exista el Plan de Asignatura asociado.

---

# Cálculos realizados

Para cada alumno el sistema calcula automáticamente:

## Porcentaje de asistencia

Se obtiene utilizando únicamente las clases con estado **DICTADA**.

La fórmula aplicada es:

```text
(Presentes / Clases Dictadas) × 100
```

---

## Promedio final

Se calcula utilizando todas las calificaciones registradas para la inscripción.

```text
Suma de puntajes / Cantidad de evaluaciones
```

---

## Estado académico

El estado académico se determina utilizando las reglas configuradas en el Plan de Asignatura.

El sistema puede asignar alguno de los siguientes estados:

| Estado |
|---------|
| Aprobado |
| Regular |
| Libre |
| Desaprobado |

Las reglas consideradas son:

- Porcentaje mínimo de asistencia.
- Promedio mínimo de regularización.
- Promedio mínimo de aprobación.

---

# Procesos automáticos

Una vez generado el resultado académico, el sistema realiza automáticamente las siguientes acciones:

- Cambia la inscripción al estado **Finalizada**.
- Actualiza el Resultado Plan del alumno.
- Registra la fecha de generación del resultado académico.

---

# Eliminar resultado académico

## Endpoint

```http
DELETE /api/resultados-academicos/{id}
```

## Descripción

Elimina un resultado académico.

> **Importante:** Este endpoint se encuentra disponible únicamente para tareas de desarrollo y pruebas.

---

# Códigos de respuesta

| Código | Descripción |
|---------|-------------|
|200|Operación realizada correctamente.|
|201|Resultados académicos generados correctamente.|
|400|Error de validación o regla de negocio.|
|404|Recurso no encontrado.|
|500|Error interno del servidor.|

---

# Integraciones

Actualmente el microservicio utiliza **Mocks** para simular la comunicación con otros microservicios.

Las consultas simuladas corresponden a:

- Comisiones
- Planes de Asignatura
- Usuarios
- Estados Académicos
- Estados de Inscripción

Además, durante la generación del resultado académico el sistema consulta información de:

- Inscripciones
- Asistencias
- Calificaciones
- Clases

Finalmente actualiza automáticamente el módulo **Resultado Plan** para reflejar el avance del alumno dentro de su plan de estudios.