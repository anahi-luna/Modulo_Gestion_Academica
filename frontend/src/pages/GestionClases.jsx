import { useEffect, useState } from "react";
import TablaClases from "../components/Clases/TablaClases";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getComisiones } from "../mocks/comisionesMock";

export default function GestionClases() {

    const [clases, setClases] = useState([]);

    const [mostrarModal, setMostrarModal] = useState(false);

    const [filtroMateria, setFiltroMateria] = useState("");
    const [filtroComision, setFiltroComision] = useState("");
    const [filtroDocente, setFiltroDocente] = useState("");
    const [filtroFecha, setFiltroFecha] = useState("");
    const [filtroLugar, setFiltroLugar] = useState("");

    useEffect(() => {
        cargarClases();
    }, []);

    async function cargarClases() {
        const res = await getComisiones();
        setClases(res.data);
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
    function editarClase(clase){
        setClaseSeleccionada(clase);
        setMostrarModal(true);
    }

    function eliminarClase(clase){
        setClaseSeleccionada(clase);
        setMostrarEliminar(true);
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

                <div className="flex gap-3">

                    <button
                        onClick={limpiarFiltros}
                        className="rounded-lg border border-gray-300 px-4 py-3 hover:bg-gray-100"
                    >
                        Limpiar filtros
                    </button>

                    <button
                        onClick={() => setMostrarModal(true)}
                        className="flex items-center gap-2 rounded-lg bg-red-700 px-4 py-3 text-white hover:bg-red-800 transition"
                    >
                        <PlusIcon className="h-5 w-5" />
                        Nueva Clase
                    </button>

                </div>

            </div>

            <TablaClases
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
            />

        </div>
    );
}