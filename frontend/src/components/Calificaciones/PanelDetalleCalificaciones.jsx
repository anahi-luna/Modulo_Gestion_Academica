import EvaluacionSelect from "./EvaluacionSelect";
import EstadisticaCard from "../Asistencia/EstadisticaCard";
import CalificacionTabla from "./CalificacionTabla";
import { useNavigate } from "react-router-dom";
import { AcademicCapIcon, CalendarDaysIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { getEvaluaciones } from "../../Services/evaluacionesAdminService";
import { obtenerCalificacionesPorEvaluacion, registrarCalificacionesService } from "../../Services/calificacionesAdminService";
import { obtenerInscripcionesPorComision } from "../../Services/inscripcionesAdminService";

export default function PanelDetalleCalificaciones({ idComision }) {
    const [evaluacionSeleccionada, setEvaluacionSeleccionada] = useState(null);
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [calificaciones, setCalificaciones] = useState([]);
    const [guardando, setGuardando] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function cargarEvaluaciones() {
            try {
                const resultado = await getEvaluaciones(idComision);
                setEvaluaciones(resultado);
                if (resultado.length > 0) {
                    setEvaluacionSeleccionada(resultado[0]);
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (idComision) {
            cargarEvaluaciones();
        }
    }, [idComision]);

    useEffect(() => {
        if (evaluacionSeleccionada?.id) {
            cargarCalificaciones();
        } else {
            setCalificaciones([]);
        }
    }, [evaluacionSeleccionada?.id]);

    async function cargarCalificaciones() {
        try {
            const notas = await obtenerCalificacionesPorEvaluacion(evaluacionSeleccionada.id);
            if (notas.length > 0) {
                setCalificaciones(notas);
            } else {
                const inscriptos = await obtenerInscripcionesPorComision(idComision);
                setCalificaciones(
                    inscriptos.map((i) => ({
                        id_legajo: i.id_legajo,
                        alumno: i.alumno,
                        id_inscripcion: i.id_inscripcion,
                        id_comision: i.id_comision,
                        nota: null,
                        observacion: "",
                    }))
                );
            }
        } catch (error) {
            console.error(error);
        }
    }

    function cambiarNota(idInscripcion, valor) {
        setCalificaciones(prev =>
            prev.map(c =>
                c.id_inscripcion === idInscripcion
                    ? { ...c, nota: valor === "" ? null : valor }
                    : c
            )
        );
    }

    function cambiarObservacion(idInscripcion, valor) {
        setCalificaciones(prev =>
            prev.map(c =>
                c.id_inscripcion === idInscripcion
                    ? { ...c, observacion: valor }
                    : c
            )
        );
    }

    async function guardarCalificaciones() {
        const datos = {
            id_evaluacion: evaluacionSeleccionada.id,
            calificaciones: calificaciones.map(c => ({
                id_inscripcion: c.id_inscripcion,
                nota: c.nota === "" || c.nota === null ? null : Number(c.nota),
                observacion: c.observacion,
            })),
        };
        try {
            setGuardando(true);
            await registrarCalificacionesService(datos);
            await cargarCalificaciones();
        } catch (error) {
            console.error(error);
        } finally {
            setGuardando(false);
        }
    }

    const inscriptos = calificaciones.length;
    const conNota = calificaciones.filter(
        c => c.nota !== null && c.nota !== undefined && c.nota !== ""
    );
    const aprobados = conNota.filter(c => Number(c.nota) >= 6).length;
    const desaprobados = conNota.filter(c => Number(c.nota) < 6).length;
    const promedio = conNota.length > 0
        ? (conNota.reduce((acc, c) => acc + Number(c.nota), 0) / conNota.length).toFixed(1)
        : "-";

    return (
        <div className="lg:col-span-9 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

            <div className="p-4 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

                    <div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 break-words">
                            {evaluacionSeleccionada?.titulo}
                        </h2>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 sm:mt-4 text-gray-500 text-sm">
                            <div className="flex items-center gap-2">
                                <AcademicCapIcon className="h-5 w-5 text-red-600 shrink-0" />
                                <span>{evaluacionSeleccionada?.tipo}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarDaysIcon className="h-5 w-5 text-red-600 shrink-0" />
                                <span>{evaluacionSeleccionada?.fecha}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/GestionEvaluaciones")}
                        className="flex items-center gap-2 self-start sm:self-auto border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 transition shrink-0"
                    >
                        <PencilSquareIcon className="h-5 w-5" />
                        Gestionar Evaluaciones
                    </button>

                </div>
            </div>

            <EvaluacionSelect
                evaluaciones={evaluaciones}
                evaluacionSeleccionada={evaluacionSeleccionada}
                setEvaluacionSeleccionada={setEvaluacionSeleccionada}
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 px-4 sm:px-8 py-4 sm:py-6">
                <EstadisticaCard titulo="Inscriptos" cantidad={inscriptos} />
                <EstadisticaCard titulo="Aprobados" cantidad={aprobados} color="green" />
                <EstadisticaCard titulo="Desaprobados" cantidad={desaprobados} color="red" />
                <EstadisticaCard titulo="Promedio" cantidad={promedio} />
            </div>

            <CalificacionTabla
                calificaciones={calificaciones}
                onCambiarNota={cambiarNota}
                onCambiarObservacion={cambiarObservacion}
            />

            <div className="px-4 sm:px-6 pb-6">
                <button
                    onClick={guardarCalificaciones}
                    disabled={guardando || !evaluacionSeleccionada}
                    className="w-full sm:w-auto bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white rounded-lg px-5 py-2 font-medium"
                >
                    {guardando ? "Guardando..." : "Guardar calificaciones"}
                </button>
            </div>

        </div>
    );
}