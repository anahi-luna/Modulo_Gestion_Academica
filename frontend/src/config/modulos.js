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
        permisoLeer: "inscripcion.inscripciones.leer",
        color: "red",
    },
    {
        id: "clases",
        titulo: "Gestión de clases",
        descripcion: "Programación de clases por comisión.",
        ruta: "/GestionClases",
        permisoLeer: "inscripcion.clases.leer",
        color: "blue",
    },
    {
        id: "asistencia",
        titulo: "Asistencia",
        descripcion: "Registro y seguimiento de asistencia.",
        ruta: "/asistencia",
        permisoLeer: "inscripcion.asistencias.leer",
        color: "blue",
    },
    {
        id: "evaluaciones",
        titulo: "Gestión de evaluaciones",
        descripcion: "Parciales, recuperatorios y trabajos prácticos.",
        ruta: "/GestionEvaluaciones",
        permisoLeer: "inscripcion.evaluaciones.leer",
        color: "green",
    },
    {
        id: "calificaciones",
        titulo: "Calificaciones",
        descripcion: "Carga y consulta de notas por evaluación.",
        ruta: "/calificaciones",
        permisoLeer: "inscripcion.calificaciones.leer",
        color: "green",
    },
    {
        id: "certificados",
        titulo: "Certificados",
        descripcion: "Emisión, consulta y descarga de certificados.",
        ruta: "/certificados",
        permisoLeer: "inscripcion.certificados.leer",
        color: "yellow",
    },
    {
        id: "resultado-plan",
        titulo: "Resultado del plan",
        descripcion: "Avance académico del alumno respecto de su plan de estudios.",
        ruta: "/resultado-plan",

        permisoLeer: "inscripcion.resultado_plan.leer",
        color: "red",
    },
];
