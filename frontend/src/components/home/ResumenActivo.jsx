// Estado del alumno con inscripciones activas.
// Muestra estadísticas y la lista de sus inscripciones.

import {
    ClipboardDocumentListIcon,
    CalendarDaysIcon,
    AcademicCapIcon
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import EstadoBadge from "../inscripciones/EstadoBadge";

export default function ResumenActivo({ inscripciones }) {

    const navigate = useNavigate();

    const stats = [
        {
            icono: ClipboardDocumentListIcon,
            titulo: "Inscripciones",
            valor: inscripciones.length,
            subtexto: "activas"
        },
        {
            icono: CalendarDaysIcon,
            titulo: "Asistencia",
            valor: "—",
            subtexto: "promedio"
        },
        {
            icono: AcademicCapIcon,
            titulo: "Certificados",
            valor: 0,
            subtexto: "obtenidos"
        },
    ];

    return (
        <div className="space-y-6">

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4">
                {stats.map(({ icono: Icono, titulo, valor, subtexto }) => (
                    <div key={titulo} className="bg-white rounded-xl shadow p-5 flex flex-col items-center gap-1 text-center">
                        <div className="p-2 bg-red-50 rounded-lg text-red-700">
                            <Icono className="h-6 w-6" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">{valor}</p>
                        <p className="text-xs text-gray-400">{subtexto}</p>
                        <p className="text-xs font-medium text-gray-600">{titulo}</p>
                    </div>
                ))}
            </div>

            {/* Lista de inscripciones */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Mis inscripciones
                    </p>
                    <button
                        onClick={() => navigate("/inscripciones")}
                        className="text-xs text-red-700 hover:underline font-medium"
                    >
                        + Nueva inscripción
                    </button>
                </div>

                <div className="space-y-3">
                    {inscripciones.map((ins) => (
                        <div
                            key={ins.id}
                            className="bg-white rounded-xl shadow px-5 py-4 flex items-center justify-between gap-4"
                        >
                            <div>
                                <p className="font-medium text-gray-800">{ins.materia}</p>
                                <p className="text-xs text-gray-400">
                                    {ins.comision}
                                    {ins.horario ? ` · ${ins.horario}` : ""}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {new Date(ins.fecha_inscripcion).toLocaleDateString()}
                                </p>
                            </div>
                            <EstadoBadge estado={ins.estado} />
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}