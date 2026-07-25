import { PencilSquareIcon, TrashIcon, } from "@heroicons/react/24/outline";

// Componente para mostrar una fila de clase en la tabla de clases, con información básica y 
// botones de acción para editar o eliminar la clase.
export default function ClaseRow({
    clase,
    onEditar,
    onEliminar,
    soloLectura = false,
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
            <td className="px-3 py-4 text-center text-gray-700 whitespace-nowrap">

                {clase.codigo}

            </td>

            {/* Docente */}
            <td className="px-3 py-4 text-gray-700 whitespace-nowrap">

                {clase.docente}

            </td>

            {/* Fecha */}
            <td className="px-3 py-4 text-center text-gray-700 whitespace-nowrap">

                {formatearFecha(clase.fecha)}

            </td>

            {/* Tema */}
            <td className="px-3 py-4 text-gray-700">

                {clase.tema}

            </td>

            {/* Acciones: no se renderiza esta celda si es solo lectura,
                para que coincida con el <th> que también se oculta en
                ClaseTable.jsx */}
            {!soloLectura && (
                <td className="px-3 py-4">

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
            )}

        </tr>

    );

}