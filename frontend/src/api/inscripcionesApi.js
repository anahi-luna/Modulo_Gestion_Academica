import API_URL from "./api"; //importamos la url de la api general

//Obtenemos la lista de inscripciones 
export async function getListaDeInscripciones() {
    try{
        const response = await fetch(`${API_URL}/inscripciones/`); //Guarda la lista en la variable response

        const data = await response.json();

        if(!response.ok){
            throw new Error("Error al obtener la lista de inscripciones")
        }
        return data;
    }catch(error){
        console.error("No se pudo obtener las inscripciones", error)
    }
    
}

//Obtenemos una inscripcion por id
export async function getInscripcionPorId(id) {
    try{
        const response = await fetch(`${API_URL}/inscripciones/${id}`);
        const data = await responde.json();
        if(!response.ok){
            throw new Error("No se pudo obtener la inscripción")
        }
        return data;
    }catch(error){
        console.error("Error al obtener la inscripción", error)
    }
    
}

//Obtenemos la lista de inscripciones por comision
export async function getInscripcionesPorComision(idComision) {
    try{
        const response = await fetch(
            `${API_URL}/inscripciones?id_comision=${idComision}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    }catch(error){
        console.error(error)
    }
    
}

//Se crea una inscripcion por el metodo POST
export async function crearInscripcion(datos) {
    try{
        const response = await fetch(
            `${API_URL}/inscripciones/`, 
            {
                method: "POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(datos) //se envia los datos de creacion {id_legajo, id_comision}
            }
        );

        const data = await response.json();
        if(!response.ok){
            throw new Error("No se generar la inscripción");
        }
        return data;

    }catch(error){
        console.error("Error al crear la inscripción", error)
    }
    
} 

//Se actualiza el estado o comision de una inscripcion por id
export async function actualizarInscripcion(id,datos) {
    try{
        const response = await fetch(
            `${API_URL}/inscripciones/${id}`,
            {
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(datos) //Se envia los datos (id_estado o id_comision) actualizar
            }
        )

        const data = await response.json();

        if(!response.ok){
            throw new Error("No se pudo actualizar la inscripción");
        }
        return data;
    } catch(error){
        console.error("Error al actualizar la inscripción", error);
    }
    
}

//Se elimina una inscripcion por id por el metodo DELETE
export async function eliminarInscripcion(id) {

    try{
        const response = await fetch(
            `${API_URL}/inscripciones/${id}`,
            {
                method:"DELETE"
            }
        )
        const data = await response.json();
         
        if(!response.ok){
            throw new Error("No se pudo eliminar la inscripción");
        }
        return data;
    }catch(error){ 
        console.error("Error al eliminar la inscripción", error);
    }
    
}