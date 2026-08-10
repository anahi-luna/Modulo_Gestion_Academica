// Arma "mis clases" del lado del cliente: agarro mis inscripciones,
// y para cada una traigo las clases de esa comisión.
// Armo: 1) la lista agrupada por comisión, y 2) cuál es mi próxima clase.

import { getMisInscripciones } from "../api/inscripcionesApi";
import { getMisClases } from "../api/clasesApi";
import { getComisiones, obtenerDocenteTitular } from "../api/comisiones";

// Mapea una clase cruda del endpoint mis-clases al mismo formato que
// ya usaba el resto de la app (mismos campos que clasesAdminService.getClases).
function mapearClase(clase, comisiones) {
    const comision = comisiones.find(
        (c) => c.id_comision_asignatura === clase.id_comision_asignatura
    );

    return {
        id: clase.id_clase,
        id_comision: clase.id_comision_asignatura,
        id_comision_asignatura: clase.id_comision_asignatura,
        numero_clase: clase.numero_clase,
        codigo: comision?.comision?.descripcion ?? "-",
        materia: comision?.nombre ?? "-",
        docente: obtenerDocenteTitular(comision),
        tema: clase.tema,
        fecha: clase.fecha,
        hora_inicio: clase.hora_inicio,
        hora_fin: clase.hora_fin,
        horario: `${clase.hora_inicio} - ${clase.hora_fin}`,
        estado: clase.estado,
    };
}

export async function obtenerMisClases() {
    let inscripciones = [];

    try {
        inscripciones = await getMisInscripciones();
    } catch (error) {
        console.error("No pude traer inscripciones:", error);
        return { porComision: [], proximaClase: null };
    }

    if (inscripciones.length === 0) {
        return { porComision: [], proximaClase: null };
    }

    const [clasesResponse, comisionesResponse] = await Promise.all([
        getMisClases(),
        getComisiones(),
    ]);

    const clases = clasesResponse.data.map((clase) =>
        mapearClase(clase, comisionesResponse.data)
    );

    const porComision = inscripciones.map((inscripcion) => {
        const propias = clases.filter(
            (clase) => clase.id_comision_asignatura === inscripcion.id_comision_asignatura
        );
        const ordenadas = [...propias].sort(
            (a, b) => new Date(a.fecha) - new Date(b.fecha)
        );
        return {
            id_comision_asignatura: inscripcion.id_comision_asignatura,
            materia: inscripcion.materia,
            comision: inscripcion.comision,
            clases: ordenadas,
        };
    });

    // de todas mis clases en todas mis comisiones, busco la próxima
    const hoy = new Date().toISOString().slice(0, 10);
    const proximaClase = porComision
        .flatMap((c) => c.clases)
        .filter((clase) => clase.fecha >= hoy)
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))[0] ?? null;

    return { porComision, proximaClase };
}

// versión plana para GestionClases cuando entra un alumno
export async function obtenerMisClasesPlano(idLegajo) {
    const { porComision } = await obtenerMisClases(idLegajo);
    return porComision.flatMap((c) => c.clases);
}