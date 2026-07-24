# Consumo de API

Este documento explica cómo el frontend consume las APIs REST del backend (microservicio de Gestión Académica), con qué convenciones, y detalla cada endpoint que se está usando actualmente.

## 1. Configuración base

Todas las llamadas parten de una única constante, definida en `src/api/api.js`:

```js
const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

export default API_URL;
```

- En desarrollo, si no se define la variable de entorno `VITE_API_URL`, apunta a `http://localhost:5000` (el backend Flask corriendo local).
- En otros ambientes (staging, producción), se define `VITE_API_URL` en un archivo `.env` (ver el manual de desarrollador) y no hace falta tocar código.

## 2. Convención general de cada función de API

No usamos ninguna librería HTTP, solo `fetch`. Para que todas las llamadas se comporten igual (mismo manejo de errores, mismo formato de retorno), cada función de `src/api/*.js` sigue siempre esta misma forma:

```js
export async function nombreDeLaAccion(parametros) {
    try {
        const response = await fetch(`${API_URL}/recurso`, {
            method: "GET" | "POST" | "PUT" | "DELETE",
            headers: { "Content-Type": "application/json" }, // solo si hay body
            body: JSON.stringify(datos),                      // solo en POST/PUT
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("Error al ...", error);
        throw error;
    }
}
```

**Reglas fijas:**

1. Siempre se parsea la respuesta con `response.json()` **antes** de chequear si hubo error, porque el backend devuelve un cuerpo JSON con el mensaje de error también en las respuestas 4xx/5xx (`{ status: "error", message: "..." }`).
2. `response.ok` es lo que decide si fue exitoso (`fetch` no tira excepción por códigos 4xx/5xx, hay que chequearlo a mano).
3. El error se loguea con `console.error` **y además** se relanza con `throw error`, para que la pantalla que llamó a esta función pueda mostrarle algo al usuario.
4. La respuesta exitosa se devuelve **tal cual** la manda el backend, sin transformarla acá (esa transformación es responsabilidad de la capa `Services/`, no de `api/`).

## 3. Formato de respuesta del backend

Todos los endpoints del microservicio responden con el mismo sobre (envelope):

```json
{
  "status": "success",
  "data": { /* objeto o array, según el endpoint */ },
  "message": "Clase creada correctamente"
}
```

En caso de error:

```json
{
  "status": "error",
  "message": "No existe una clase con ese id"
}
```

## 4. Ejemplo completo: módulo Clases

Tomamos este módulo como ejemplo porque tiene el CRUD completo (Crear, Leer, Actualizar, Eliminar) y es representativo de cómo están armados todos los demás.

### 4.1. Listar clases (con filtro opcional por comisión)

| | |
|---|---|
| **Método** | `GET` |
| **Endpoint** | `/clases/` (todas) o `/clases?id_comision={id}` (filtradas) |
| **Función en el código** | `getListaClases(idComision)` — `src/api/clasesApi.js` |
| **Parámetros** | `idComision` *(opcional)*: si se pasa, filtra las clases de esa comisión |
| **Respuesta (`data`)** | Array de objetos `Clase` |
| **Quién la usa** | `Services/clasesAdminService.js` → `pages/GestionClases.jsx` |

**Ejemplo de llamada:**
```js
import { getListaClases } from "../api/clasesApi";

const respuesta = await getListaClases(3); // clases de la comisión id=3
console.log(respuesta.data); // [{ id_clase: 1, id_comision: 3, fecha: "2026-04-10", ... }, ...]
```

**Implementación real:**
```js
export async function getListaClases(idComision) {
    try {
        const url = idComision
            ? `${API_URL}/clases?id_comision=${idComision}`
            : `${API_URL}/clases/`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("Error al obtener las clases", error);
        throw error;
    }
}
```

### 4.2. Obtener una clase puntual

| | |
|---|---|
| **Método** | `GET` |
| **Endpoint** | `/clases/{id}` |
| **Función** | `getClasePorId(id)` |
| **Parámetros** | `id` *(requerido)*: id de la clase |
| **Respuesta (`data`)** | Objeto `Clase` |

### 4.3. Crear una clase

| | |
|---|---|
| **Método** | `POST` |
| **Endpoint** | `/clases/` |
| **Función** | `crearClase(datos)` |
| **Body esperado** | `{ id_comision, fecha, hora_inicio, hora_fin, tema }` |
| **Respuesta (`data`)** | Objeto `Clase` recién creado, con su `id_clase` |
| **Quién la usa** | Botón **"Nueva Clase"** en `GestionClases.jsx` (visible solo si el usuario tiene el permiso `micro2.clases.crear`) |

**Ejemplo de llamada:**
```js
import { crearClase } from "../api/clasesApi";

await crearClase({
  id_comision: 3,
  fecha: "2026-05-02",
  hora_inicio: "18:00",
  hora_fin: "21:00",
  tema: "Primeros auxilios",
});
```

### 4.4. Editar una clase

| | |
|---|---|
| **Método** | `PUT` |
| **Endpoint** | `/clases/{id}` |
| **Función** | `editarClase(id, datos)` |
| **Body esperado** | Mismos campos que crear |
| **Respuesta (`data`)** | Objeto `Clase` actualizado |

