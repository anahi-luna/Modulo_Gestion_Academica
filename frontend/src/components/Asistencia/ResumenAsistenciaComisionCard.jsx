// Tarjeta desplegable de asistencia por comisión, para la vista del
// alumno. Mismo patrón visual que ResumenComisionCard.jsx (el que ya
// usa "Mis calificaciones"): un resumen arriba, y al hacer click se ve
// el detalle clase por clase.

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const ESTILOS_ESTADO = {
  Presente: "bg-green-100 text-green-700",
  Ausente: "bg-red-100 text-red-700",
  Justificado: "bg-blue-100 text-blue-700",
  Tarde: "bg-orange-100 text-orange-700",
  "Sin registrar": "bg-gray-100 text-gray-400",
};

function EstadoChip({ estado }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${ESTILOS_ESTADO[estado] ?? "bg-gray-100 text-gray-500"}`}>
      {estado}
    </span>
  );
}

export default function ResumenAsistenciaComisionCard({ comision }) {
  const [abierto, setAbierto] = useState(false);

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
            <p className="text-xs text-gray-400">Asistencia</p>
            <p className="text-lg font-bold text-gray-800">{comision.porcentaje}%</p>
          </div>
          {abierto ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </button>

      {abierto && (
        <div className="border-t border-gray-100 overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-5 py-2 text-left">Fecha</th>
                <th className="px-5 py-2 text-left">Tema</th>
                <th className="px-5 py-2 text-left">Estado</th>
                <th className="px-5 py-2 text-left">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              {comision.detalle.map((d) => (
                <tr key={d.id_clase} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-2 text-gray-500">{d.fecha}</td>
                  <td className="px-5 py-2 text-gray-700">{d.tema}</td>
                  <td className="px-5 py-2"><EstadoChip estado={d.estado} /></td>
                  <td className="px-5 py-2 text-gray-500">{d.observacion}</td>
                </tr>
              ))}
              {comision.detalle.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-4 text-center text-gray-400">
                    Todavía no hay clases registradas para esta comisión.
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