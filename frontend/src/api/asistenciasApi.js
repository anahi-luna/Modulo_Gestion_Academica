import API_URL from "./api"; //importamos la url de la api general

export async function getAsistenciasPorComision(idComision) {
    const response = await fetch(`${API_URL}/asistencias/${idComision}`); //Guarda la lista en la variable response

    if(!response.ok) {
        throw Error("Erorr al obtener asistencias")
    }
    return await response.json(); 
}

export async function actualizarAsistencia(idAsistencia, idEstado) {

    const responde = await fetch(
        `${API_URL}/asistencias/${idAsistencia}`,
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                id_estado: idEstado
            }) //Se envia el dato (id_estado) actualizar
        }
    )
    return await responde.json();
}