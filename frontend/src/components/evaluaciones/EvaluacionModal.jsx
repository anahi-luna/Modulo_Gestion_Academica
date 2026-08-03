import { useEffect, useState } from "react";
import { useModalAccessibility } from "../../hooks/useModalAccessibility";
import { obtenerDocenteTitular } from "../../api/comisiones";
import Alert from "../Alert";

// Componente para mostrar un modal de creación o edición de evaluación, con campos para seleccionar la comisión,
//  tipo, título, fecha y puntaje máximo.
export default function EvaluacionModal({
    abierto,
    evaluacion,
    comisiones,
    onCerrar,
    onGuardar,
}) {
    const [alerta, setAlerta] = useState(null);
    const [formulario, setFormulario] = useState({
        id_comision_asignatura: "",
        titulo: "",
        tipo: "Parcial",
        fecha: "",
        puntaje_maximo: 10,
    });

    useEffect(() => {

        if (evaluacion) {

            setFormulario({
                id_comision_asignatura: evaluacion.id_comision_asignatura,
                titulo: evaluacion.titulo,
                tipo: evaluacion.tipo,
                fecha: evaluacion.fecha,
                puntaje_maximo: evaluacion.puntaje_maximo,
            });

        } else {

            setFormulario({
                id_comision_asignatura: "",
                titulo: "",
                tipo: "Parcial",
                fecha: "",
                puntaje_maximo: 10,
            });

        }

    }, [evaluacion]);

    const modalRef = useModalAccessibility(abierto, onCerrar);

    if (!abierto)
        return null;

    const comisionSeleccionada = comisiones.find(
    c => c.id_comision_asignatura === Number(formulario.id_comision_asignatura));

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">

            <div ref={modalRef} className="bg-white rounded-xl shadow-xl w-full max-w-xl min-w-0 max-h-[90vh] overflow-y-auto p-6">

                <h2 className="text-2xl font-bold text-red-700 mb-6">
                    {evaluacion ? "Editar Evaluación" : "Nueva Evaluación"}
                </h2>

                {alerta && (
                    <Alert
                        tipo={alerta.tipo}
                        titulo={alerta.titulo}
                        mensaje={alerta.mensaje}
                        onCerrar={() => setAlerta(null)}
                    />
                )}
                <div className="space-y-5">

                    {/* Comisión */}
                    <div className="min-w-0">
                        <label htmlFor="evaluacion-comision" className="block font-medium mb-2">
                            Comisión
                        </label>
                        <select
                            id="evaluacion-comision"
                            value={formulario.id_comision_asignatura}
                            onChange={(e) =>
                                setFormulario({
                                    ...formulario,
                                    id_comision_asignatura: Number(e.target.value),
                                })
                            }
                            className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2"
                        >
                            <option value="">Seleccione una comisión</option>
                            {comisiones.map((comision) => (
                                <option key={comision.id_comision_asignatura} value={comision.id_comision_asignatura}>
                                    {comision.comision.descripcion} - {comision.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Información de la comisión */}
                    {comisionSeleccionada && (
                        <div className="rounded-lg bg-gray-100 p-4 space-y-2 min-w-0">
                            <p className="break-words">
                                <strong>Materia:</strong> {comisionSeleccionada.nombre}
                            </p>
                            {/*Cambiar docente */}
                            <p className="break-words">
                                <strong>Docente:</strong> {obtenerDocenteTitular(comisionSeleccionada)}
                            </p>
                        </div>
                    )}

                    {/* Tipo */}
                    <div>
                        <label htmlFor="evaluacion-tipo" className="block font-medium mb-2">
                            Tipo
                        </label>
                        <select
                            id="evaluacion-tipo"
                            value={formulario.tipo}
                            onChange={(e) =>
                                setFormulario({
                                    ...formulario,
                                    tipo: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        >
                            <option value="Parcial">Parcial</option>
                            <option value="TP">Trabajo Práctico</option>
                            <option value="Final">Final</option>
                        </select>
                    </div>

                    {/* Título */}
                    <div>
                        <label htmlFor="evaluacion-titulo" className="block font-medium mb-2">
                            Título
                        </label>
                        <input
                            id="evaluacion-titulo"
                            type="text"
                            value={formulario.titulo}
                            placeholder="Ej: Parcial 1"
                            onChange={(e) =>
                                setFormulario({
                                    ...formulario,
                                    titulo: e.target.value,
                                })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>

                    {/* Fecha */}
                    <div>
                        <label htmlFor="evaluacion-fecha" className="block font-medium mb-2">
                            Fecha
                        </label>
                        <input
                            id="evaluacion-fecha"
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

                    {/* Puntaje máximo */}
                    <div>
                        <label htmlFor="evaluacion-puntaje" className="block font-medium mb-2">
                            Puntaje máximo
                        </label>
                        <input
                            id="evaluacion-puntaje"
                            type="number"
                            min="0"
                            max="100"
                            value={formulario.puntaje_maximo}
                            onChange={(e) =>
                                setFormulario({
                                    ...formulario,
                                    puntaje_maximo: Number(e.target.value),
                                })
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>

                </div>

                <div className="flex justify-end gap-3 mt-8">

                    <button
                        onClick={onCerrar}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={() => {
                            if(!formulario.id_comision_asignatura){
                                setAlerta({
                                    tipo: "warning",
                                    titulo: "Campo Obligatorio",
                                    mensaje: "Debe seleccionar una comisión"
                                });
                                return;
                            }
                            if(!formulario.titulo.trim()){
                                setAlerta({
                                    tipo: "warning",
                                    titulo: "Campo Obligatorio",
                                    mensaje: "Debe ingresar un título"
                                });
                                return;
                            }
                            if(!formulario.fecha){
                                setAlerta({
                                    tipo: "warning",
                                    titulo: "Campo Obligatorio",
                                    mensaje: "Debe seleccionar una fecha"
                                });
                                return;
                            }
                            if(!formulario.puntaje_maximo){
                                setAlerta({
                                    tipo: "warning",
                                    titulo: "Campo Obligatorio",
                                    mensaje: "Debe ingresar un puntaje máximo"
                                });
                                return;
                            }
                            if(formulario.puntaje_maximo > 100){
                                setAlerta({
                                    tipo: "warning",
                                    titulo: "Puntaje invalido",
                                    mensaje: "El puntaje maximo no puede superar los 100"
                                });
                                return;
                            }
                            setAlerta(null);
                            onGuardar(formulario);
                        }}
                        className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white"
                    >
                        {evaluacion ? "Guardar cambios" : "Crear evaluación"}
                    </button>

                </div>

            </div>

        </div>

    );

}