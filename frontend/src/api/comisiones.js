//Url general
import API_URL from "./api";

//Obtener comisiones
export async function getComisiones(){
    try{
        const response = await fetch(`${API_URL}/comisiones-asignaturas`);

        const data = await response.json();

        if(!response.ok){
            throw new Error("Error al obtener comisiones")
        }

        return data;
    }catch(error){
        console.error(error)
    }
}