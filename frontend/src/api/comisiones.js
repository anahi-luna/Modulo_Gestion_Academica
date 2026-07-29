
//Obtener comisiones
export async function getComisiones(){
    try{
        //console.log("ID que envío:", idLegajo);
        const response = await fetch(`/api/planes/comisiones-asignaturas/GetDetalleFromLegajoID`);

        const data = await response.json();

        if(!response.ok){
            throw new Error("Error al obtener comisiones")
        }

        return data;
    }catch(error){
        console.error(error)
    }
}

export async function getComisionesPorIdLegajo(idLegajo){
    try{
        //console.log("ID que envío:", idLegajo);
        const response = await fetch(`/api/planes/comisiones-asignaturas/GetDetalleFromLegajoID?id=${idLegajo}`);

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