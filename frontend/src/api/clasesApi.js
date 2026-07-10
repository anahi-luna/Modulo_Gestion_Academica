import API_URL from "./api";

export async function getListaClases() {
    try{   
        const response = await fetch(`${API_URL}/clases/`); //Guarda la lista en la variable response
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message)
        }
        return data; 
    }catch(error){
        console.error("Error al obtener las clases", error)
        throw error
    }
}

export async function getClasePorId(id) {
    try{
        const response = await fetch(`${API_URL}/clases/${id}`);
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

export async function crearClase(datos) {

    try{
        const response = await fetch(
            `${API_URL}/clases/`, 
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

export async function editarClase(id,datos) {

    try{
        const response = await fetch(
            `${API_URL}/clases/${id}`,
            {
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(datos) 
            }
        )

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message)
        }
        return data;

    }catch(error){
        console.error("Error al editar la clase", error)
        throw error
    }
}

export async function eliminarClase(id) {

    try{
        const response = await fetch(
            `${API_URL}/clases/${id}`,
            {
                method:"DELETE"
            }
        )

        const data = await response.json();

        if (!response.ok){
            throw new Error(data.message)
        }
        return data;
    }catch(error){
        console.error("Error al eliminar la clase", error)
        throw error
    }
}