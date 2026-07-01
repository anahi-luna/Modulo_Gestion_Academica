// Servicio de Inscripciones
// Cuando los microservicios reales estén disponibles,
// solamente será necesario modificar este archivo.
import { getLegajo } from "../mocks/legajosMock";
import { getComisiones } from "../mocks/comisionesMock";
import { crearInscripcion } from "../api/inscripcionesApi";

// Orden jerárquico de rangos

const RANGOS = [
    "Bombero",
    "Cabo",
    "Sargento",
    "Suboficial Mayor"
];

// Buscar un legajo
export async function buscarLegajo(numeroLegajo) {
    const response = await getLegajo(numeroLegajo);
    const legajo = response.data;
    // Validación local para evitar continuar
    // con el flujo si el legajo está inactivo.
    if (!legajo.activo) {
        throw new Error(
            "El legajo se encuentra inactivo y no puede realizar inscripciones."
        );
    }
    return legajo;
}

// Obtener todas las comisiones
export async function obtenerComisiones() {
    const response = await getComisiones();
    return response.data;
}

// Obtener únicamente las comisiones que el alumno puede cursar
export async function obtenerComisionesDisponibles(numeroLegajo) {

    const legajo = await buscarLegajo(numeroLegajo);
    const comisiones = await obtenerComisiones();
    const indiceAlumno = RANGOS.indexOf(legajo.rango);

    return comisiones.filter((comision) => {

        // 1. Validar rango mínimo
        if (comision.rango_minimo !== null) {

            const indiceRequerido = RANGOS.indexOf(comision.rango_minimo);

            if (indiceAlumno < indiceRequerido) {
                return false;
            }
        }

        // 2. Validar correlativas
        if (comision.correlativas.length > 0) {

            const cumpleCorrelativas =
                comision.correlativas.every(idMateria =>
                    legajo.materias_aprobadas.includes(idMateria)
                );

            if (!cumpleCorrelativas) {
                return false;
            }

        }

        // 3. Validar cupo disponible
        if (comision.inscriptos >= comision.cupo) {
            return false;
        }

        return true;

    });

}

// Carga toda la información necesaria para iniciar
// el proceso de inscripción.
// La vista solamente consume este método.
export async function cargarDatosInscripcion(numeroLegajo) {

    const legajo = await buscarLegajo(numeroLegajo);

    const comisiones =
        await obtenerComisionesDisponibles(numeroLegajo);

    return {
        legajo,
        comisiones
    };
}

// Crear una solicitud de inscripción
export async function crearSolicitudInscripcion(
    numeroLegajo,
    idComision
) {

    const legajo = await buscarLegajo(numeroLegajo);

    const comisiones = await obtenerComisiones();
    const comision = comisiones.find(
        c => c.id === idComision
    )

    // Enviamos la solicitud al backend por POST
    const response = await crearInscripcion({

        id_legajo: legajo.id_legajo,
        id_comision: idComision

    });

    // Si el backend rechazó la inscripción,
    // propagamos el mensaje hacia la vista.
    if (response.status !== "success") {
        throw new Error(response.message);
    }

    const data = response.data;

    // Adaptamos la respuesta para la vista
    return {

        status: response.status,
        message: response.message,

        data: {

            id: data.id_inscripcion,

            id_legajo: legajo.numero_legajo,

            alumno: `${legajo.nombre} ${legajo.apellido}`,

            comision: comision?.codigo ?? "-",

            materia: comision?.materia ?? "-",

            estado: data.estado.nombre,

            fecha_inscripcion: data.fecha_inscripcion,

            motivo: null

        }

    };

}