import { useEffect, useState } from "react";
import EvaluacionesTable from "../components/evaluaciones/EvaluacionTable";
import EvaluacionModal from "../components/evaluaciones/EvaluacionModal";
import EliminarEvaluacionModal from "../components/evaluaciones/EliminarEvaluacionModal";
import Alert from "../components/Alert";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getEvaluaciones, registrarEvaluacion, modificarEvaluacion, borrarEvaluacion } from "../Services/evaluacionesAdminService";
import { obtenerMisEvaluacionesPlano } from "../Services/evaluacionesAlumnoService";
import { getComisiones } from "../mocks/comisionesMock";
import useAuth from "../auth/hooks/useAuth";
//gestión de evaluaciones: vista para el alumno: solo lectura, muestra su propia asistencia en cada comisión
//  en la que está inscripto.
//vista para el personal (admin, profesor, etc): elijo una comisión y veo/cargo la asistencia de
//  todos los alumnos de una clase.

const ID_LEGAJO_ALUMNO_MOCK = 1;

export default function GestionEvaluaciones() {
    const { user: usuario, hasPermission, hasRole } = useAuth();
    const esAlumno = hasRole("Alumno");

    if (esAlumno) {
        return <VistaAlumno idLegajo={ID_LEGAJO_ALUMNO_MOCK} />;
    }

    return (
        <VistaPersonal
            puedeCrear={hasPermission(inscripcion.evaluaciones.crear)}
            puedeActualizar={hasPermission(inscripcion.evaluaciones.actualizar)}
            puedeEliminar={hasPermission(inscripcion.evaluaciones.eliminar)}
        />
    );
}

function VistaAlumno({ idLegajo }) {
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [filtroMateria, setFiltroMateria] = useState("");
    const [filtroComision, setFiltroComision] = useState("");
    const [filtroDocente, setFiltroDocente] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");

    useEffect(() => {
        async function cargar() {
            setCargando(true);
            setError(null);
            try {
                setEvaluaciones(await obtenerMisEvaluacionesPlano(idLegajo));
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar tus evaluaciones.");
            } finally {
                setCargando(false);
            }
        }
        cargar();
    }, [idLegajo]);

    const evaluacionesFiltradas = evaluaciones.filter((evaluacion) => {
        if (filtroMateria && evaluacion.materia !== filtroMateria) return false;
        if (filtroComision && evaluacion.codigo !== filtroComision) return false;
        if (filtroDocente && evaluacion.docente !== filtroDocente) return false;
        if (filtroTipo && evaluacion.tipo !== filtroTipo) return false;
        return true;
    });

    function limpiarFiltros() {
        setFiltroMateria("");
        setFiltroComision("");
        setFiltroDocente("");
        setFiltroTipo("");
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

            {error && (
                <Alert tipo="error" titulo="Error" mensaje={error} onCerrar={() => setError(null)} />
            )}

            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Mis evaluaciones</h1>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                    Evaluaciones de las comisiones en las que estás inscripto.
                </p>
            </div>

            {cargando ? (
                <p className="text-sm text-gray-400">Cargando...</p>
            ) : (
                <EvaluacionesTable
                    evaluaciones={evaluacionesFiltradas}

                    filtroMateria={filtroMateria}
                    setFiltroMateria={setFiltroMateria}

                    filtroComision={filtroComision}
                    setFiltroComision={setFiltroComision}

                    filtroDocente={filtroDocente}
                    setFiltroDocente={setFiltroDocente}

                    filtroTipo={filtroTipo}
                    setFiltroTipo={setFiltroTipo}

                    soloLectura
                />
            )}
        </div>
    );
}

