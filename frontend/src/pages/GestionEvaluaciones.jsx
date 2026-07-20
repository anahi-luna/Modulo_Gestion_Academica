// Vista para personal: gestión completa de evaluaciones (crear, editar, eliminar).
// Vista para alumno: solo consulta de sus propias evaluaciones (solo lectura).
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

            {/* Título en columna en mobile, en fila desde sm. Botones con
                flex-wrap y flex-1 para que no se salgan del margen en
                pantallas angostas. */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Gestión de Evaluaciones
                    </h1>

                    <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        Crear, editar y eliminar evaluaciones (parciales, TPs y finales).
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">

                    <button
                        onClick={limpiarFiltros}
                        className="flex-1 sm:flex-none rounded-lg border border-gray-300 px-4 py-2.5 sm:py-3 hover:bg-gray-100 whitespace-nowrap"
                    >
                        Limpiar filtros
                    </button>

                    <button
                        onClick={nuevaEvaluacion}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg bg-red-700 px-4 py-2.5 sm:py-3 text-white hover:bg-red-800 transition whitespace-nowrap"
                    >
                        <PlusIcon className="h-5 w-5 shrink-0" />
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
