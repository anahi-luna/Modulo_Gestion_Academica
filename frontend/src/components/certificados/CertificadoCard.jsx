import EstadoCertificadoBadge from "./EstadoCertificadoBadge";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function CertificadoCard({ certificado, onDescargar }) {
  const emitido = certificado.estado === "Emitido";

  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between gap-4">
      <div>
        <p className="font-semibold text-gray-800">{certificado.tipo}</p>
        <p className="text-sm text-gray-500">{certificado.materia} · {certificado.comision}</p>
        {emitido ? (
          <p className="text-xs text-gray-400 mt-1">
            Emitido el {certificado.fecha_emision} · Código {certificado.codigo_verificacion}
          </p>
        ) : (
          <p className="text-xs text-gray-400 mt-1">
            Todavía no fue emitido por la autoridad académica.
          </p>
        )}
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <EstadoCertificadoBadge estado={certificado.estado} />
        {emitido && (
          <button
            onClick={() => onDescargar(certificado)}
            className="flex items-center gap-1 text-xs font-medium text-red-700 hover:text-red-800"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Descargar
          </button>
        )}
      </div>
    </div>
  );
}