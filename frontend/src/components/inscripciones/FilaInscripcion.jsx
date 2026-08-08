// Fila de la tabla de inscripciones para el admin.
// Muestra los datos de una inscripción con botones de acción.

import EstadoBadge from "./EstadoBadge";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import useAuth from "../../auth/hooks/useAuth";
import { useState } from "react";

export default function FilaInscripcion({ inscripcion, onValidar, onEliminar }) {
    const {hasPermission} = useAuth();
    console.log(
    "Fila permisos:",
    hasPermission("inscripcion.inscripciones.actualizar"),
    hasPermission("inscripcion.inscripciones.eliminar")
);
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
                    {hasPermission("inscripcion.inscripciones.actualizar") && (
                        <button
                            onClick={() => onValidar(inscripcion)}
                            title="Validar"
                            className="p-1.5 rounded-md bg-green-100 hover:bg-green-200 text-green-700"
                        >
                            <CheckIcon className="h-4 w-4" />
                        </button>
                    )}
                    {hasPermission("inscripcion.inscripciones.eliminar") && (
                        <button
                            onClick={() => onEliminar(inscripcion)}
                            title="Eliminar"
                            className="p-1.5 rounded-md bg-red-100 hover:bg-red-200 text-red-700"
                        >
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    )}
                    
                </div>
            </td>
        </tr>
    );
}