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

export function obtenerDocenteTitular(comisionAsignatura) {
    const autoridades = comisionAsignatura?.autoridades ?? [];

    if (autoridades.length === 0) return "-";

    const titular = autoridades.find(a =>
        a.tipo_autoridad?.descripcion?.toLowerCase().includes("titular")
    );

    const elegido = titular ?? autoridades[0];

    const persona = elegido?.legajo?.persona;

    if (!persona) return "-";

    return `${persona.nombre} ${persona.apellido}`.trim() || "-";
}