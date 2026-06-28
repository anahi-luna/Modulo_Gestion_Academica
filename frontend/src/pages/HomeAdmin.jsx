import EstadoBadge from "../components/EstadoBadge";
import { useState } from "react";
import ModuloCard from "../components/ModuloCard";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

export default function HomeAdmin() {
    const [historial, setHistorial] = useState([]);
    const [mostrarHistorial, setMostrarHistorial] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-white rounded-2xl shadow overflow-hidden">
            <button
                onClick={() => setMostrarHistorial((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-3
                text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
                <span>Historial de inscripciones ({historial.length})</span>
                <span>{mostrarHistorial ? "▲" : "▼"}</span>
            </button>

            {mostrarHistorial && (
                <>
                    {historial.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-gray-500">
                            No hay inscripciones registradas.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {historial.map((ins) => (
                                <div key={ins.id} className="px-4 py-3 flex items-center justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">{ins.nombre}</p>
                                        <p className="text-xs text-gray-500">Legajo: {ins.legajo}</p>
                                        <p className="text-xs text-gray-400">{ins.materia}</p>
                                        <p className="text-xs text-gray-400">{ins.comision} · {ins.horario}</p>
                                    </div>
                                    <EstadoBadge estado={ins.estado} />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>

        <div className="grid grid-cols-2 gap-6">
            <ModuloCard titulo="Gestionar inscripciones" descripcion="Alta, baja y modificación de inscripciones." cantidad={`${historial.length} activas`} color="red" ruta="/InscripcionesAdmin" icono={<ClipboardDocumentListIcon className="h-6 w-6" />} />
            <ModuloCard titulo="Gestionar asistencia" descripcion="Registro y seguimiento de asistencia." cantidad="Hoy: 3 turnos" color="blue" icono={<ClipboardDocumentListIcon className="h-6 w-6" />} />
            <ModuloCard titulo="Gestionar calificaciones" descripcion="Carga y edicion de notas, evaluaciones y resultados de desempeño" cantidad="12 pendientes" color="green" icono={<ClipboardDocumentListIcon className="h-6 w-6" />} />
            <ModuloCard titulo="Gestionar certificados" descripcion="Generacion, emision y seguimiento de certificados" cantidad="123 emitidos" color="yellow" icono={<ClipboardDocumentListIcon className="h-6 w-6" />} />
        </div>

    </div>
  );
}