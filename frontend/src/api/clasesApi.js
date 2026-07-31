// API para clases
import API_URL from "./api";

// Obtiene la lista de clases, con o sin filtro por comision
export async function getListaClases(idComision) {
    try{   
        const url = idComision //Cambia entre obtener las clases por comision o todas segun lo que se ejecute
            ? `${API_URL}/clases/?id_comision_asignatura=${idComision}`
            :`${API_URL}/clases/`
        
        console.log("URL construida:", url);

       const response = await fetch(url); //Guarda la lista en la variable response

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
// Obtiene una clase por su id
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
// Crea una nueva clase
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

// Actualiza una clase existente
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
// Elimina una clase existente
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