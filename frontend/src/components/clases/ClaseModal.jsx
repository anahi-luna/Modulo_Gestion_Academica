import { useEffect, useState } from "react";
export default function ModalClase({
    abierto,
    clase,
    comisiones,
    onCerrar,
    onGuardar,
}) {

    const [formulario, setFormulario] = useState({
        id_comision: "",
        numero_clase: "",
        fecha: "",
        hora_inicio: "",
        hora_fin: "",
        tema: "",
        estado: "PROGRAMADA",
    });

    useEffect(() => {

        if (clase) {

            setFormulario({
                id_comision: clase.id_comision,
                numero_clase: clase.numero_clase,
                fecha: clase.fecha,
                hora_inicio: clase.hora_inicio,
                hora_fin: clase.hora_fin,
                tema: clase.tema,
                estado: clase.estado,
            });

        } else {

            setFormulario({
                id_comision: "",
                numero_clase: "",
                fecha: "",
                hora_inicio: "",
                hora_fin: "",
                tema: "",
                estado: "PROGRAMADA",
            });

        }

    }, [clase]);

    if (!abierto)
        return null;

    const comisionSeleccionada = comisiones.find(
        c => c.id === Number(formulario.id_comision)
    );

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6">

                <h2 className="text-2xl font-bold text-red-700 mb-6">

                    {clase ? "Editar Clase" : "Nueva Clase"}

                </h2>

                <div className="space-y-5">

                    {/* Comisión */}

                    <div>

                        <label className="block font-medium mb-2">

                            Comisión

                        </label>

                        <select
                            value={formulario.id_comision}
                            onChange={(e) =>
                                setFormulario({
                                    ...formulario,
                                    id_comision: Number(e.target.value),
                                })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        >

                            <option value="">
                                Seleccione una comisión
                            </option>

                            {comisiones.map((comision) => (

                                <option
                                    key={comision.id}
                                    value={comision.id}
                                >
                                    {comision.codigo} - {comision.materia}
                                </option>

                            ))}

                        </select>

                    </div>

                    {/* Información de la comisión */}

                    {comisionSeleccionada && (

                        <div className="rounded-lg bg-gray-100 p-4 space-y-2">

                            <p>

                                <strong>Materia:</strong>{" "}

                                {comisionSeleccionada.materia}

                            </p>

                            <p>

                                <strong>Docente:</strong>{" "}

                                {comisionSeleccionada.docente}

                            </p>

                        </div>

                    )}
                    {/* Numero de clase */}

                    <div>

                        <label className="block font-medium mb-2">

                            Número de clase

                        </label>

                        <input
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

                        <label className="block font-medium mb-2">

                            Fecha

                        </label>

                        <input
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

                    <div className="grid grid-cols-2 gap-4">

                        <div>

                            <label className="block font-medium mb-2">

                                Hora inicio

                            </label>

                            <input
                                type="time"
                                value={formulario.hora_inicio}
                                onChange={(e) =>
                                    setFormulario({
                                        ...formulario,
                                        hora_inicio: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />

                        </div>

                        <div>

                            <label className="block font-medium mb-2">

                                Hora fin

                            </label>

                            <input
                                type="time"
                                value={formulario.hora_fin}
                                onChange={(e) =>
                                    setFormulario({
                                        ...formulario,
                                        hora_fin: e.target.value,
                                    })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            />

                        </div>

                    </div>

                    {/* Tema */}

                    <div>

                        <label className="block font-medium mb-2">

                            Tema

                        </label>

                        <input
                            type="text"
                            value={formulario.tema}
                            placeholder="Inserte tema de la clase"
                            onChange={(e) =>
                                setFormulario({
                                    ...formulario,
                                    tema: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />

                    </div>

                    {clase && (
                        <div>

                            <label className="block font-medium mb-2">

                                Estado de la clase

                            </label>

                            <select
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
                        onClick={() => onGuardar(formulario)}
                        className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white"
                    >
                        {clase ? "Guardar cambios" : "Crear clase"}
                    </button>

                </div>

            </div>

        </div>

    );

}