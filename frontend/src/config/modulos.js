// Acá centralizo los strings de permisos tal cual los definió mi
// compañera en permisos.yml del back, para no andar tipeando
// "micro2.asistencias.crear" repetido por todos lados y equivocarme
// en algún archivo. Si el día de mañana el back agrega un permiso
// nuevo, lo agrego acá y ya está disponible en toda la app.
export const ACCIONES = {
    INSCRIPCIONES_CREAR: "micro2.inscripciones.crear",
    INSCRIPCIONES_LEER: "micro2.inscripciones.leer",
    INSCRIPCIONES_ACTUALIZAR: "micro2.inscripciones.actualizar",
    INSCRIPCIONES_ELIMINAR: "micro2.inscripciones.eliminar",

    CLASES_CREAR: "micro2.clases.crear",
    CLASES_LEER: "micro2.clases.leer",
    CLASES_ACTUALIZAR: "micro2.clases.actualizar",
    CLASES_ELIMINAR: "micro2.clases.eliminar",

    ASISTENCIAS_CREAR: "micro2.asistencias.crear",
    ASISTENCIAS_LEER: "micro2.asistencias.leer",
    ASISTENCIAS_ACTUALIZAR: "micro2.asistencias.actualizar",
    ASISTENCIAS_ELIMINAR: "micro2.asistencias.eliminar",

    EVALUACIONES_CREAR: "micro2.evaluaciones.crear",
    EVALUACIONES_LEER: "micro2.evaluaciones.leer",
    EVALUACIONES_ACTUALIZAR: "micro2.evaluaciones.actualizar",
    EVALUACIONES_ELIMINAR: "micro2.evaluaciones.eliminar",

    CALIFICACIONES_CREAR: "micro2.calificaciones.crear",
    CALIFICACIONES_LEER: "micro2.calificaciones.leer",
    CALIFICACIONES_ACTUALIZAR: "micro2.calificaciones.actualizar",
    CALIFICACIONES_ELIMINAR: "micro2.calificaciones.eliminar",

    CERTIFICADOS_EMITIR: "micro2.certificados.emitir",
    CERTIFICADOS_LEER: "micro2.certificados.leer",
    CERTIFICADOS_ACTUALIZAR: "micro2.certificados.actualizar",
    CERTIFICADOS_ELIMINAR: "micro2.certificados.eliminar",

    REPORTES_LEER: "micro2.reportes.leer",
};

// Un módulo por cada sección del sistema. "permisoLeer" es lo mínimo
// que necesita el usuario para que la card aparezca en el Home y pueda
// entrar a la vista (aunque sea solo para mirar). Adentro de cada vista
// ya se pregunta con más detalle si puede crear/editar/eliminar.
export const MODULOS = [
    {
        id: "inscripciones",
        titulo: "Inscripciones",
        descripcion: "Alta, baja y modificación de inscripciones.",
        ruta: "/inscripcionesAdmin",
        permisoLeer: ACCIONES.INSCRIPCIONES_LEER,
        color: "red",
    },
    {
        id: "clases",
        titulo: "Gestión de clases",
        descripcion: "Programación de clases por comisión.",
        ruta: "/GestionClases",
        permisoLeer: ACCIONES.CLASES_LEER,
        color: "blue",
    },
    {
        id: "asistencia",
        titulo: "Asistencia",
        descripcion: "Registro y seguimiento de asistencia.",
        ruta: "/asistencia",
        permisoLeer: ACCIONES.ASISTENCIAS_LEER,
        color: "blue",
    },
    {
        id: "evaluaciones",
        titulo: "Gestión de evaluaciones",
        descripcion: "Parciales, recuperatorios y trabajos prácticos.",
        ruta: "/GestionEvaluaciones",
        permisoLeer: ACCIONES.EVALUACIONES_LEER,
        color: "green",
    },
    {
        id: "calificaciones",
        titulo: "Calificaciones",
        descripcion: "Carga y consulta de notas por evaluación.",
        ruta: "/calificaciones",
        permisoLeer: ACCIONES.CALIFICACIONES_LEER,
        color: "green",
    },
    {
        id: "certificados",
        titulo: "Certificados",
        descripcion: "Emisión, consulta y descarga de certificados.",
        ruta: "/certificados",
        permisoLeer: ACCIONES.CERTIFICADOS_LEER,
        color: "yellow",
    },
];
