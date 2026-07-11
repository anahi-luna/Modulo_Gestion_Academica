import API_URL from "./api"; //importamos la url de la api general

export async function getAsistenciaPorClase(idClase) {
    try{
        const response = await fetch(`${API_URL}/asistencias?id_clase=${idClase}`); //Guarda la lista en la variable response
        const data = await response.json();

        if(!response.ok) {
            throw Error("Error al obtener asistencias")
        }
        return data;
    }catch(error){
        console.error("Error al obtener la asistencia")
        throw error
    }
}

export async function getAsistenciaPorId(id) {
    try{
        const response = await fetch(`${API_URL}/asistencias/${id}`);
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message)
        }
        return data;
    }catch(error){
        console.error("Error al obtener la clase", error)
        throw error
    }
}


export async function actualizarAsistencia(idAsistencia, idEstado) {

    try {

        const response = await fetch(
            `${API_URL}/asistencias/${idAsistencia}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id_estado: idEstado
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;

    } catch (error) {

        console.error("Error al actualizar la asistencia", error);
        throw error;

    }

}


export async function registrarAsistencia(datos) {

    try{
        const response = await fetch(
            `${API_URL}/asistencias/`, 
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
        console.error("Error al crear la clase", error);
        throw error
    }
    
} 