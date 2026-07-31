import API_URL from "./api"; //importamos la url de la api general

// Calificaciones de una evaluación puntual (para la planilla del docente)
export async function getCalificacionesPorEvaluacion(idEvaluacion) {
    try{
        const response = await fetch(`${API_URL}/calificaciones/?id_evaluacion=${idEvaluacion}`);
        const data = await response.json();

        if(!response.ok) {
            throw Error("Error al obtener calificaciones")
        }
        return data;
    }catch(error){
        console.error("Error al obtener la calificación")
        throw error
    }
}

// Calificaciones de una inscripción puntual, en todas sus evaluaciones
// (para "Mis calificaciones" del alumno)
export async function getCalificacionesPorInscripcion(idInscripcion) {
    try{
        const response = await fetch(`${API_URL}/calificaciones?id_inscripcion=${idInscripcion}`);
        const data = await response.json();

        if(!response.ok) {
            throw Error("Error al obtener calificaciones")
        }
        return data;
    }catch(error){
        console.error("Error al obtener la calificación")
        throw error
    }
}

// Calificaciones de una inscripción puntual, en todas sus evaluaciones
export async function getCalificacionPorId(id) {
    try{
        const response = await fetch(`${API_URL}/calificaciones/${id}`);
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message)
        }
        return data;
    }catch(error){
        console.error("Error al obtener la calificación", error)
        throw error
    }
}

// Actualiza la nota/observación de una calificación puntual ya creada
export async function actualizarCalificacion(idCalificacion, datos) {

    try {

        const response = await fetch(
            `${API_URL}/calificaciones/${idCalificacion}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;

    } catch (error) {

        console.error("Error al actualizar la calificación", error);
        throw error;

    }

}

// Registra en bloque las calificaciones de una evaluación completa
export async function registrarCalificaciones(datos) {

    try{
        const response = await fetch(
            `${API_URL}/calificaciones/`,
            {
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(datos)
            }
        );

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message)
        }
        return data;
    }catch(error){
        console.error("Error al registrar las calificaciones", error);
        throw error
    }

}

// Elimina una calificación puntual
export async function eliminarCalificacion(idCalificacion) {
    try {
        const response = await fetch(
            `${API_URL}/calificaciones/${idCalificacion}`,
            {
                method: "DELETE",
            }
        );

        
        const data = await response.text();

        if (!response.ok) {
            throw new Error("Error al eliminar la calificación");
        }

        return data;
    } catch (error) {
        console.error("Error al eliminar la calificación", error);

        throw error;
    }
}