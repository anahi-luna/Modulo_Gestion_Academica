import EstadoCertificadoBadge from "./EstadoCertificadoBadge";

export default function TablaCertificadosAdmin({ certificados, onEmitir, onRevocar, onDescargar }) {
  if (certificados.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
        No hay certificados que coincidan.
      </div>
    );
  }

  // Los botones de acción se repiten igual en la card mobile y en la fila
  // de la tabla desktop, así que los armo una sola vez acá.
  function Acciones({ c }) {
    return (
      <div className="flex flex-wrap gap-2">
        {c.estado !== "Emitido" && (
          <button
            onClick={() => onEmitir(c)}
            className="px-2 py-1 rounded-md bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium"
          >
            Emitir
          </button>
        )}
        {c.estado === "Emitido" && (
          <>
            <button
              onClick={() => onDescargar(c)}
              className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium"
            >
              Descargar
            </button>
            <button
              onClick={() => onRevocar(c)}
              className="px-2 py-1 rounded-md bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium"
            >
              Revocar
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      {/* ---------- MOBILE (< md): tarjetas apiladas ---------- */}
      <div className="md:hidden space-y-3">
        {certificados.map((c) => (
          <div key={c.idCertificado} className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-start gap-2 mb-2">
              <div>
                <p className="font-semibold text-gray-800">{c.alumno}</p>
                <p className="text-xs text-gray-400">{c.numero_legajo}</p>
              </div>
              <EstadoCertificadoBadge estado={c.estado} />
            </div>
            <p className="text-sm text-gray-600">{c.tipo}</p>
            <p className="text-sm text-gray-500 mb-3">{c.materia}</p>
            <p className="text-xs text-gray-400 mb-3">Emisión: {c.fecha_emision ?? "-"}</p>
            <Acciones c={c} />
          </div>
        ))}
      </div>

      {/* ---------- DESKTOP/TABLET (>= md): tabla con scroll horizontal de respaldo ---------- */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-xs text-gray-400 border-b border-gray-100 uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Alumno</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">Materia</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Emisión</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {certificados.map((c) => (
                <tr key={c.idCertificado} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-800">
                    {c.alumno}
                    <span className="block text-xs font-normal text-gray-400">{c.numero_legajo}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{c.tipo}</td>
                  <td className="px-4 py-3 text-gray-600">{c.materia}</td>
                  <td className="px-4 py-3"><EstadoCertificadoBadge estado={c.estado} /></td>
                  <td className="px-4 py-3 text-gray-500">{c.fecha_emision ?? "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <Acciones c={c} />
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