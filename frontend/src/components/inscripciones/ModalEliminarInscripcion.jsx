/*
 * Modal de confirmación para eliminar una inscripción.
 * Muestra la información del registro seleccionado antes
 * de ejecutar la eliminación.
 */

export default function ModalEliminarInscripcion({
    abierto,
    inscripcion,
    onCerrar,
    onConfirmar
}) {

    // Si el modal está cerrado o no existe una inscripción seleccionada,
    // no se renderiza.
    if (!abierto || !inscripcion)
        return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold text-red-700 mb-4">
                    Eliminar inscripción
                </h2>
                <p className="text-gray-600 mb-6">
                    ¿Está seguro que desea eliminar la siguiente inscripción?
                </p>
                <div className="bg-gray-100 rounded-lg p-4 space-y-2">
                    <p>
                        <strong>Alumno:</strong>
                        {" "}
                        {inscripcion.alumno}
                    </p>
                    <p>
                        <strong>Legajo:</strong>
                        {" "}
                        {inscripcion.id_legajo}
                    </p>
                    <p>
                        <strong>Materia:</strong>
                        {" "}
                        {inscripcion.materia}
                    </p>
                    <p>
                        <strong>Comisión:</strong>
                        {" "}
                        {inscripcion.comision}
                    </p>
                    <p>
                        <strong>Estado:</strong>
                        {" "}
                        {inscripcion.estado}
                    </p>
                    <p>
                        <strong>Fecha:</strong>
                        {" "}
                        {new Date(
                            inscripcion.fecha_inscripcion
                        ).toLocaleString()}
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
                        onClick={() =>
                            onConfirmar(inscripcion)
                        }
                        className=" px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white "
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}