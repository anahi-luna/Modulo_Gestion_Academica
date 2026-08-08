// Modal para que el personal con permiso de emitir certificados
// adjunte (o reemplace) el archivo PDF de un certificado ya emitido.

import { useState } from "react";
import { useModalAccessibility } from "../../hooks/useModalAccessibility";

const TAMANIO_MAXIMO_MB = 10;
const TAMANIO_MAXIMO_BYTES = TAMANIO_MAXIMO_MB * 1024 * 1024;

export default function ModalAdjuntarArchivo({ abierto, certificado, onCerrar, onAdjuntar }) {
  const [archivo, setArchivo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  const modalRef = useModalAccessibility(abierto, onCerrar);

  if (!abierto || !certificado) return null;

  const yaTieneArchivo = !!certificado.url_documento;

  function handleArchivo(e) {
    const file = e.target.files?.[0] ?? null;
    setError(null);

    if (file && file.type !== "application/pdf") {
      setError("El archivo debe ser un PDF.");
      e.target.value = "";
      setArchivo(null);
      return;
    }

    if (file && file.size > TAMANIO_MAXIMO_BYTES) {
      setError(`El archivo supera el tamaño máximo permitido (${TAMANIO_MAXIMO_MB} MB).`);
      e.target.value = "";
      setArchivo(null);
      return;
    }

    setArchivo(file);
  }

  async function handleSubmit() {
    if (!archivo) {
      setError("Seleccioná un archivo PDF.");
      return;
    }

    setEnviando(true);
    setError(null);
    try {
      await onAdjuntar(certificado.id, archivo);
      setArchivo(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">
          {yaTieneArchivo ? "Reemplazar archivo" : "Adjuntar archivo"}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Código de verificación: {certificado.codigo_verificacion}
        </p>

        <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 text-sm text-gray-600 mb-1">
          {archivo ? (
            <span className="truncate">{archivo.name}</span>
          ) : (
            "Seleccionar PDF..."
          )}
          <input
            type="file"
            accept="application/pdf"
            onChange={handleArchivo}
            className="hidden"
          />
        </label>
        <p className="text-xs text-gray-400 mb-4">
          Tamaño máximo permitido: {TAMANIO_MAXIMO_MB} MB.
        </p>

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
            onClick={handleSubmit}
            disabled={enviando || !archivo}
            className="flex-1 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium"
          >
            {enviando ? "Subiendo..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
