import { useModalAccessibility } from "../hooks/useModalAccessibility";

export default function ModalConfirmacion({
    abierto,
    titulo,
    mensaje,
    textoConfirmar = "Confirmar",
    textoCancelar = "Cancelar",
    onConfirmar,
    onCancelar,
}) {

    const modalRef = useModalAccessibility(abierto, onCancelar);

    if (!abierto) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">

            <div
                ref={modalRef}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-fade-in"
            >

                {/* Ícono */}
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">
                    ⚠️
                </div>

                {/* Título */}
                <h2 className="text-xl font-bold text-red-700 mb-2">
                    {titulo}
                </h2>

                {/* Mensaje */}
                <p className="text-sm text-gray-600 mb-6">
                    {mensaje}
                </p>

                {/* Botones */}
                <div className="flex flex-col gap-2">

                    <button
                        onClick={onConfirmar}
                        className="w-full py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-medium text-sm transition-colors"
                    >
                        {textoConfirmar}
                    </button>

                    <button
                        onClick={onCancelar}
                        className="w-full py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors"
                    >
                        {textoCancelar}
                    </button>

                </div>

            </div>

        </div>
    );
}