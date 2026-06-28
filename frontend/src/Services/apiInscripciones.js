import API_URL from "./api";

//Inscripciones Usuario
//==========================================

// Historial de un legajo para ambos usuarios (USER) (ADMIN)
export async function getInscripcionesPorLegajo(idLegajo) {
  const response = await fetch(
    `${API_URL}/inscripciones/?id_legajo=${idLegajo}`
  );

  if (!response.ok) {
    throw new Error("Error al obtener las inscripciones");
  }

  return await response.json();
}

//Registrar una inscripcion

export async function postInscripcion(idLegajo, idComision) {
    const response = await fetch (`${API_URL}/inscripciones`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_legajo: idLegajo,
            id_comision: idComision,
        }),

    });

    if (!response.ok) {
        throw new Error("No se pudo registrar la inscripcion")
    }
    return await response.json();
}


// Inscripciones ADMIN
//======================================================

//Obtener todas las inscripciones

export async function getInscripciones() {
    const response = await fetch(`${API_URL}/inscripciones/`);

    if (!response.ok) {
        throw new Error("Error al obtener las inscripciones");
    }

    return await response.json();
}

// Obtener una inscripcion

export async function getInscripcion(id) {

    const response = await fetch(`${API_URL}/inscripciones/${id}/`);

    if (!response.ok){
        throw new Error("Inscripcion no encontrada")
    }

    return await response.json();
    
}


//Filtrar por estado

export async function getInscripcionesPorEstado(idEstado) {
    const response = await fetch(`${API_URL}/inscripciones/?id_estado=${idEstado}`);

    if (!response.ok){
        throw new Error("Error al obtener las inscripciones")
    }

    return await response.json();

}

//Filtrar por comision

export async function getInscripcionesPorComision(isComision) {
    const response = await fetch(`${API_URL}/inscripciones/?id_comision=${isComision}`);

    if (!response.ok){
        throw new Error("Error al obtener las inscripciones")
    }

    return await response.json();


}


//Aceptar Inscripcion

export async function aceptarInscripcion(id) {
    const response = await fetch(`${API_URL}/inscripciones/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_estado: 2,
        })
    });
    
    if (!response.ok){
        throw new Error("No se pudo aprobar la inscripcion")
    }

    return await response.json();
}

//Rechazar Inscripcion

export async function rechazarInscripcion(id) {
    const response = await fetch(`${API_URL}/inscripciones/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_estado: 3,
        })
    });
    
    if (!response.ok){
        throw new Error("No se pudo rechazar la inscripcion")
    }

    return await response.json();
}

//Cambiar comision

export async function cambiarComision(id, id_comision) {
    const response = await fetch(`${API_URL}/inscripciones/${id}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id_comision
        })
    });
    
    if (!response.ok){
        throw new Error("No se pudo cambiar la comision")
    }

    return await response.json();
}


//Eliminar inscripcion
export async function eliminarInscripcion(id) {
    const response = await fetch(`${API_URL}/inscripciones/${id}/`, {
        method: "DELETE",
    });
    
    if (!response.ok){
        throw new Error("No se pudo eliminar la inscripcion")
    }

    return await response.json();
}