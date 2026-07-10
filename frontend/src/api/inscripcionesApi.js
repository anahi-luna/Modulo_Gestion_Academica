import API_URL from "./api"; //importamos la url de la api general

// Wrapper de fetch que distingue "el backend no está corriendo / no responde"
// (TypeError: Failed to fetch) de un error normal de la API// Así el mensaje que llega a la vista es entendible para el usuario final
// y no un genérico "Failed to fetch" sin contexto.
async function fetchApi(url, options) {
    try {
        return await fetch(url, options);
    } catch (err) {
        // fetch lanza TypeError cuando no puede conectarse: server caído,
        // puerto equivocado, o bloqueo de CORS.
        throw new Error(
            "No se pudo conectar con el servidor. Verificá que el backend " +
            `esté corriendo en ${API_URL} (cd backend && python app.py).`
        );
    }
}

//Obtenemos la lista de inscripciones 
export async function getListaDeInscripciones() {
    const response = await fetchApi(`${API_URL}/inscripciones/`); //Guarda la lista en la variable response
    return await response.json(); 
}

//Obtenemos una inscripcion por id
export async function getInscripcionPorId(id) {
    const responde = await fetchApi(`${API_URL}/inscripciones/${id}`);
    return await responde.json();
}

//Se crea una inscripcion por el metodo POST
export async function crearInscripcion(datos) {
    const responde = await fetchApi(
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

    const responde = await fetchApi(
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

    const response = await fetchApi(
         `${API_URL}/inscripciones/${id}`,
         {
            method:"DELETE"
         }
    )
    return await response.json();
}