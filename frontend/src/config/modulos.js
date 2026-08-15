import {
    HomeIcon,
    ClipboardDocumentListIcon,
    PencilSquareIcon,
    CalendarDaysIcon,
    BookOpenIcon,
    DocumentTextIcon,
    ChartBarIcon,
    CheckBadgeIcon,
    ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

// Un módulo por cada sección del sistema. "permisoLeer" es lo mínimo
// que necesita el usuario para que la card aparezca en el Home y pueda
// entrar a la vista (aunque sea solo para mirar). Adentro de cada vista
// ya se pregunta con más detalle si puede crear/editar/eliminar.
//
// "tipo" en cada opción indica si es una vista de gestión (admin/staff)
// o una vista propia (alumno). Se usa en el Navbar para agrupar todas
// las opciones "propio" de todos los módulos en un solo dropdown
// ("Mi actividad") y todas las "gestion" en otro ("Gestión académica"),
// en vez de tener un item de navbar por módulo.
export const MODULOS = [
    {
        id: "inicio",
        titulo: "Inicio",
        icon: HomeIcon,
        color: "red",

        opciones: [
            {
                titulo: "Inicio administración",
                ruta: "/inicio-admin",
                permiso: "inscripcion.inscripciones.leer",
                tipo: "gestion",
            },
            {
                titulo: "Inicio alumno",
                ruta: "/inicio-alumno",
                permiso: "inscripcion.inscripciones.crear",
                tipo: "propio",
            },
        ],
    },

    {
        id: "inscripciones",
        titulo: "Inscripciones",
        icon: ClipboardDocumentListIcon,
        descripcion: "Alta, baja y modificación de inscripciones.",
        color: "red",

        opciones: [
            {
                titulo: "Gestionar inscripciones",
                ruta: "/inscripciones-admin",
                permiso: "inscripcion.inscripciones.leer",
                tipo: "gestion",
            },
            {
                titulo: "Inscribirme",
                ruta: "/inscripciones",
                permiso: "inscripcion.inscripciones.crear",
                tipo: "propio",
            },
        ],
    },

    {
        id: "clases",
        titulo: "Clases",
        icon: BookOpenIcon,
        descripcion: "Programación de clases por comisión.",
        color: "blue",

        opciones: [
            {
                titulo: "Gestionar clases",
                ruta: "/gestion-clases",
                permiso: "inscripcion.clases.leer",
                tipo: "gestion",
            },
            {
                titulo: "Mis clases",
                ruta: "/mis-clases",
                permiso: "inscripcion.clases.leer_propio",
                tipo: "propio",
            },
        ],
    },

    {
        id: "asistencia",
        titulo: "Asistencia",
        icon: CalendarDaysIcon,
        descripcion: "Registro y seguimiento de asistencia.",
        color: "blue",

        opciones: [
            {
                titulo: "Gestionar asistencia",
                ruta: "/gestion-asistencia",
                permiso: "inscripcion.asistencias.leer",
                tipo: "gestion",
            },
            {
                titulo: "Mi asistencia",
                ruta: "/mi-asistencia",
                permiso: "inscripcion.asistencias.leer_propio",
                tipo: "propio",
            },
        ],
    },

    {
        id: "evaluaciones",
        titulo: "Evaluaciones",
        icon: DocumentTextIcon,
        descripcion: "Parciales, recuperatorios y trabajos prácticos.",
        color: "green",

        opciones: [
            {
                titulo: "Gestionar evaluaciones",
                ruta: "/gestion-evaluaciones",
                permiso: "inscripcion.evaluaciones.leer",
                tipo: "gestion",
            },
            {
                titulo: "Mis evaluaciones",
                ruta: "/mis-evaluaciones",
                permiso: "inscripcion.evaluaciones.leer_propio",
                tipo: "propio",
            },
        ],
    },

    {
        id: "calificaciones",
        titulo: "Calificaciones",
        icon: ChartBarIcon,
        descripcion: "Carga y consulta de notas por evaluación.",
        color: "green",

        opciones: [
            {
                titulo: "Gestionar calificaciones",
                ruta: "/gestion-calificaciones",
                permiso: "inscripcion.calificaciones.leer",
                tipo: "gestion",
            },
            {
                titulo: "Mis calificaciones",
                ruta: "/mis-calificaciones",
                permiso: "inscripcion.calificaciones.leer_propio",
                tipo: "propio",
            },
        ],
    },

    {
        id: "certificados",
        titulo: "Certificados",
        icon: CheckBadgeIcon,
        descripcion: "Emisión, consulta y descarga de certificados.",
        color: "yellow",

        opciones: [
            {
                titulo: "Gestionar certificados",
                ruta: "/gestion-certificados",
                permiso: "inscripcion.certificados.leer",
                tipo: "gestion",
            },
            {
                titulo: "Mis certificados",
                ruta: "/mis-certificados",
                permiso: "inscripcion.certificados.leer_propio",
                tipo: "propio",
            },
        ],
    },

    {
        id: "plan",
        titulo: "Plan",
        icon: ClipboardDocumentCheckIcon,
        descripcion: "Avance académico respecto del plan.",
        color: "red",

        opciones: [
            {
                titulo: "Resultado del plan",
                ruta: "/resultado-plan",
                permiso: "inscripcion.resultado_plan.leer",
                tipo: "gestion",
            },
            {
                titulo: "Mi plan",
                ruta: "/mi-plan",
                permiso: "inscripcion.resultado_plan.leer_propio",
                tipo: "propio",
            },
        ],
    },
];