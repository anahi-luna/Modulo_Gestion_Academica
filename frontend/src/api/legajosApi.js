// Servicio de Legajos
import API_URL from "./api";

// Obtener un legajo por su número
export async function getLegajoPorNumero(numeroLegajo) {
    const response = await fetch(
        `${API_URL}/legajos/GetPersonaFromLegajoNum?numero=${numeroLegajo}`
    );
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return {
        status: data.status,
        data: {
            id_legajo: data.data.id,
            numero_legajo: data.data.numero,
            nombre: data.data.persona.nombre,
            apellido: data.data.persona.apellido,
            dni: data.data.persona.numero_doc,
            activo: data.data.estado === 1,
        },
        message: data.message,
    };
}

// Obtener un legajo por su ID
export async function getLegajoPorId(idLegajo) {
    const response = await fetch(
        `${API_URL}/legajos/GetPersonaFromLegajoId?id=${idLegajo}`
    );
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return {
        status: data.status,
        data: {
            id_legajo: data.data.id,
            numero_legajo: data.data.numero,
            nombre: data.data.persona.nombre,
            apellido: data.data.persona.apellido,
            dni: data.data.persona.numero_doc,
            activo: data.data.estado === 1,
        },
        message: data.message,
    };
}