import { useEffect, useState } from "react";
import { useModalAccessibility } from "../../hooks/useModalAccessibility";
import { obtenerDocenteTitular } from "../../api/comisiones";
// Componente para mostrar un modal de creación o edición de clase, con campos para seleccionar 
// comisión, fecha, horarios, tema y estado.
export default function ModalClase({
    abierto,
    clase,
    comisiones,
    onCerrar,
    onGuardar,
}) {

    const [formulario, setFormulario] = useState({
        id_comision_asignatura: "",
        numero_clase: "",
        fecha: "",
        hora_inicio: "",
        hora_fin: "",
        tema: "",
        estado: "PROGRAMADA",
    });

    const [errorHorario, setErrorHorario] = useState("");

    useEffect(() => {

        if (clase) {

            setFormulario({
                id_comision_asignatura: clase.id_comision_asignatura,
                numero_clase: clase.numero_clase,
                fecha: clase.fecha,
                hora_inicio: clase.hora_inicio,
                hora_fin: clase.hora_fin,
                tema: clase.tema,
                estado: clase.estado,
            });

        } else {

            setFormulario({
                id_comision_asignatura: "",
                numero_clase: "",
                fecha: "",
                hora_inicio: "",
                hora_fin: "",
                tema: "",
                estado: "PROGRAMADA",
            });

        }

        setErrorHorario("");

    }, [clase]);

    const modalRef = useModalAccessibility(abierto, onCerrar);

    if (!abierto)
        return null;

    const comisionSeleccionada = comisiones.find(
        c => c.id_comision_asignatura === Number(formulario.id_comision_asignatura)
    );

    function manejarGuardar() {

        if (formulario.hora_inicio && formulario.hora_fin && formulario.hora_inicio >= formulario.hora_fin) {

            setErrorHorario("El horario de inicio no puede ser mayor ni igual al horario de fin.");
            return;

        }

        setErrorHorario("");
        onGuardar(formulario);

    }

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">

            <div ref={modalRef} className="bg-white rounded-xl shadow-xl w-full max-w-xl min-w-0 max-h-[90vh] overflow-y-auto p-6">

                <h2 className="text-2xl font-bold text-red-700 mb-6">

                    {clase ? "Editar Clase" : "Nueva Clase"}

                </h2>

                <div className="space-y-5">

                    {/* Comisión */}

                    <div className="min-w-0">

                        <label htmlFor="clase-comision" className="block font-medium mb-2">

                            Comisión

                        </label>

                        <select
                            id="clase-comision"
                            value={formulario.id_comision_asignatura}
                            onChange={(e) =>
                                setFormulario({
                                    ...formulario,
                                    id_comision_asignatura: Number(e.target.value),
                                })
                            }
                            className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2"
                        >

                            <option value="">
                                Seleccione una comisión
                            </option>

                            {comisiones.map((comision) => (

                                <option
                                    key={comision.id_comision_asignatura}
                                    value={comision.id_comision_asignatura}
                                >
                                    {comision.comision.descripcion} - {comision.nombre}
                                </option>

                            ))}

                        </select>

                    </div>

                    {/* Información de la comisión */}

                    {comisionSeleccionada && (

                        <div className="rounded-lg bg-gray-100 p-4 space-y-2 min-w-0">

                            <p className="break-words">

                                <strong>Materia:</strong>{" "}

                                {comisionSeleccionada.nombre}

                            </p>

                            <p className="break-words">
                                {/*Cambiar docente */}
                                <strong>Docente:</strong>{" "}

                                {obtenerDocenteTitular(comisionSeleccionada)}
                            </p>

                        </div>

                    )}
                    {/* Numero de clase */}

                    <div>

                        <label htmlFor="clase-numero" className="block font-medium mb-2">

                            Número / identificador de la clase

                        </label>

                        <input
                            id="clase-numero"
                            type="number"
                            min="1"
                            value={formulario.numero_clase}
                            onChange={(e) =>
                                setFormulario({
                                    ...formulario,
                                    numero_clase: Number(e.target.value),
                                })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />

                    </div>

                    {/* Fecha */}

                    <div>

                        <label htmlFor="clase-fecha" className="block font-medium mb-2">

                            Fecha

                        </label>

                        <input
                            id="clase-fecha"
                            type="date"
                            value={formulario.fecha}
                            onChange={(e) =>
                                setFormulario({
                                    ...formulario,
                                    fecha: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />

                    </div>

                    {/* Horarios */}

                    <div className="grid grid-cols-2 gap-4 min-w-0">

                        <div className="min-w-0">

                            <label htmlFor="clase-hora-inicio" className="block font-medium mb-2">

                                Hora inicio

                            </label>

                            <input
                                id="clase-hora-inicio"
                                type="time"
                                value={formulario.hora_inicio}
                                onChange={(e) =>
                                    setFormulario({
                                        ...formulario,
                                        hora_inicio: e.target.value,
                                    })
                                }
                                className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2"
                            />

                        </div>

                        <div className="min-w-0">

                            <label htmlFor="clase-hora-fin" className="block font-medium mb-2">

                                Hora fin

                            </label>

                            <input
                                id="clase-hora-fin"
                                type="time"
                                value={formulario.hora_fin}
                                onChange={(e) =>
                                    setFormulario({
                                        ...formulario,
                                        hora_fin: e.target.value,
                                    })
                                }
                                className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2"
                            />

                        </div>

                    </div>

                    {errorHorario && (

                        <p className="text-sm text-red-600 -mt-3">
                            {errorHorario}
                        </p>

                    )}

                    {/* Tema */}

                    <div className="min-w-0">

                        <label htmlFor="clase-tema" className="block font-medium mb-2">

                            Tema

                        </label>

                        <input
                            id="clase-tema"
                            type="text"
                            value={formulario.tema}
                            placeholder="Inserte tema de la clase"
                            onChange={(e) =>
                                setFormulario({
                                    ...formulario,
                                    tema: e.target.value,
                                })
                            }
                            className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2"
                        />

                    </div>

                    {clase && (
                        <div>

                            <label htmlFor="clase-estado" className="block font-medium mb-2">

                                Estado de la clase

                            </label>

                            <select
                                id="clase-estado"
                                type="text"
                                value={formulario.estado}
                                onChange={(e) =>
                                    setFormulario({
                                        ...formulario,
                                        estado: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            >

                                <option value="PROGRAMADA">Programada</option>
                                <option value="DICTADA">Dictada</option>
                                <option value="CANCELADA">Cancelada</option>

                            </select>

                        </div>
                    )}

                    

                

                </div>

                <div className="flex justify-end gap-3 mt-8">

                    <button
                        onClick={onCerrar}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={manejarGuardar}
                        className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white"
                    >
                        {clase ? "Guardar cambios" : "Crear clase"}
                    </button>

                </div>

            </div>

        </div>

    );

}