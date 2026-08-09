import { useState, useEffect } from "react";
import { useModalAccessibility } from "../../hooks/useModalAccessibility";

/*
 * Modal utilizado para modificar el estado de una inscripción.
 * Las opciones disponibles se determinan según:
 * - el estado actual de la inscripción
 * - las reglas de transición definidas en el backend.
 */

export default function ModalValidarInscripcion({ abierto, inscripcion, onCerrar, onGuardar, estadosInscripcion = [] }) {
    const [estado, setEstado] = useState("");

    // Cuando cambia la inscripción seleccionada, se carga su estado actual.
    useEffect(() => {
        if (inscripcion) {
            setEstado(inscripcion.id_estado ?? "");
        }
    }, [inscripcion]);

    const modalRef = useModalAccessibility(abierto, onCerrar);

    // Estados que NO pueden modificarse según el backend: Cancelada, Finalizada
    const estadosNoModificables = ["Cancelada", "Finalizada"];

    // Obtiene el estado actual desde el catálogo.
    const estadoActual = estadosInscripcion.find((estadoItem) => estadoItem.id_estado === inscripcion?.id_estado);

    // Si el estado actual no permite modificación, no debería abrirse el modal.
    const puedeModificar = estadoActual && !estadosNoModificables.includes(estadoActual.nombre);

    // Estados disponibles para la transición aplicándole las restricciones del backend.
    const estadosDisponibles = estadosInscripcion.filter((estadoItem) =>
        ["Aceptada", "Rechazada", "Cancelada"].includes(estadoItem.nombre)
    );

    if (!abierto || !inscripcion || !puedeModificar) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
                <h2 className="text-xl font-bold mb-5">Modificar estado de inscripción</h2>

                <div className="space-y-4">
                    {/* Alumno */}
                    <div>
                        <label htmlFor="validar-alumno" className="text-sm font-medium">Alumno</label>
                        <input id="validar-alumno" disabled value={inscripcion.alumno ?? ""} className="w-full mt-1 border rounded-lg px-3 py-2 bg-gray-100" />
                    </div>

                    {/* Materia */}
                    <div>
                        <label htmlFor="validar-materia" className="text-sm font-medium">Materia</label>
                        <input id="validar-materia" disabled value={inscripcion.materia ?? ""} className="w-full mt-1 border rounded-lg px-3 py-2 bg-gray-100" />
                    </div>

                    {/* Comisión */}
                    <div>
                        <label htmlFor="validar-comision" className="text-sm font-medium">Comisión</label>
                        <input id="validar-comision" disabled value={inscripcion.comision ?? ""} className="w-full mt-1 border rounded-lg px-3 py-2 bg-gray-100" />
                    </div>

                    {/* Estado */}
                    <div>
                        <label htmlFor="validar-estado" className="text-sm font-medium">Estado</label>
                        <select id="validar-estado" value={estado} onChange={(e) => setEstado(Number(e.target.value))} className="w-full mt-1 border rounded-lg px-3 py-2">
                            <option value="">Seleccione un estado</option>
                            {estadosDisponibles.map((estadoItem) => (
                                <option key={estadoItem.id_estado} value={estadoItem.id_estado}>
                                    {estadoItem.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onCerrar} className="border rounded-lg px-4 py-2">Cancelar</button>
                    <button onClick={() => { if (!estado) return; onGuardar({ id_estado: Number(estado) }); }} className="bg-red-700 text-white rounded-lg px-4 py-2">
                        Guardar cambios
                    </button>
                </div>
            </div>
        </div>
    );
}