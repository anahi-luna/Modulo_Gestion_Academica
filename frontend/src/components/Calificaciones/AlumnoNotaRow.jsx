import { TrashIcon } from "@heroicons/react/24/outline";

// Componente para mostrar una fila de calificación de un alumno, 
// con inputs para nota y observación, y botón para eliminar la calificación.
export default function AlumnoNotaRow({
    calificacion,
    onCambiarNota,
    onCambiarObservacion,
    onEliminarCalificacion,
    soloLectura = false,
}) {

    const estado = calificacion.nota === null || calificacion.nota === undefined || calificacion.nota === ""
        ? null
        : Number(calificacion.nota) >= 6
            ? "Aprobado"
            : "Desaprobado";

    const colorEstado = estado === "Aprobado"
        ? "bg-green-100 text-green-700"
        : estado === "Desaprobado"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-400";

    return (

        <tr className="border-b">

            <td className="py-4">
                {calificacion.alumno}
            </td>

            <td>
                {calificacion.id_legajo}
            </td>

            <td>
                <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    disabled={soloLectura}
                    value={calificacion.nota ?? ""}
                    onChange={(e) => onCambiarNota(calificacion.id_inscripcion, e.target.value)}
                    placeholder="-"
                    className="w-20 rounded-lg border border-gray-300 px-2 py-1 focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none disabled:opacity-50 disabled:bg-gray-100"
                />
            </td>

            <td>
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${colorEstado}`}>
                    {estado ?? "Sin nota"}
                </span>
            </td>

            <td>
                <input
                    type="text"
                    disabled={soloLectura}
                    value={calificacion.observacion ?? ""}
                    onChange={(e) => onCambiarObservacion(calificacion.id_inscripcion, e.target.value)}
                    placeholder="Observación (opcional)"
                    className="w-full rounded-lg border border-gray-300 px-2 py-1 focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none disabled:opacity-50 disabled:bg-gray-100"
                />
            </td>

            <td className="pl-2">
                {!soloLectura && calificacion.id &&(
                    <button
                        type="button"
                        onClick={() => onEliminarCalificacion(calificacion)}
                        className="flex items-center justify-center gap-2 rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                )}

            </td>

        </tr>

    );

}
