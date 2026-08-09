import { getListaResultadosPlan, actualizarEstadoResultadoPlan, getMiResultadoPlan } from "../api/resultadoPlanApi";
import { getEstadosResultadoPlan } from "../api/catalogosApi";
import { getLegajoPorId } from "../api/legajosApi";
import { emitir } from "./certificadosService";
import { obtenerMisCalificaciones } from "./calificacionesAlumnoService";
import { obtenerResultadosAcademicos } from "./resultadoAcademicoService";

// Servicios relacionados con los planes de estudio y el resultado de plan de cada alumno.
// Para el alumno: muestra su propio plan de estudios y materias cursadas.
// Para el personal de gestión: muestra todos los planes de todos los alumnos.

// Obtiene los estados de resultado de plan desde el catálogo real del backend.
async function obtenerEstadosPlan() {
    const response = await getEstadosResultadoPlan();
    return Array.isArray(response)
        ? response
        : response.data ?? [];
}

// Busca un estado por su nombre dentro del catálogo.
function buscarEstadoPorNombre(estados, nombre) {
    return estados.find((estado) => estado.nombre === nombre);
}

// Mapea un resultado de plan del backend al formato utilizado por el frontend.
function mapearResultadoPlan(r, estados = []) {
    const estadoCatalogo = r.estado ?? estados.find((estado) => estado.id_estado_resultado_plan === r.id_estado_resultado_plan);
    const avance = r.materias_totales > 0 ? Math.round((r.materias_finalizadas / r.materias_totales) * 100) : 0;

    return {
        id: r.id_resultado_plan,
        id_legajo: r.id_legajo,
        id_plan: r.id_plan,
        id_estado_resultado_plan: r.id_estado_resultado_plan ?? estadoCatalogo?.id_estado_resultado_plan ?? null,
        materias_totales: r.materias_totales,
        materias_aprobadas: r.materias_aprobadas,
        materias_finalizadas: r.materias_finalizadas,
        estado: estadoCatalogo?.nombre ?? "-",
        fecha_actualizacion: r.fecha_actualizacion,
        avance,
    };
}

// Obtiene el resultado de plan del alumno autenticado.
export async function obtenerMiPlan() {
    const [respuesta, estados] = await Promise.all([getMiResultadoPlan(), obtenerEstadosPlan()]);
    return respuesta.data ? mapearResultadoPlan(respuesta.data, estados) : null;
}

// Obtiene todos los resultados de plan, con nombre y número de legajo.
export async function obtenerTodosLosPlanes() {
    const [respuesta, estados] = await Promise.all([getListaResultadosPlan(), obtenerEstadosPlan()]);

    return Promise.all(
        respuesta.data.map(async (r) => {
            const legajo = (await getLegajoPorId(r.id_legajo)).data;
            return {
                ...mapearResultadoPlan(r, estados),
                numero_legajo: legajo.numero_legajo,
                alumno: `${legajo.nombre} ${legajo.apellido}`,
            };
        })
    );
}

// Marca un resultado de plan como Abandonado.
export async function marcarAbandono(idResultadoPlan) {
    const estados = await obtenerEstadosPlan();
    const estadoAbandonado = buscarEstadoPorNombre(estados, "Abandonado");

    if (!estadoAbandonado) {
        throw new Error("No se encontró el estado 'Abandonado' en el catálogo.");
    }

    const respuesta = await actualizarEstadoResultadoPlan(idResultadoPlan, {
        id_estado_resultado_plan: estadoAbandonado.id_estado_resultado_plan,
    });

    return respuesta.data;
}

// Emite el certificado correspondiente a un resultado de plan ya cerrado (Finalizado o Incompleto).
export async function generarCertificadoDePlan(plan) {
    return emitir(plan.id);
}

// Arma, materia por materia, el detalle que se ve en "Mi plan".
export async function obtenerMisMateriasDePlan() {
    const [materias, resultados] = await Promise.all([obtenerMisCalificaciones(), obtenerResultadosAcademicos()]);

    return materias.map((materia) => {
        const resultado = resultados.find((r) => r.id_comision_asignatura === materia.id_comision_asignatura);

        if (!resultado) {
            // Todavía no se generó el resultado académico: pendiente/cursando.
            return { ...materia, finalizada: false };
        }

        return { ...materia, finalizada: true, resultado };
    });
}