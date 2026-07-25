// Modal de confirmación para emitir el certificado del plan completo
// de un alumno. Ya no pide "quién firma" como campo separado: el back
// no tiene ese campo (solo guarda id_usuario_creacion automáticamente
// del lado del servidor), así que esto queda como una confirmación
// simple antes de generar el certificado real.

import { useState } from "react";
import { useModalAccessibility } from "../../hooks/useModalAccessibility";

export default function ModalEmitirCertificado({ abierto, fila, onCerrar, onEmitir }) {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const modalRef = useModalAccessibility(abierto, onCerrar);

  if (!abierto || !fila) return null;

  async function handleEmitir() {
    setEnviando(true);
    setError(null);
    try {
      await onEmitir(fila.id_resultado_plan);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Emitir certificado</h2>
        <p className="text-sm text-gray-500 mb-4">
          El tipo de certificado (Aprobación o Participación) lo determina
          automáticamente el sistema según cómo cerró el plan.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm mb-4">
          <p><span className="text-gray-400">Alumno:</span> {fila.alumno}</p>
          <p><span className="text-gray-400">Estado del plan:</span> {fila.estado_plan}</p>
          <p><span className="text-gray-400">Avance:</span> {fila.avance}%</p>
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
            {enviando ? "Emitiendo..." : "Emitir certificado"}
          </button>
        </div>
      </div>
    </div>
  );
}
