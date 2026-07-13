import { useEffect, useState } from "react";
import EvaluacionesTable from "../components/evaluaciones/EvaluacionTable";
import EvaluacionModal from "../components/evaluaciones/EvaluacionModal";
import EliminarEvaluacionModal from "../components/evaluaciones/EliminarEvaluacionModal";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getEvaluaciones, registrarEvaluacion, modificarEvaluacion, borrarEvaluacion } from "../Services/evaluacionesAdminService";
import { getComisiones } from "../mocks/comisionesMock";

export default function GestionEvaluaciones() {

    const [evaluaciones, setEvaluaciones] = useState([]);

    const [mostrarModal, setMostrarModal] = useState(false);

    const [evaluacionSeleccionada, setEvaluacionSeleccionada] = useState(null);

    const [mostrarEliminar, setMostrarEliminar] = useState(false);

    const [comisiones, setComisiones] = useState([]);

    const [filtroMateria, setFiltroMateria] = useState("");
    const [filtroComision, setFiltroComision] = useState("");
    const [filtroDocente, setFiltroDocente] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");

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
        }

    }

    async function cargarComisiones() {

        const resultado = await getComisiones();
        setComisiones(resultado.data);

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

        try {
            setEvaluacionSeleccionada(evaluacion);
            setMostrarModal(true);
        } catch (error) {
            console.error(error);
        }

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
        }

    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">

            <div className="flex justify-between items-center mb-6">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Gestión de Evaluaciones
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Crear, editar y eliminar evaluaciones (parciales, TPs y finales).
                    </p>
                </div>

                <div className="flex gap-3">

                    <button
                        onClick={limpiarFiltros}
                        className="rounded-lg border border-gray-300 px-4 py-3 hover:bg-gray-100"
                    >
                        Limpiar filtros
                    </button>

                    <button
                        onClick={nuevaEvaluacion}
                        className="flex items-center gap-2 rounded-lg bg-red-700 px-4 py-3 text-white hover:bg-red-800 transition"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Nueva Evaluación
                    </button>

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
            />

            <EvaluacionModal
                abierto={mostrarModal}
                evaluacion={evaluacionSeleccionada}
                comisiones={comisiones}
                onCerrar={() => setMostrarModal(false)}
                onGuardar={guardarEvaluacion}
            />

            <EliminarEvaluacionModal
                abierto={mostrarEliminar}
                evaluacion={evaluacionSeleccionada}
                onCerrar={() => setMostrarEliminar(false)}
                onConfirmar={confirmarEliminar}
            />

        </div>
    );
}
