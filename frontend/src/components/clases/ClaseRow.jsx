import { PencilSquareIcon, TrashIcon, } from "@heroicons/react/24/outline";

export default function ClaseRow({
    clase,
    onEditar,
    onEliminar,
}) {

    function formatearFecha(fecha) {

        return new Date(fecha).toLocaleDateString("es-AR");

    }

    return (

        <tr className="border-t hover:bg-gray-50 transition">

            {/* Materia */}
            <td className="px-6 py-4 font-medium text-gray-800">

                {clase.materia}

            </td>

            {/* Comisión */}
            <td className="text-center text-gray-700">

                {clase.codigo}

            </td>

            {/* Docente */}
            <td className="text-gray-700">

                {clase.docente}

            </td>

            {/* Fecha */}
            <td className="text-center text-gray-700">

                {formatearFecha(clase.fecha)}

            </td>

            {/* Tema */}
            <td className="text-gray-700">

                {clase.tema}

            </td>

            {/* Acciones */}
            <td>

                <div className="flex justify-center gap-2">
                    {/* Boton que permite editar la clase */}
                    <button
                        title="Editar clase"
                        onClick={() => onEditar(clase)}
                        className="rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
                    >
                        <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    {/* Boton que elimina la clase */}
                    <button
                        title="Eliminar clase"
                        onClick={() => onEliminar(clase)}
                        className="rounded-lg border border-red-300 p-2 text-red-600 transition hover:bg-red-50"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>

                </div>

            </td>

        </tr>

    );

}