function VistaPersonal({ puedeCrear, puedeActualizar, puedeEliminar }) {

    const [evaluaciones, setEvaluaciones] = useState([]);

    const [mostrarModal, setMostrarModal] = useState(false);

    const [evaluacionSeleccionada, setEvaluacionSeleccionada] = useState(null);

    const [mostrarEliminar, setMostrarEliminar] = useState(false);

    const [comisiones, setComisiones] = useState([]);

    const [error, setError] = useState(null);

    const [filtroMateria, setFiltroMateria] = useState("");
    const [filtroComision, setFiltroComision] = useState("");
    const [filtroDocente, setFiltroDocente] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");

    const puedeGestionar = puedeCrear || puedeActualizar || puedeEliminar;

    useEffect(() => {
        cargarEvaluaciones();
        cargarComisiones();
    }, []);

    async function cargarEvaluaciones() {

        try {
            const resultado = await getEvaluaciones();
            setEvaluaciones(resultado);
        } catch (error) {
            console.error(error);
            setError("No se pudieron cargar las evaluaciones.");
        }

    }

    async function cargarComisiones() {

        try {
            const resultado = await getComisiones();
            setComisiones(resultado.data);
        } catch (error) {
            console.error(error);
            setError("No se pudieron cargar las comisiones.");
        }

    }

    const evaluacionesFiltradas = evaluaciones.filter((evaluacion) => {

        if (filtroMateria && evaluacion.materia !== filtroMateria) return false;
        if (filtroComision && evaluacion.codigo !== filtroComision) return false;
        if (filtroDocente && evaluacion.docente !== filtroDocente) return false;
        if (filtroTipo && evaluacion.tipo !== filtroTipo) return false;

        return true;
    });

    function limpiarFiltros() {
        setFiltroMateria("");
        setFiltroComision("");
        setFiltroDocente("");
        setFiltroTipo("");
    }

    async function abrirModalEditar(evaluacion) {
        setEvaluacionSeleccionada(evaluacion);
        setMostrarModal(true);
    }

    function abrirModalEliminar(evaluacion) {
        setEvaluacionSeleccionada(evaluacion);
        setMostrarEliminar(true);
    }

    function nuevaEvaluacion() {
        setEvaluacionSeleccionada(null);
        setMostrarModal(true);
    }

    async function confirmarEliminar(evaluacion) {
        try {

            await borrarEvaluacion(evaluacion.id);

            setMostrarEliminar(false);
            setEvaluacionSeleccionada(null);

            await cargarEvaluaciones();

        } catch (error) {
            console.error(error);
            setError("No se pudo eliminar la evaluación.");
        }

    }

    async function guardarEvaluacion(datos) {

        try {

            if (evaluacionSeleccionada) {

                await modificarEvaluacion(
                    evaluacionSeleccionada.id,
                    datos
                );

            } else {

                await registrarEvaluacion(datos);

            }

            setMostrarModal(false);
            setEvaluacionSeleccionada(null);

            await cargarEvaluaciones();

        } catch (error) {
            console.error(error);
            setError(
                evaluacionSeleccionada
                    ? "No se pudo actualizar la evaluación."
                    : "No se pudo crear la evaluación."
            );
        }

    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

            {error && (
                <Alert tipo="error" titulo="Error" mensaje={error} onCerrar={() => setError(null)} />
            )}

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        {puedeGestionar ? "Gestión de Evaluaciones" : "Evaluaciones"}
                    </h1>

                    <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        {puedeGestionar
                            ? "Crear, editar y eliminar evaluaciones (parciales, trabajos prácticos y finales)."
                            : "Consulta de evaluaciones de todas las comisiones."}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">

                    <button
                        onClick={limpiarFiltros}
                        className="flex-1 sm:flex-none rounded-lg border border-gray-300 px-4 py-2.5 sm:py-3 hover:bg-gray-100 whitespace-nowrap"
                    >
                        Limpiar filtros
                    </button>

                    {puedeCrear && (
                        <button
                            onClick={nuevaEvaluacion}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg bg-red-700 px-4 py-2.5 sm:py-3 text-white hover:bg-red-800 transition whitespace-nowrap"
                        >
                            <PlusIcon className="h-5 w-5 shrink-0" />
                            Nueva Evaluación
                        </button>
                    )}

                </div>

            </div>

            <EvaluacionesTable
                evaluaciones={evaluacionesFiltradas}

                filtroMateria={filtroMateria}
                setFiltroMateria={setFiltroMateria}

                filtroComision={filtroComision}
                setFiltroComision={setFiltroComision}

                filtroDocente={filtroDocente}
                setFiltroDocente={setFiltroDocente}

                filtroTipo={filtroTipo}
                setFiltroTipo={setFiltroTipo}

                onEditar={abrirModalEditar}
                onEliminar={abrirModalEliminar}
                soloLectura={!puedeActualizar && !puedeEliminar}
            />

            {(puedeCrear || puedeActualizar) && (
                <EvaluacionModal
                    abierto={mostrarModal}
                    evaluacion={evaluacionSeleccionada}
                    comisiones={comisiones}
                    onCerrar={() => setMostrarModal(false)}
                    onGuardar={guardarEvaluacion}
                />
            )}

            {puedeEliminar && (
                <EliminarEvaluacionModal
                    abierto={mostrarEliminar}
                    evaluacion={evaluacionSeleccionada}
                    onCerrar={() => setMostrarEliminar(false)}
                    onConfirmar={confirmarEliminar}
                />
            )}

        </div>
    );
}