import {
    PencilSquareIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";

// Componente para mostrar el historial de calificaciones, con opciones para editar o eliminar cada evaluación.
export default function HistorialCalificaciones({
    historial = [],
    onEditar,
    onEliminar,
    evaluacionEditandoId = null,
    puedeEditar = false,
    puedeEliminar = false,
}) {
    return (
        <section className="border-t border-gray-200 bg-gray-50 px-4 py-6 sm:px-8">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                    Historial de calificaciones
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Seleccioná una evaluación para modificar su calificación.
                </p>
            </div>

            {historial.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500">
                    No hay calificaciones registradas.
                </div>
            ) : (
                <div className="space-y-3">
                    {historial.map((evaluacion) => {
                        const editando =
                            evaluacionEditandoId === evaluacion.id;

                        return (
                            <article
                                key={evaluacion.id}
                                className={`
                                    rounded-xl border bg-white p-4
                                    ${
                                        editando
                                            ? "border-blue-500 ring-2 ring-blue-100"
                                            : "border-gray-200"
                                    }
                                `}
                            >
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold text-gray-900">
                                                {evaluacion.titulo}
                                            </h3>

                                            {editando && (
                                                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                                    Editando
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {evaluacion.tipo} · {evaluacion.fecha}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            {evaluacion.cantidad_calificaciones}{" "} calificaciones registradas
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 sm:flex">
                                        
                                        {puedeEditar && (
                                            <button
                                                type="button"
                                                disabled={editando}
                                                onClick={() =>
                                                    onEditar(evaluacion)
                                                }
                                                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <PencilSquareIcon className="h-5 w-5" />
                                                {editando
                                                    ? "Editando"
                                                    : "Editar"}
                                            </button>
                                        )}
                                        
                                        {puedeEliminar && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEliminar(evaluacion)
                                                }
                                                className="flex items-center justify-center gap-2 rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                                Eliminar todas
                                            </button>
                                        )}            
                                        
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}