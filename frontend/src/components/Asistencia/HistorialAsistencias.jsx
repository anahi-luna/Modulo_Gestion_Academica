import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function HistorialAsistencias({
    clases = [],
    onEditar,
    onEliminar,
}) {
    if (clases.length === 0){
        return(
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center text-gray-500">
                Todavia no hay asistencias registradas.
            </div>
        );
    }

    return(
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-x1 font-bold text-gray-800">
                Historial de asistencias
            </h2>

            <div className="space-y-3">
                {clases.map((clase) => (
                    <article
                        key={clase.id}
                        className="flex flex-col gap-4 rounded-xl border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"

                    >
                        <div>
                            <p className="font-semibold text-gray-900">
                                {clase.tema}
                            </p>

                            <p className="text-sm text-gray-500">
                                {clase.materia} . {clase.codigo_comision}
                            </p>

                            <p mt-1 text-sm text-gray-500>
                                {clase.fecha} . {clase.hora_inicio}
                            </p>

                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => onEditar(clase)}
                                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
                            >
                                <PencilSquareIcon className="h-5 w-5" />
                                Editar

                            </button>

                            <button
                                type="button"
                                onClick={() => onEliminar(clase)}
                                className="flex items-center gap-2 rounded-lg bg-red-700 px-3 py-2 text-sm text-white hover:bg-red-800"
                            >
                                <TrashIcon className="h-5 w-5" />
                                Eliminar
                            </button>
                        </div>

                    </article>
                ))}
            </div>
        </section>
    );
}   