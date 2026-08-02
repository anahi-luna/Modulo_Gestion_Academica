// Componente para mostrar un listado de próximas clases por comisión, con la posibilidad 
// de expandir cada comisión para ver sus clases.

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const ESTILOS_ESTADO_CLASE = {
  PROGRAMADA: "bg-blue-100 text-blue-700",
  DICTADA: "bg-green-100 text-green-700",
  CANCELADA: "bg-red-100 text-red-700",
};

function estadoLegible(estado) {
  if (!estado) return "-";
  return estado.charAt(0) + estado.slice(1).toLowerCase();
}

function ComisionClasesCard({ comision }) {
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
          <p className="text-xs text-gray-400">{comision.clases.length} clases</p>
          {abierto ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </button>

      {abierto && (
        <div className="border-t border-gray-100 overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-5 py-2 text-left">Tema</th>
                <th className="px-5 py-2 text-left">Fecha</th>
                <th className="px-5 py-2 text-left">Docente</th>
                <th className="px-5 py-2 text-left">Horario</th>
                <th className="px-5 py-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {comision.clases.map((cl) => (
                <tr key={cl.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-2 text-gray-700">{cl.tema}</td>
                  <td className="px-5 py-2 text-gray-500">{cl.fecha}</td>
                  <td className="px-5 py-2 text-gray-500">{cl.docente}</td>
                  <td className="px-5 py-2 text-gray-500">{cl.horario}</td>
                  <td className="px-5 py-2">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${ESTILOS_ESTADO_CLASE[cl.estado] ?? "bg-gray-100 text-gray-500"}`}>
                      {estadoLegible(cl.estado)}
                    </span>
                  </td>
                </tr>
              ))}
              {comision.clases.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-4 text-center text-gray-400">
                    Todavía no hay clases cargadas para esta comisión.
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

export default function ProximasClasesPorComision({ porComision }) {
  if (porComision.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
        Todavía no tenés clases programadas.
      </div>
    );
  }

  return (
    <>
      {porComision.map((c) => (
        <ComisionClasesCard key={c.id_comision_asignatura} comision={c} />
      ))}
    </>
  );
}