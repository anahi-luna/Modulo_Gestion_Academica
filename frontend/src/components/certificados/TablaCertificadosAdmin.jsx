import EstadoPlanBadge from "../planes/EstadoPlanBadge";
import EstadoCertificadoBadge from "./EstadoCertificadoBadge";

// Componente para mostrar una tabla de certificados en la vista del Administrador, 
// con acciones según el estado del certificado y del plan.
export default function TablaCertificadosAdmin({ filas, onEmitir, onRevocar, onDescargar }) {
  if (filas.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
        No hay alumnos que coincidan.
      </div>
    );
  }

  // Componente interno para mostrar las acciones disponibles para cada fila de la tabla.
  function Acciones({ f }) {
    return (
      <div className="flex flex-wrap gap-2">
        {f.elegiblePararCertificado && onEmitir && (
          <button
            onClick={() => onEmitir(f)}
            className="px-2 py-1 rounded-md bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium whitespace-nowrap"
          >
            Emitir certificado
          </button>
        )}
        {f.certificado && f.certificado.estado === "Emitido" && (
          <>
            <button
              onClick={() => onDescargar(f.certificado)}
              className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium"
            >
              Descargar
            </button>
            {onRevocar && (
              <button
                onClick={() => onRevocar(f.certificado)}
                className="px-2 py-1 rounded-md bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium"
              >
                Revocar
              </button>
            )}
          </>
        )}
        {!f.elegiblePararCertificado && !f.certificado && (
          <span className="text-xs text-gray-300">
            {f.estado_plan === "En curso" ? "Plan en curso" : "—"}
          </span>
        )}
      </div>
    );
  }

  return (
    <>
      {/* ---------- MOBILE (< md): tarjetas apiladas ---------- */}
      <div className="md:hidden space-y-3">
        {filas.map((f) => (
          <div key={f.id_resultado_plan} className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-start gap-2 mb-2">
              <div>
                <p className="font-semibold text-gray-800">{f.alumno}</p>
                <p className="text-xs text-gray-400">{f.numero_legajo}</p>
              </div>
              <EstadoPlanBadge estado={f.estado_plan} />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-700 rounded-full" style={{ width: `${f.avance}%` }} />
              </div>
              <span className="text-xs font-semibold text-gray-600">{f.avance}%</span>
            </div>
            {f.certificado ? (
              <div className="flex items-center gap-2 mb-3">
                <EstadoCertificadoBadge estado={f.certificado.estado} />
                <span className="text-xs text-gray-400">{f.certificado.tipo}</span>
              </div>
            ) : (
              <p className="text-xs text-gray-400 mb-3">Sin certificado emitido</p>
            )}
            <Acciones f={f} />
          </div>
        ))}
      </div>

      {/* ---------- DESKTOP/TABLET (>= md): tabla con scroll horizontal de respaldo ---------- */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100 uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Alumno</th>
                <th className="px-4 py-3 text-left">Estado del plan</th>
                <th className="px-4 py-3 text-left">Avance</th>
                <th className="px-4 py-3 text-left">Certificado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.id_resultado_plan} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {f.alumno}
                    <span className="block text-xs font-normal text-gray-400">{f.numero_legajo}</span>
                  </td>
                  <td className="px-4 py-3"><EstadoPlanBadge estado={f.estado_plan} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 w-28">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-700 rounded-full" style={{ width: `${f.avance}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-600">{f.avance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {f.certificado ? (
                      <div className="flex items-center gap-2">
                        <EstadoCertificadoBadge estado={f.certificado.estado} />
                        <span className="text-xs text-gray-400">{f.certificado.tipo}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Sin emitir</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <Acciones f={f} />
                    </div>
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
