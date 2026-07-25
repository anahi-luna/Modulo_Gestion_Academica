// Componente para mostrar un resumen de una materia dentro del plan de estudios del alumno, 
// con la posibilidad de expandir para ver más detalles.
import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const COLOR_ESTADO_ACADEMICO = {
  Aprobado: "bg-green-100 text-green-700",
  Desaprobado: "bg-red-100 text-red-700",
  Libre: "bg-yellow-100 text-yellow-700",
};

export default function ResumenMateriaPlanCard({ materia }) {
  const [abierto, setAbierto] = useState(false);
  const finalizada = materia.finalizada;

  const colorBadge = finalizada
    ? COLOR_ESTADO_ACADEMICO[materia.resultado?.estado_academico] ?? "bg-gray-100 text-gray-500"
    : "bg-blue-100 text-blue-700"; // Cursando

  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden mb-4">
      <button
        onClick={() => setAbierto((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 text-left gap-3"
      >
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 truncate">{materia.materia}</p>
          <p className="text-xs text-gray-400">{materia.comision}</p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400">
              {finalizada ? "Promedio final" : "Promedio parcial"}
            </p>
            <p className="text-lg font-bold text-gray-800">
              {finalizada
                ? materia.resultado.promedio_final?.toFixed(1) ?? "-"
                : materia.promedio !== null
                  ? materia.promedio.toFixed(1)
                  : "-"}
            </p>
          </div>

          <span className={`inline-block px-3 py-1 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap ${colorBadge}`}>
            {finalizada ? materia.resultado.estado_academico : "Cursando"}
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

          {finalizada ? (
            // Materia FINALIZADA: muestro el cierre real que cargó el
            // admin con "Generar resultado académico".
            <div className="px-5 py-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400">Promedio final</p>
                <p className="font-semibold text-gray-800">
                  {materia.resultado.promedio_final?.toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Asistencia</p>
                <p className="font-semibold text-gray-800">
                  {materia.resultado.porcentaje_asistencia}%
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Fecha de cierre</p>
                <p className="font-semibold text-gray-800">
                  {materia.resultado.fecha_resultado}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Estado</p>
                <p className="font-semibold text-gray-800">
                  {materia.resultado.estado_academico}
                </p>
              </div>
            </div>
          ) : (
            // Materia PENDIENTE (todavía cursando): la misma tabla de
            // evaluaciones que se ve en Mis Calificaciones.
            <>
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
                  {materia.evaluaciones.map((ev) => (
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
                  {materia.evaluaciones.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-4 text-center text-gray-400">
                        Todavía no hay evaluaciones cargadas para esta comisión.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <p className="px-5 py-3 text-xs text-gray-400 border-t border-gray-50">
                Esta materia todavía está cursándose. El resultado académico final
                (promedio, asistencia y estado) va a aparecer acá cuando se cierre la cursada.
              </p>
            </>
          )}

        </div>
      )}
    </div>
  );
}
