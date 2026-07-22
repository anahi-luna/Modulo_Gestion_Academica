// Ya está conectado a la API real del back. Ojo con algo importante:
// generar un resultado académico NO es una acción por alumno/materia
// individual (como se pensó en un primer momento), sino por COMISIÓN
// completa: se le manda solo el id_comision, y el back calcula sí solo
// (a partir de las asistencias y calificaciones ya cargadas) el
// promedio, el % de asistencia y el estado de CADA alumno aceptado en
// esa comisión, todo de una. Por eso no hay más un formulario para
// tipear a mano promedio/asistencia/estado: eso ahora lo hace el back.
import {
    generarResultadosAcademicos as generarResultadosAcademicosApi,
    getListaResultadosAcademicos,
} from "../api/resultadoAcademicoApi";

// Coincide con seed/seed_estado_academico.py del back.
const ESTADOS_ACADEMICOS = {
    1: "Regular",
    2: "Aprobado",
    3: "Desaprobado",
    4: "Libre",
};

function mapearResultado(r) {
    return {
        id: r.id_resultado_academico,
        id_inscripcion: r.id_inscripcion,
        // El back nos devuelve la inscripción anidada (resumen), de ahí
        // saco a qué legajo y a qué comisión pertenece este resultado.
        id_legajo: r.inscripcion?.id_legajo,
        id_comision: r.inscripcion?.id_comision,
        promedio_final: r.promedio_final,
        porcentaje_asistencia: r.porcentaje_asistencia,
        estado_academico: r.estado?.nombre ?? ESTADOS_ACADEMICOS[r.id_estado_academico] ?? "-",
        fecha_resultado: r.fecha_resultado,
    };
}

// Genera en bloque los resultados académicos de todos los alumnos
// aceptados de una comisión ya finalizada (todas sus clases dictadas).
// Si la comisión todavía tiene clases pendientes, o si todos los
// alumnos ya tenían resultado generado, el back devuelve un error
// explicando por qué.
export async function generarResultadosAcademicos(idComision) {
    const response = await generarResultadosAcademicosApi(idComision);
    return response.data.map(mapearResultado);
}

// Todos los resultados académicos ya generados para UN alumno (los
// uso en "Mi plan" para saber qué materias están finalizadas)
export async function obtenerResultadosAcademicos(idLegajo) {
    const response = await getListaResultadosAcademicos();
    return response.data
        .filter((r) => r.inscripcion?.id_legajo === idLegajo)
        .map(mapearResultado);
}

// Todos los resultados académicos generados hasta ahora (para la
// vista de administración, si hace falta mostrarlos todos juntos)
export async function obtenerTodosLosResultadosAcademicos() {
    const response = await getListaResultadosAcademicos();
    return response.data.map(mapearResultado);
}