### 4.5. Eliminar una clase

| | |
|---|---|
| **Método** | `DELETE` |
| **Endpoint** | `/clases/{id}` |
| **Función** | `eliminarClase(id)` |
| **Body** | Ninguno |
| **Respuesta** | `{ status: "success", message: "Clase eliminada correctamente" }` |

## 5. Catálogo completo de endpoints consumidos

Esta tabla es el equivalente a lo que en un backend documentarían con Swagger/OpenAPI, pero desde el lado del consumidor: qué usa el front, de cada microservicio, y desde qué archivo.

| Módulo | Método | Endpoint | Archivo `api/` | Uso |
|---|---|---|---|---|
| Inscripciones | GET | `/inscripciones/` | `inscripcionesApi.js` | Listar todas |
| Inscripciones | GET | `/inscripciones?id_comision={id}` | `inscripcionesApi.js` | Listar por comisión |
| Inscripciones | GET | `/inscripciones/{id}` | `inscripcionesApi.js` | Obtener una |
| Inscripciones | POST | `/inscripciones/` | `inscripcionesApi.js` | Crear (alumno se inscribe) |
| Inscripciones | PUT | `/inscripciones/{id}` | `inscripcionesApi.js` | Aceptar / rechazar |
| Inscripciones | DELETE | `/inscripciones/{id}` | `inscripcionesApi.js` | Eliminar |
| Clases | GET | `/clases/` \| `/clases?id_comision={id}` | `clasesApi.js` | Listar |
| Clases | GET | `/clases/{id}` | `clasesApi.js` | Obtener una |
| Clases | POST | `/clases/` | `clasesApi.js` | Crear |
| Clases | PUT | `/clases/{id}` | `clasesApi.js` | Editar |
| Clases | DELETE | `/clases/{id}` | `clasesApi.js` | Eliminar |
| Asistencias | GET | `/asistencias?id_clase={id}` | `asistenciasApi.js` | Planilla de una clase |
| Asistencias | GET | `/asistencias/{id}` | `asistenciasApi.js` | Obtener una |
| Asistencias | POST | `/asistencias/` | `asistenciasApi.js` | Registrar asistencia en bloque |
| Asistencias | PUT | `/asistencias/{id}` | `asistenciasApi.js` | Editar un registro puntual |
| Asistencias | DELETE | `/asistencias/{id}` | `asistenciasApi.js` | Eliminar |
| Evaluaciones | GET | `/evaluaciones/` \| `/evaluaciones?id_comision={id}` | `evaluacionesApi.js` | Listar |
| Evaluaciones | GET | `/evaluaciones/{id}` | `evaluacionesApi.js` | Obtener una |
| Evaluaciones | POST | `/evaluaciones/` | `evaluacionesApi.js` | Crear |
| Evaluaciones | PUT | `/evaluaciones/{id}` | `evaluacionesApi.js` | Editar |
| Evaluaciones | DELETE | `/evaluaciones/{id}` | `evaluacionesApi.js` | Eliminar |
| Calificaciones | GET | `/calificaciones?id_evaluacion={id}` | `calificacionesApi.js` | Planilla de notas de una evaluación |
| Calificaciones | GET | `/calificaciones?id_inscripcion={id}` | `calificacionesApi.js` | Notas de un alumno |
| Calificaciones | POST | `/calificaciones/` | `calificacionesApi.js` | Crear notas nuevas (no pisa existentes) |
| Calificaciones | PUT | `/calificaciones/{id}` | `calificacionesApi.js` | Editar una nota ya cargada |
| Calificaciones | DELETE | `/calificaciones/{id}` | `calificacionesApi.js` | Eliminar |
| Certificados | GET / POST / PUT / DELETE | `/certificados/` \| `/certificados/{id}` | `certificadosApi.js` | Emitir, revocar, listar, descargar |
| Resultado Académico | GET / POST / DELETE | `/resultados-academicos/` \| `/resultados-academicos/{id}` | `resultadoAcademicoApi.js` | Generar y consultar el resultado final de una materia |
| Resultado de Plan | GET / PUT / DELETE | `/resultados-planes/` \| `/resultados-planes/{id}` | `resultadoPlanApi.js` | Consultar avance del plan de estudios del alumno |
| Autenticación / Permisos | GET | `/auth/me?usuario={nombre}` | `authService.js` | Usuario logueado + permisos resueltos |


## 6. Cómo se prueban las llamadas sin tener el backend levantado

Algunos módulos que todavía no tienen endpoint terminado en el backend (o cuyo endpoint devuelve datos incompletos para pruebas) usan datos mockeados en `src/mocks/`, con la misma forma `{ status, data, message }` que devolvería el backend real, y con el mismo nombre de función que tendría en `api/`. Esto permite desarrollar la pantalla completa antes de que el endpoint real exista, y el día que existe, el cambio es literalmente cambiar el `import` de `../mocks/xMock` a `../api/xApi` — nada más en la pantalla se toca, porque la forma de los datos es idéntica.
