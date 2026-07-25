// servicios relacionados con los planes de estudio y el resultado de plan de cada alumno 
//  para el alumno, muestra su propio plan de estudios y materias cursadas; para el personal de gestión,
//  muestra todos los planes de todos los alumnos.
import { getListaResultadosPlan, actualizarEstadoResultadoPlan } from "../api/resultadoPlanApi";
import { getLegajoPorId } from "../mocks/legajosMock";
import { emitir } from "./certificadosService";
import { obtenerMisCalificaciones } from "./calificacionesAlumnoService";
import { obtenerResultadosAcademicos } from "./resultadoAcademicoService";

// Coincide con seed/seed_estado_resultado_plan.py del back.
const ESTADOS_RESULTADO_PLAN = {
    1: "En curso",
    2: "Finalizado",
    3: "Incompleto",
    4: "Abandonado",
};

const ID_ESTADO_ABANDONADO = 4;

function mapearResultadoPlan(r) {
    const avance =
        r.materias_totales > 0
            ? Math.round((r.materias_finalizadas / r.materias_totales) * 100)
            : 0;

    return {
        id: r.id_resultado_plan,
        id_legajo: r.id_legajo,
        id_plan: r.id_plan,
        materias_totales: r.materias_totales,
        materias_aprobadas: r.materias_aprobadas,
        materias_finalizadas: r.materias_finalizadas,
        estado: r.estado?.nombre ?? ESTADOS_RESULTADO_PLAN[r.id_estado_resultado_plan] ?? "-",
        fecha_actualizacion: r.fecha_actualizacion,
        avance,
    };
}

export async function obtenerMiPlan(idLegajo) {
    const respuesta = await getListaResultadosPlan();
    const plan = respuesta.data.find((r) => r.id_legajo === idLegajo);
    return plan ? mapearResultadoPlan(plan) : null;
}

// Todos los resultados de plan, con nombre y número de legajo ya
// resueltos (para "Resultado del plan", vista de gestión)
export async function obtenerTodosLosPlanes() {
    const respuesta = await getListaResultadosPlan();

    return Promise.all(
        respuesta.data.map(async (r) => {
            const legajo = (await getLegajoPorId(r.id_legajo)).data;
            return {
                ...mapearResultadoPlan(r),
                numero_legajo: legajo.numero_legajo,
                alumno: `${legajo.nombre} ${legajo.apellido}`,
            };
        })
    );
}

// Marca un resultado de plan como Abandonado. idResultadoPlan es el
// id_resultado_plan real (plan.id en el objeto ya mapeado).
export async function marcarAbandono(idResultadoPlan) {
    const respuesta = await actualizarEstadoResultadoPlan(idResultadoPlan, {
        id_estado_resultado_plan: ID_ESTADO_ABANDONADO,
    });
    return respuesta.data;
}

// Emite el certificado correspondiente a un resultado de plan ya
// cerrado (Finalizado o Incompleto). El back decide solo si el
// certificado es de "Aprobación" o "Participación" según ese estado.
export async function generarCertificadoDePlan(plan) {
    return emitir(plan.id);
}

// Arma, materia por materia, el detalle que se ve en "Mi plan":
// reutilizo obtenerMisCalificaciones (que ya trae, por cada comisión
// en la que el alumno está inscripto, sus evaluaciones y notas) y le
// cruzo el ResultadoAcademico si ya se generó. Si existe resultado
// académico para esa comisión, la materia está FINALIZADA y muestro
// ese cierre (calculado por el back); si no existe todavía, está
// PENDIENTE (cursando) y muestro las evaluaciones cargadas hasta
// ahora, igual que en Mis Calificaciones.
export async function obtenerMisMateriasDePlan(idLegajo) {
    const [materias, resultados] = await Promise.all([
        obtenerMisCalificaciones(idLegajo),
        obtenerResultadosAcademicos(idLegajo),
    ]);

    return materias.map((materia) => {
        const resultado = resultados.find((r) => r.id_comision === materia.id_comision);

        if (!resultado) {
            // Todavía no se generó el resultado académico: pendiente/cursando.
            return { ...materia, finalizada: false };
        }

        return {
            ...materia,
            finalizada: true,
            resultado,
        };
    });
}
