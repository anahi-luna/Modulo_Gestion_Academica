import { useEffect, useState } from "react";
import ClasesTable from "../components/Clases/ClaseTable";
import ModalClase from "../components/clases/ClaseModal";
import EliminarClaseModal from "../components/clases/EliminarClaseModal";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getClases, registrarClase, modificarClase, borrarClase } from "../Services/clasesAdminService";
import { getComisiones } from "../mocks/comisionesMock";

export default function GestionClases() {

    const [clases, setClases] = useState([]);

    const [mostrarModal, setMostrarModal] = useState(false);

    const [claseSeleccionada, setClaseSeleccionada] = useState(null);

    const [mostrarEliminar, setMostrarEliminar] = useState(false);

    const [comisiones, setComisiones] = useState([]);

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

        }

    }

    async function cargarComisiones(){

        const resultado = await getComisiones();

        setComisiones(resultado.data);

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

                await registrarClase(datos);

            }

            setMostrarModal(false);

            setClaseSeleccionada(null);

            await cargarClases();

        } catch (error) {

            console.error(error);

        }

    }
    return (
        <div className="max-w-7xl mx-auto px-6 py-8">

            <div className="flex justify-between items-center mb-6">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Gestión de Clases
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Crear, editar y eliminar clases.
                    </p>
                </div>
                
                {/* Botones limpiar filtro y nueva clase */}
                <div className="flex gap-3">

                    <button
                        onClick={limpiarFiltros}
                        className="rounded-lg border border-gray-300 px-4 py-3 hover:bg-gray-100"
                    >
                        Limpiar filtros
                    </button>

                    <button
                        onClick={nuevaClase}
                        className="flex items-center gap-2 rounded-lg bg-red-700 px-4 py-3 text-white hover:bg-red-800 transition"
                    >
                        <PlusIcon className="h-5 w-5" />
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