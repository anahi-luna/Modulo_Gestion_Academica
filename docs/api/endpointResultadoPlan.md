# API REST - Módulo Resultado Plan

---

## Base URL

```text
http://localhost:5000/api/resultados-planes/
```

---

# Descripción

El módulo Resultado Plan permite realizar el seguimiento del avance académico de un alumno dentro de un Plan de Estudios.

Cada registro almacena automáticamente:

- Cantidad total de materias del plan.
- Cantidad de materias aprobadas.
- Cantidad de materias finalizadas.
- Estado general del plan.
- Fecha de la última actualización.

> **Importante:** El Resultado Plan se crea y actualiza automáticamente durante el ciclo académico. No es necesario que el Frontend lo genere manualmente.

---

# Obtener todos los resultados de planes

## Endpoint

```http
GET /api/resultados-plan
```

## Descripción

Obtiene el listado de resultados de planes registrados.

## Respuesta

```json
{
    "status": "success",
    "message": "Listado de resultados de planes.",
    "total": 2,
    "data": [
        {
            "id_resultado_plan": 1,
            "id_legajo": 15,
            "id_plan": 2,
            "materias_totales": 12,
            "materias_aprobadas": 5,
            "materias_finalizadas": 6,
            "estado": {
                "id_estado_resultado_plan": 1,
                "nombre": "En curso"
            },
            "fecha_actualizacion": "2026-07-15",
            "id_usuario_creacion": 100,
            "id_usuario_modificacion": null,
            "ts_creacion": "2026-07-15T19:45:30",
            "ts_modificacion": null
        }
    ]
}
```

---

# Obtener un resultado de plan

## Endpoint

```http
GET /api/resultados-plan/{id}
```

## Descripción

Obtiene un resultado de plan mediante su identificador.

## Respuesta

```json
{
    "status": "success",
    "message": "Resultado del plan encontrado.",
    "data": {
        "id_resultado_plan": 1,
        "id_legajo": 15,
        "id_plan": 2,
        "materias_totales": 12,
        "materias_aprobadas": 5,
        "materias_finalizadas": 6,
        "estado": {
            "id_estado_resultado_plan": 1,
            "nombre": "En curso"
        },
        "fecha_actualizacion": "2026-07-15",
        "id_usuario_creacion": 100,
        "id_usuario_modificacion": null,
        "ts_creacion": "2026-07-15T19:45:30",
        "ts_modificacion": null
    }
}
```

---

# Actualización automática del Resultado Plan

## Descripción

El Resultado Plan se genera o actualiza automáticamente cuando ocurren alguno de los siguientes eventos:

- Una inscripción cambia al estado **Aceptada**.
- Se genera un Resultado Académico.
- Finaliza una materia del plan.

Durante la actualización el sistema recalcula automáticamente:

- Materias totales del plan.
- Materias aprobadas.
- Materias finalizadas.
- Estado general del plan.
- Fecha de actualización.

El Frontend no necesita invocar este proceso.

---

# Modificar estado del Resultado Plan

## Endpoint

```http
PUT /api/resultados-plan/{id}
```

## Descripción

Permite modificar únicamente el estado del Resultado Plan.

## Request

```json
{
    "id_estado_resultado_plan": 4
}
```

## Reglas de negocio

Durante la actualización el sistema:

- Verifica que exista el Resultado Plan.
- Verifica que exista el usuario.
- Verifica que el estado exista.
- Registra automáticamente el usuario y la fecha de modificación.

### Caso especial

Si el nuevo estado corresponde a **Abandonado**, el sistema cancela automáticamente todas las inscripciones pertenecientes a ese Plan de Estudios.

---

# Estados del Resultado Plan

| ID | Estado |
|----|---------|
|1|En curso|
|2|Finalizado|
|3|Incompleto|
|4|Abandonado|

---

# Cálculos realizados automáticamente

## Materias Totales

Cantidad de asignaturas que componen el Plan de Estudios.

---

## Materias Finalizadas

Cantidad de materias para las cuales el alumno ya posee un Resultado Académico.

---

## Materias Aprobadas

Cantidad de materias cuyo Resultado Académico posee estado **Aprobado**.

---

## Estado del Plan

El sistema determina automáticamente el estado del plan utilizando las siguientes reglas:

| Condición | Estado |
|-----------|--------|
| Aún existen materias pendientes | En curso |
| Todas las materias fueron aprobadas | Finalizado |
| Finalizaron todas las materias pero existen desaprobadas | Incompleto |

---

# Eliminar Resultado Plan

## Endpoint

```http
DELETE /api/resultados-plan/{id}
```

## Descripción

Elimina un Resultado Plan.

> **Importante:** Este endpoint se encuentra disponible únicamente para tareas de desarrollo y pruebas.

---

# Códigos de respuesta

| Código | Descripción |
|---------|-------------|
|200|Operación realizada correctamente.|
|201|Resultado Plan generado correctamente.|
|400|Error de validación o regla de negocio.|
|404|Recurso no encontrado.|
|500|Error interno del servidor.|

---

# Integraciones

Actualmente el microservicio utiliza **Mocks** para simular la comunicación con otros microservicios.

Las consultas simuladas corresponden a:

- Legajos
- Planes de Estudio
- Planes de Asignatura
- Comisiones
- Usuarios
- Estados del Resultado Plan
- Estados de Inscripción

Además, el módulo consulta información de:

- Inscripciones
- Resultados Académicos

para recalcular automáticamente el avance del alumno dentro del Plan de Estudios.

---

# Observaciones

El Resultado Plan representa el avance global del alumno dentro de un Plan de Estudios.

Este módulo no requiere que el usuario cargue manualmente las materias aprobadas o finalizadas, ya que toda la información se obtiene automáticamente a partir de las Inscripciones y los Resultados Académicos generados por el sistema.