import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function EvaluacionRow({
    evaluacion,
    onEditar,
    onEliminar,
}) {

    function formatearFecha(fecha) {
        return new Date(fecha).toLocaleDateString("es-AR");
    }

    return (

        <tr className="border-t hover:bg-gray-50 transition">

            <td className="px-6 py-4 font-medium text-gray-800">
                {evaluacion.materia}
            </td>

            <td className="px-3 py-4 text-center text-gray-700 whitespace-nowrap">
                {evaluacion.codigo}
            </td>

            <td className="px-3 py-4 text-gray-700 whitespace-nowrap">
                {evaluacion.docente}
            </td>

            <td className="px-3 py-4 text-center text-gray-700 whitespace-nowrap">
                {evaluacion.tipo}
            </td>

            <td className="px-3 py-4 text-gray-700">
                {evaluacion.titulo}
            </td>

            <td className="px-3 py-4 text-center text-gray-700 whitespace-nowrap">
                {formatearFecha(evaluacion.fecha)}
            </td>

            <td className="px-3 py-4">
                <div className="flex justify-center gap-2">
                    <button
                        title="Editar evaluación"
                        onClick={() => onEditar(evaluacion)}
                        className="rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
                    >
                        <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                        title="Eliminar evaluación"
                        onClick={() => onEliminar(evaluacion)}
                        className="rounded-lg border border-red-300 p-2 text-red-600 transition hover:bg-red-50"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
            </td>

        </tr>

    );

}
