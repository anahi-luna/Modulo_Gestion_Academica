import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

// Componente para mostrar un resumen de las calificaciones de una comisión, 
// con la posibilidad de expandir para ver el detalle de cada evaluación.
export default function ResumenComisionCard({ comision }) {
  const [abierto, setAbierto] = useState(false);

  const colorEstado = {
    Aprobado: "bg-green-100 text-green-700",
    Desaprobado: "bg-red-100 text-red-700",
    Regular: "bg-yellow-100 text-yellow-700",
  }[comision.estado] ?? "bg-gray-100 text-gray-500";

  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden mb-4">
      <button
        onClick={() => setAbierto((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 text-left"
      >
        <div>
          <p className="font-semibold text-gray-800">{comision.materia}</p>
          <p className="text-xs text-gray-400">{comision.comision}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-400">Promedio</p>
            <p className="text-lg font-bold text-gray-800">
              {comision.promedio !== null ? comision.promedio.toFixed(1) : "-"}
            </p>
          </div>
          <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${colorEstado}`}>
            {comision.estado}
          </span>
          {abierto ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </button>

      {abierto && (
        <div className="border-t border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-5 py-2 text-left">Evaluación</th>
                <th className="px-5 py-2 text-left">Tipo</th>
                <th className="px-5 py-2 text-left">Fecha</th>
                <th className="px-5 py-2 text-right">Nota</th>
              </tr>
            </thead>
            <tbody>
              {comision.evaluaciones.map((ev) => (
                <tr key={ev.id_evaluacion} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-2 text-gray-700">{ev.titulo}</td>
                  <td className="px-5 py-2 text-gray-500">{ev.tipo}</td>
                  <td className="px-5 py-2 text-gray-500">{ev.fecha}</td>
                  <td className="px-5 py-2 text-right font-semibold text-gray-800">
                    {ev.nota !== null ? `${ev.nota} / ${ev.puntaje_maximo}` : (
                      <span className="text-gray-300 font-normal">Pendiente</span>
                    )}
                  </td>
                </tr>
              ))}
              {comision.evaluaciones.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-4 text-center text-gray-400">
                    Todavía no hay evaluaciones cargadas para esta comisión.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
