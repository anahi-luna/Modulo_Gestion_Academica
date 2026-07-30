import { useState, useEffect } from "react";
import { useModalAccessibility } from "../../hooks/useModalAccessibility";

/*
 * Modal utilizado para validar una inscripción.
 * Permite modificar el estado de la inscripción y,
 * si es necesario, cambiar la comisión asignada.
 */

export default function ModalValidarInscripcion({
    abierto,
    inscripcion,
    comisiones,
    onCerrar,
    onGuardar
}) {

    const [estado, setEstado] = useState("");
    const [comision, setComision] = useState("");

    // Estados disponibles para una inscripción
    const estados = [
        {
            id: 1,
            nombre: "Pendiente"
        },
        {
            id: 2,
            nombre: "Aceptada"
        },
        {
            id: 3,
            nombre: "Rechazada"
        },
        {
            id: 4,
            nombre: "Cancelada"
        }
    ];

    /*
     * Cuando cambia la inscripción seleccionada,
     * se cargan sus datos en el formulario.
     */
    useEffect(()=>{
        if (inscripcion){
            setEstado(inscripcion.estado);
            setComision(inscripcion.id_comision_asignatura);
        }
    },[inscripcion]);

    // El hook se llama siempre, antes de cualquier "return" condicional.
    const modalRef = useModalAccessibility(abierto, onCerrar);

    // Si el modal está cerrado no se renderiza.
    if (!abierto || !inscripcion)
        return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div ref={modalRef} className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
                <h2 className="text-xl font-bold mb-5">
                    Validar inscripción
                </h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="validar-alumno" className="text-sm font-medium">
                            Alumno
                        </label>
                        <input
                            id="validar-alumno"
                            disabled
                            value={inscripcion.alumno}
                            className="w-full mt-1 border rounded-lg px-3 py-2 bg-gray-100"
                        />
                    </div>
                    <div>
                        <label htmlFor="validar-materia" className="text-sm font-medium">
                            Materia
                        </label>
                        <input
                            id="validar-materia"
                            disabled
                            value={inscripcion.materia}
                            className="w-full mt-1 border rounded-lg px-3 py-2 bg-gray-100"
                        />
                    </div>
                    <div>
                        <label htmlFor="validar-comision" className="text-sm font-medium">
                            Comisión
                        </label>
                        <select
                            id="validar-comision"
                            value={comision}
                            onChange={(e) =>
                                setComision(Number(e.target.value))
                            }
                            className="w-full mt-1 border rounded-lg px-3 py-2"
                        >
                            {comisiones.map((com) => (
                                <option
                                    key={com.id_comision_asignatura}
                                    value={com.id_comision_asignatura}
                                >
                                    {com.comision.descripcion} - {com.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="validar-estado" className="text-sm font-medium">
                            Estado
                        </label>
                        <select
                            id="validar-estado"
                            value={estado}
                            onChange={(e) =>
                                setEstado(e.target.value)
                            }
                            className="w-full mt-1 border rounded-lg px-3 py-2"
                        >
                            {
                                estados.map(estado => (
                                    <option
                                        key={estado.id}
                                        value={estado.nombre}
                                    >
                                        {estado.nombre}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onCerrar}
                        className="border rounded-lg px-4 py-2"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            // Obtiene el id correspondiente al estado seleccionado
                            const estadoSeleccionado =
                                estados.find(
                                    e => e.nombre === estado
                                );
                            // Envía únicamente los datos que necesita el backend
                            onGuardar({
                                id_estado:
                                    estadoSeleccionado.id,
                                id_comision_asignatura:
                                    comision
                            });
                        }}
                        className="bg-red-700 text-white rounded-lg px-4 py-2"
                    >
                        Guardar cambios
                    </button>
                </div>
            </div>
        </div>
    );

}