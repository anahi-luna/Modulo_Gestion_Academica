/*
 * Tarjeta que muestra el resumen de una inscripción.
 * Recibe la inscripción y las funciones para validar
 * o eliminar el registro desde el componente padre.
 */

import EstadoBadge from "./EstadoBadge";

export default function InscripcionCard({
    inscripcion,
    onValidar,
    onEliminar
}) {

    return (
        <div className="bg-white rounded-xl shadow px-5 py-4 flex justify-between items-center">
            <div>
                <h3 className="font-semibold text-gray-800">
                    {inscripcion.alumno}
                </h3>
                <p className="text-sm text-gray-500">
                    Legajo: {inscripcion.id_legajo}
                </p>
                <p className="text-sm text-gray-500">
                    {inscripcion.materia}
                </p>
                <p className="text-xs text-gray-400">
                    Comisión {inscripcion.comision}
                </p>
                <p className="text-xs text-gray-400">
                    {new Date(
                        inscripcion.fecha_inscripcion
                    ).toLocaleString()}
                </p>
            </div>
            <div className="flex flex-col items-end gap-3">
                {/* Badge que representa el estado actual de la inscripción */}
                <EstadoBadge
                    estado={inscripcion.estado}
                />
                <div className="flex gap-2">
                    <button
                        onClick={() =>
                            onValidar(inscripcion)
                        }
                        className=" bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        Validar
                    </button>
                    <button
                        onClick={() =>
                            onEliminar(inscripcion)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );

}