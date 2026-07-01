import API_URL from "./api"; //importamos la url de la api general

//Obtenemos la lista de inscripciones 
export async function getListaDeInscripciones() {
    const response = await fetch(`${API_URL}/inscripciones/`); //Guarda la lista en la variable response
    return await response.json(); 
}

//Obtenemos una inscripcion por id
export async function getInscripcionPorId(id) {
    const responde = await fetch(`${API_URL}/inscripciones/${id}`);
    return await responde.json();
}

//Se crea una inscripcion por el metodo POST
export async function crearInscripcion(datos) {
    const responde = await fetch(
        `${API_URL}/inscripciones/`, 
        {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(datos) //se envia los datos de creacion {id_legajo, id_comision}
        }
    );

    return await responde.json();
} 

//Se actualiza el estado o comision de una inscripcion por id
export async function actualizarInscripcion(id,datos) {

    const responde = await fetch(
        `${API_URL}/inscripciones/${id}`,
        {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(datos) //Se envia los datos (id_estado o id_comision) actualizar
        }
    )
    return await responde.json();
}

//Se elimina una inscripcion por id por el metodo DELETE
export async function eliminarInscripcion(id) {

    const response = await fetch(
         `${API_URL}/inscripciones/${id}`,
         {
            method:"DELETE"
         }
    )
    return await response.json();
}