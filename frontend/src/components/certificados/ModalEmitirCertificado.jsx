// Modal de emisión/firma de certificado (vista Admin).
// RBAC: certificados sólo pueden emitirse/firmarse por autoridades habilitadas.

import { useState } from "react";

export default function ModalEmitirCertificado({ abierto, certificado, usuario, onCerrar, onEmitir }) {
  const [enviando, setEnviando] = useState(false);
  const [error, setError]       = useState(null);

  if (!abierto || !certificado) return null;

  async function handleEmitir() {
    setEnviando(true);
    setError(null);
    try {
      await onEmitir({
        idCertificado: certificado.idCertificado,
        firmado_por: usuario.nombre,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Emitir y firmar certificado</h2>
        <p className="text-sm text-gray-500 mb-4">
          Vas a emitir este certificado con tu firma digital.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm mb-4">
          <p><span className="text-gray-400">Alumno:</span> {certificado.alumno}</p>
          <p><span className="text-gray-400">Tipo:</span> {certificado.tipo}</p>
          <p><span className="text-gray-400">Materia:</span> {certificado.materia}</p>
          <p><span className="text-gray-400">Firmará:</span> {usuario.nombre}</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCerrar}
            className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm font-medium hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleEmitir}
            disabled={enviando}
            className="flex-1 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium"
          >
            {enviando ? "Emitiendo..." : "Emitir y firmar"}
          </button>
        </div>
      </div>
    </div>
  );
}