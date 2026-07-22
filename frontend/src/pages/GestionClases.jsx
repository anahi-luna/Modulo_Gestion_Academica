// Vista para personal: gestión completa de clases (crear, editar, eliminar).
// Vista para alumno: solo consulta de sus propias clases (solo lectura).
import { useEffect, useState } from "react";
import ClasesTable from "../components/clases/ClaseTable";
import ModalClase from "../components/clases/ClaseModal";
import EliminarClaseModal from "../components/clases/EliminarClaseModal";
import Alert from "../components/Alert";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getClases, registrarClase, modificarClase, borrarClase } from "../Services/clasesAdminService";
import { getComisiones } from "../mocks/comisionesMock";

export default function GestionClases() {

    const [clases, setClases] = useState([]);

    const [mostrarModal, setMostrarModal] = useState(false);

    const [claseSeleccionada, setClaseSeleccionada] = useState(null);

    const [mostrarEliminar, setMostrarEliminar] = useState(false);

    const [comisiones, setComisiones] = useState([]);

    // Antes, si fallaba cargar/crear/editar/borrar una clase, el único
    // rastro quedaba en la consola del navegador: el docente/admin no
    // se enteraba de que algo salió mal.
    const [error, setError] = useState(null);

    const [filtroMateria, setFiltroMateria] = useState("");
    const [filtroComision, setFiltroComision] = useState("");
    const [filtroDocente, setFiltroDocente] = useState("");
    const [filtroFecha, setFiltroFecha] = useState("");
    const [filtroLugar, setFiltroLugar] = useState("");

    useEffect(() => {
        cargarClases();

        cargarComisiones();
    }, []);

    async function cargarClases() {

        try {
            const resultado = await getClases();

            setClases(resultado);
        } catch (error) {

            console.error(error);
            setError("No se pudieron cargar las clases.");

        }

    }

    async function cargarComisiones(){

        // Antes esta función no tenía try/catch: si fallaba, quedaba
        // una promesa rechazada sin manejar (ni siquiera se logueaba).
        try {
            const resultado = await getComisiones();

            setComisiones(resultado.data);
        } catch (error) {
            console.error(error);
            setError("No se pudieron cargar las comisiones.");
        }

    }

    const clasesFiltradas = clases.filter((clase) => {

        if (filtroMateria && clase.materia !== filtroMateria) return false;
        if (filtroComision && clase.codigo !== filtroComision) return false;
        if (filtroDocente && clase.docente !== filtroDocente) return false;
        if (filtroFecha && clase.fecha !== filtroFecha) return false;
        if (filtroLugar && clase.lugar !== filtroLugar) return false;

        return true;
    });

    function limpiarFiltros() {
        setFiltroMateria("");
        setFiltroComision("");
        setFiltroDocente("");
        setFiltroFecha("");
        setFiltroLugar("");
    }

    async function abrirModalEditar(clase){

        try{

            setClaseSeleccionada(clase);

            setMostrarModal(true);

        }catch(error){

            console.error(error);

        }

    }

    function abrirModalEliminar(clase){
        setClaseSeleccionada(clase);
        setMostrarEliminar(true);
    }
    function nuevaClase() {

        setClaseSeleccionada(null);

        setMostrarModal(true);

    }

    async function confirmarEliminar(clase){
        try{

            await borrarClase(clase.id);

            setMostrarEliminar(false);

            setClaseSeleccionada(null);

            await cargarClases();

        }catch(error){
            console.error(error);
            setError("No se pudo eliminar la clase.");
        }

    }

   async function guardarClase(datos) {

        try {

            if (claseSeleccionada) {

                await modificarClase(
                    claseSeleccionada.id,
                    datos
                );

            } else {
                const {
                    estado,
                    ...datosCrear
                    
                }=datos;
                await registrarClase(datosCrear);

            }

            setMostrarModal(false);

            setClaseSeleccionada(null);

            await cargarClases();

        } catch (error) {

            console.error(error);
            setError(
                claseSeleccionada
                    ? "No se pudo actualizar la clase."
                    : "No se pudo crear la clase."
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
                        Gestión de Clases
                    </h1>

                    <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        Crear, editar y eliminar clases.
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
                        onClick={nuevaClase}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg bg-red-700 px-4 py-2.5 sm:py-3 text-white hover:bg-red-800 transition whitespace-nowrap"
                    >
                        <PlusIcon className="h-5 w-5 shrink-0" />
                        Nueva Clase
                    </button>

                </div>

            </div>

            {/* Tabla Clases */}
            <ClasesTable
                clases={clasesFiltradas}

                filtroMateria={filtroMateria}
                setFiltroMateria={setFiltroMateria}

                filtroComision={filtroComision}
                setFiltroComision={setFiltroComision}

                filtroDocente={filtroDocente}
                setFiltroDocente={setFiltroDocente}

                filtroFecha={filtroFecha}
                setFiltroFecha={setFiltroFecha}

                filtroLugar={filtroLugar}
                setFiltroLugar={setFiltroLugar}

                onEditar={abrirModalEditar}
                onEliminar={abrirModalEliminar}
            />

            {/* Modal para crear o editar */}
            <ModalClase
                abierto={mostrarModal}
                clase={claseSeleccionada}
                comisiones={comisiones}
                onCerrar={() => setMostrarModal(false)}
                onGuardar={guardarClase}
            />

            {/* Modal eliminar */}
            <EliminarClaseModal
                abierto={mostrarEliminar}
                clase={claseSeleccionada}
                onCerrar={() => setMostrarEliminar(false)}
                onConfirmar={confirmarEliminar}
            />
        </div>
    );
}