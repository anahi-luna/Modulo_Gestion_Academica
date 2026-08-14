// Servicio para manejar la lógica de resultados académicos. 
//  Se encarga de traducir entre lo que devuelve el back y lo que necesita la UI.
import {
    generarResultadosAcademicos as generarResultadosAcademicosApi,
    getListaResultadosAcademicos,
    getMisResultadosAcademicos,
} from "../api/resultadoAcademicoApi";
import { getEstadosAcademicos } from "../api/catalogosApi";

// El back envuelve las listas en { data: [...], total, message }.
// Esta función centraliza el desempaquetado para no repetirlo
// (y no olvidarlo) en cada service que consume una lista.
function desempaquetar(response) {
    return response?.data ?? response ?? [];
}

export async function obtenerEstadosAcademicos() {
    const response = await getEstadosAcademicos();
    const estados = desempaquetar(response);
    return estados.reduce((mapa, estado) => {
        mapa[estado.id_estado_academico] = estado.nombre;
        return mapa;
    }, {});
}

// Coincide con seed/seed_estado_academico.py del back.
function mapearResultado(r, estadosAcademicos) {
    return {
        id: r.id_resultado_academico,
        id_inscripcion: r.id_inscripcion,
        // El back nos devuelve la inscripción anidada (resumen), de ahí
        // saco a qué legajo y a qué comisión pertenece este resultado.
        id_legajo: r.inscripcion?.id_legajo,
        id_comision_asignatura: r.inscripcion?.id_comision_asignatura,
        promedio_final: r.promedio_final,
        porcentaje_asistencia: r.porcentaje_asistencia,
        estado_academico: r.estado?.nombre ?? estadosAcademicos[r.id_estado_academico] ?? "-",
        fecha_resultado: r.fecha_resultado,
    };
}

// Genera en bloque los resultados académicos de todos los alumnos
// aceptados de una comisión ya finalizada (todas sus clases dictadas).
// Si la comisión todavía tiene clases pendientes, o si todos los
// alumnos ya tenían resultado generado, el back devuelve un error
// explicando por qué.
export async function generarResultadosAcademicos(idComision) {
    const [response, estadosAcademicos] = await Promise.all([
        generarResultadosAcademicosApi(idComision),
        obtenerEstadosAcademicos(),
    ]);
    const resultados = desempaquetar(response);
    return resultados.map((r) => mapearResultado(r, estadosAcademicos));
}

// Todos los resultados académicos ya generados para el alumno
// autenticado (los uso en "Mi plan" para saber qué materias están
// finalizadas). El back identifica al alumno por el token, así que
// idLegajo ya no hace falta mandarlo, pero se mantiene el parámetro
// para no romper a quienes llaman a esta función.
export async function obtenerResultadosAcademicos() {
    const [response, estadosAcademicos] = await Promise.all([
        getMisResultadosAcademicos(),
        obtenerEstadosAcademicos(),
    ]);
    const resultados = desempaquetar(response);

    return resultados.map((r) =>
        mapearResultado(r, estadosAcademicos)
    );
}

// Todos los resultados académicos generados hasta ahora (para la
// vista de administración, si hace falta mostrarlos todos juntos)
export async function obtenerTodosLosResultadosAcademicos() {
    const [response, estadosAcademicos] = await Promise.all([
        getListaResultadosAcademicos(),
        obtenerEstadosAcademicos(),
    ]);
    const resultados = desempaquetar(response);
    return resultados.map((r) => mapearResultado(r, estadosAcademicos));
}