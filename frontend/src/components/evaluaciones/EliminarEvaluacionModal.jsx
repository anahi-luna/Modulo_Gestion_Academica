/*
  Modal de confirmacion para eliminar una evaluacion.
  Muestra la informacion de la evaluacion seleccionada antes de ejecutar la eliminacion.
 */
import { useModalAccessibility } from "../../hooks/useModalAccessibility";

export default function EliminarEvaluacionModal({
    abierto,
    evaluacion,
    onCerrar,
    onConfirmar,
}) {

    // El hook se llama siempre, antes de cualquier "return" condicional.
    const modalRef = useModalAccessibility(abierto, onCerrar);

    if (!abierto || !evaluacion)
        return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div ref={modalRef} className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

                <h2 className="text-xl font-bold text-red-700 mb-4">
                    Eliminar evaluación
                </h2>

                <p className="text-gray-600 mb-6">
                    ¿Está seguro que desea eliminar la evaluación? Esta acción también elimina las notas ya cargadas para esta evaluación.
                </p>

                <div className="bg-gray-100 rounded-lg p-4 space-y-2">

                    <p>
                        <strong>Materia:</strong> {evaluacion.materia}
                    </p>

                    <p>
                        <strong>Comisión:</strong> {evaluacion.codigo}
                    </p>

                    <p>
                        <strong>Tipo:</strong> {evaluacion.tipo}
                    </p>

                    <p>
                        <strong>Título:</strong> {evaluacion.titulo}
                    </p>

                    <p>
                        <strong>Fecha:</strong> {new Date(evaluacion.fecha).toLocaleDateString("es-AR")}
                    </p>

                </div>

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={onCerrar}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={() => onConfirmar(evaluacion)}
                        className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white"
                    >
                        Eliminar
                    </button>

                </div>

            </div>

        </div>

    );

}
