// Planilla de carga de notas (vista Docente/Admin).
// Cada celda es un input editable: al perder el foco (onBlur) guarda
// automáticamente la nota mediante onGuardarNota. Muestra un feedback
// breve de "Guardado" para que quede claro que la acción tuvo efecto.

import { useState } from "react";

export default function PlanillaNotas({ evaluaciones, filas, onGuardarNota }) {
  const [estadoCelda, setEstadoCelda] = useState({});

  async function handleBlur(idLegajo, idEvaluacion, valorOriginal, e) {
    const valor = e.target.value;
    if (valor === (valorOriginal ?? "").toString()) return;

    const clave = `${idLegajo}-${idEvaluacion}`;
    setEstadoCelda((prev) => ({ ...prev, [clave]: "guardando" }));

    try {
      await onGuardarNota(idLegajo, idEvaluacion, valor);
      setEstadoCelda((prev) => ({ ...prev, [clave]: "guardado" }));
      setTimeout(() => {
        setEstadoCelda((prev) => ({ ...prev, [clave]: null }));
      }, 1200);
    } catch (err) {
      setEstadoCelda((prev) => ({ ...prev, [clave]: "error" }));
      alert(err.message);
    }
  }

  if (evaluaciones.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
        Esta comisión todavía no tiene evaluaciones creadas.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
              <th className="px-4 py-3 text-left sticky left-0 bg-white">Alumno</th>
              {evaluaciones.map((ev) => (
                <th key={ev.idEvaluacion} className="px-4 py-3 text-center whitespace-nowrap">
                  {ev.titulo}
                  <span className="block text-[10px] normal-case text-gray-300">{ev.tipo}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila.id_legajo} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 sticky left-0 bg-white">
                  <p className="font-semibold text-gray-800">{fila.alumno}</p>
                  <p className="text-xs text-gray-400">{fila.numero_legajo}</p>
                </td>
                {evaluaciones.map((ev) => {
                  const clave = `${fila.id_legajo}-${ev.idEvaluacion}`;
                  const estado = estadoCelda[clave];
                  return (
                    <td key={ev.idEvaluacion} className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min={0}
                        max={ev.puntaje_maximo}
                        step="0.5"
                        defaultValue={fila.notas[ev.idEvaluacion] ?? ""}
                        placeholder="-"
                        onBlur={(e) =>
                          handleBlur(fila.id_legajo, ev.idEvaluacion, fila.notas[ev.idEvaluacion], e)
                        }
                        className={`w-16 text-center rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500
                          ${estado === "error" ? "border-red-400" : "border-gray-200"}`}
                      />
                      {estado === "guardando" && (
                        <p className="text-[10px] text-gray-400 mt-0.5">Guardando…</p>
                      )}
                      {estado === "guardado" && (
                        <p className="text-[10px] text-green-600 mt-0.5">Guardado ✓</p>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}