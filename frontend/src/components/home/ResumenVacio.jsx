// Estado del alumno sin inscripciones.
// Muestra 3 tarjetas de resumen vacías y los próximos pasos.

import { useNavigate } from "react-router-dom";
import {
    ClipboardDocumentListIcon,
    CalendarDaysIcon,
    AcademicCapIcon
} from "@heroicons/react/24/outline";

const TARJETAS = [
    { icono: ClipboardDocumentListIcon, titulo: "Inscripciones", texto: "Sin cursos aún" },
    { icono: CalendarDaysIcon,          titulo: "Asistencia",    texto: "Sin registros"  },
    { icono: AcademicCapIcon,           titulo: "Certificados",  texto: "Sin obtener"    },
];

const PASOS = [
    {
        num: 1,
        titulo: "Crear tu cuenta",
        desc: "Acceso al sistema habilitado correctamente",
        estado: "completado"
    },
    {
        num: 2,
        titulo: "Inscribirte a un curso",
        desc: "Explorá las ofertas académicas y elegí tu primera actividad",
        estado: "siguiente"
    },
    {
        num: 3,
        titulo: "Completar tu formación",
        desc: "Asistí a las actividades y obtené tus certificados",
        estado: "pendiente"
    },
];

export default function ResumenVacio() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Tu resumen actual
            </p>

            <div className="grid grid-cols-3 gap-4">
                {TARJETAS.map(({ icono: Icono, titulo, texto }) => (
                    <div key={titulo} className="bg-white rounded-xl shadow p-5 flex flex-col items-center gap-2 text-center">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-400">
                            <Icono className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-medium text-gray-700">{titulo}</p>
                        <p className="text-xs text-gray-400">{texto}</p>
                    </div>
                ))}
            </div>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide pt-2">
                Tus próximos pasos
            </p>

            <div className="space-y-3">
                {PASOS.map((paso) => {
                    const esClickeable = paso.estado === "siguiente";

                    return (
                    <div
                        key={paso.num}
                        onClick={esClickeable ? () => navigate("/inscripciones") : undefined}
                        className={`bg-white rounded-xl shadow px-5 py-4 flex items-center justify-between gap-4 ${
                            esClickeable ? "cursor-pointer hover:shadow-md transition" : ""
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                                ${paso.estado === "completado" ? "bg-green-500 text-white"  :
                                  paso.estado === "siguiente"  ? "bg-red-700 text-white"    :
                                                                 "bg-gray-200 text-gray-400"}
                            `}>
                                {paso.estado === "completado" ? "✓" : paso.num}
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 text-sm">{paso.titulo}</p>
                                <p className="text-xs text-gray-400">{paso.desc}</p>
                            </div>
                        </div>
                        <span className={`
                            text-xs font-semibold px-3 py-1 rounded-full shrink-0
                            ${paso.estado === "completado" ? "bg-green-100 text-green-700" :
                              paso.estado === "siguiente"  ? "bg-red-100 text-red-700"     :
                                                             "bg-gray-100 text-gray-500"}
                        `}>
                            {paso.estado === "completado" ? "Completado" :
                             paso.estado === "siguiente"  ? "Siguiente"  : "Pendiente"}
                        </span>
                    </div>
                    );
                })}
            </div>

        </div>
    );
}