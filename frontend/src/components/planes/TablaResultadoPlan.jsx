// Tabla de "Resultado del plan" para el staff el instituto.
// Mismo patrón responsive que TablaCertificadosAdmin.jsx: tarjetas
// apiladas en mobile, tabla con scroll horizontal desde md.

import EstadoPlanBadge from "./EstadoPlanBadge";

export default function TablaResultadoPlan({ planes, onMarcarAbandono, onGenerarCertificado }) {
  if (planes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
        No hay legajos que coincidan con la búsqueda.
      </div>
    );
  }

  // El botón de acción cambia según el estado del plan: si ya está
  // Aprobado, ofrezco generar el certificado; si todavía no llegó a
  // ningún estado final, ofrezco marcarlo como abandono; si ya está
  // Abandono, no hay ninguna acción más para hacer.
  function Accion({ p }) {
    if (p.estado === "Finalizado" || p.estado === "Incompleto") {
      return (
        <button
          onClick={() => onGenerarCertificado(p)}
          className="px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-900 text-white text-xs font-medium whitespace-nowrap"
        >
          Generar certificado
        </button>
      );
    }
    if (p.estado === "Abandonado") {
      return <span className="text-xs text-gray-300">—</span>;
    }
    return (
      <button
        onClick={() => onMarcarAbandono(p)}
        className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-medium whitespace-nowrap"
      >
        Marcar abandono
      </button>
    );
  }

  return (
    <>
      {/*MOBILE tarjetas */}
      <div className="md:hidden space-y-3">
        {planes.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-start gap-2 mb-2">
              <div>
                <p className="font-semibold text-gray-800">{p.numero_legajo}</p>
                <p className="text-xs text-gray-400">{p.alumno}</p>
              </div>
              <EstadoPlanBadge estado={p.estado} />
            </div>

            <p className="text-xs text-gray-400 mb-2">Plan Nº {p.id_plan}</p>

            <div className="flex items-center gap-2 mb-1">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-700 rounded-full" style={{ width: `${p.avance}%` }} />
              </div>
              <span className="text-xs font-semibold text-gray-600">{p.avance}%</span>
            </div>

            <p className="text-xs text-gray-400 mb-3">
              {p.materias_totales} totales · {p.materias_aprobadas} aprobadas · {p.materias_finalizadas} finalizadas
            </p>

            <Accion p={p} />
          </div>
        ))}
      </div>

      {/* ---------- DESKTOP/TABLETtabla ---------- */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100 uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Legajo</th>
                <th className="px-4 py-3 text-left">Plan</th>
                <th className="px-4 py-3 text-left">Materias totales</th>
                <th className="px-4 py-3 text-left">Aprobadas</th>
                <th className="px-4 py-3 text-left">Finalizadas</th>
                <th className="px-4 py-3 text-left">Avance</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {planes.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {p.numero_legajo}
                    <span className="block text-xs font-normal text-gray-400">{p.alumno}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">Plan Nº {p.id_plan}</td>
                  <td className="px-4 py-3 text-gray-600">{p.materias_totales}</td>
                  <td className="px-4 py-3 text-gray-600">{p.materias_aprobadas}</td>
                  <td className="px-4 py-3 text-gray-600">{p.materias_finalizadas}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 w-32">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-700 rounded-full" style={{ width: `${p.avance}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{p.avance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><EstadoPlanBadge estado={p.estado} /></td>
                  <td className="px-4 py-3 text-right">
                    <Accion p={p} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}