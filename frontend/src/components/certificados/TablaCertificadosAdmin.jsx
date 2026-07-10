import EstadoCertificadoBadge from "./EstadoCertificadoBadge";

export default function TablaCertificadosAdmin({ certificados, onEmitir, onRevocar, onDescargar }) {
  if (certificados.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
        No hay certificados que coincidan.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
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
                  <div className="flex gap-2 justify-end">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}