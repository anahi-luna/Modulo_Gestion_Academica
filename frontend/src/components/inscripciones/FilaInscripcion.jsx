// Fila de la tabla de inscripciones para el admin.
// Muestra los datos de una inscripción con botones de acción.

import EstadoBadge from "./EstadoBadge";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function FilaInscripcion({ inscripcion, onValidar, onEliminar }) {
    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 text-xs text-gray-400 font-mono">
                INS-{inscripcion.id}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">
                {inscripcion.id_legajo}
            </td>
            <td className="px-4 py-3 font-semibold text-gray-800">
                {inscripcion.alumno}
            </td>
            <td className="px-4 py-3 text-sm text-gray-600">
                {inscripcion.comision}
            </td>
            <td className="px-4 py-3">
                <EstadoBadge estado={inscripcion.estado} />
            </td>
            <td className="px-4 py-3">
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => onValidar(inscripcion)}
                        title="Validar"
                        className="p-1.5 rounded-md bg-green-100 hover:bg-green-200 text-green-700"
                    >
                        <CheckIcon className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onEliminar(inscripcion)}
                        title="Eliminar"
                        className="p-1.5 rounded-md bg-red-100 hover:bg-red-200 text-red-700"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}