import API_URL from "./api";

// Lista de evaluaciones. Si se pasa idComision, filtra por esa comisión
// (igual que getListaClases). Sin parámetro, trae todas (usado en
// Gestionar Evaluaciones).
export async function getListaEvaluaciones(idComision) {
    try{

        const url = idComision
            ? `${API_URL}/evaluaciones?id_comision_asignatura=${idComision}`
            : `${API_URL}/evaluaciones/`

        const response = await fetch(url);

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message)
        }

        return data;
    }catch(error){
        console.error("Error al obtener las evaluaciones", error)
        throw error
    }
}

// Evaluaciones de una inscripción puntual, en todas sus evaluaciones
export async function getEvaluacionPorId(id) {
    try{
        const response = await fetch(`${API_URL}/evaluaciones/${id}`);
        const data = await response.json();
        if(!response.ok){
            throw new Error(data.message)
        }
        return data;
    }catch(error){
        console.error("Error al obtener la evaluación", error)
        throw error
    }
}

//crea una nueva evaluación
export async function crearEvaluacion(datos) { 

    try{
        const response = await fetch(
            `${API_URL}/evaluaciones/`,
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
        console.error("Error al crear la evaluación", error);
        throw error
    }

}

//editar una evaluación existente
export async function editarEvaluacion(id, datos) {

    try{
        const response = await fetch(
            `${API_URL}/evaluaciones/${id}`,
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
        console.error("Error al editar la evaluación", error)
        throw error
    }
}

//elimina una evaluación existente
export async function eliminarEvaluacion(id) {

    try{
        const response = await fetch(
            `${API_URL}/evaluaciones/${id}`,
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
        console.error("Error al eliminar la evaluación", error)
        throw error
    }
}
