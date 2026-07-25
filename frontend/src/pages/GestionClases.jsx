// Vista para personal: gestión completa de clases (crear, editar, eliminar).
// Vista para alumno: solo consulta de SUS propias clases (solo lectura).
import { useEffect, useState } from "react";
import ClasesTable from "../components/clases/ClaseTable";
import ModalClase from "../components/clases/ClaseModal";
import EliminarClaseModal from "../components/clases/EliminarClaseModal";
import Alert from "../components/Alert";
import { PlusIcon } from "@heroicons/react/24/outline";
import { getClases, registrarClase, modificarClase, borrarClase } from "../Services/clasesAdminService";
import { obtenerMisClasesPlano } from "../Services/clasesAlumnoService";
import { getComisiones } from "../mocks/comisionesMock";
import useAuth from "../auth/hooks/useAuth";
import { ACCIONES } from "../config/modulos";

const ID_LEGAJO_ALUMNO_MOCK = 1; 

export default function GestionClases() {
    const { user: usuario, hasPermission, hasRole } = useAuth();
    const esAlumno = hasRole("Alumno");

    if (esAlumno) {
        return <VistaAlumno idLegajo={ID_LEGAJO_ALUMNO_MOCK} />;
    }

    return (
        <VistaPersonal
            puedeCrear={hasPermission(inscripcion.clases.crear)}
            puedeActualizar={hasPermission(inscripcion.clases.actualizar)}
            puedeEliminar={hasPermission(inscripcion.clases.eliminar)}
        />
    );
}

// Vista de solo lectura para el alumno: solo las clases de SUS
// comisiones, sin ningún botón de acción.
function VistaAlumno({ idLegajo }) {
    const [clases, setClases] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [filtroMateria, setFiltroMateria] = useState("");
    const [filtroComision, setFiltroComision] = useState("");
    const [filtroDocente, setFiltroDocente] = useState("");
    const [filtroFecha, setFiltroFecha] = useState("");
    const [filtroTema, setFiltroTema] = useState("");

    useEffect(() => {
        async function cargar() {
            setCargando(true);
            setError(null);
            try {
                setClases(await obtenerMisClasesPlano(idLegajo));
            } catch (err) {
                console.error(err);
                setError("No se pudieron cargar tus clases.");
            } finally {
                setCargando(false);
            }
        }
        cargar();
    }, [idLegajo]);

    const clasesFiltradas = clases.filter((clase) => {
        if (filtroMateria && clase.materia !== filtroMateria) return false;
        if (filtroComision && clase.codigo !== filtroComision) return false;
        if (filtroDocente && clase.docente !== filtroDocente) return false;
        if (filtroFecha && clase.fecha !== filtroFecha) return false;
        if (filtroTema && clase.tema !== filtroTema) return false;
        return true;
    });

    function limpiarFiltros() {
        setFiltroMateria("");
        setFiltroComision("");
        setFiltroDocente("");
        setFiltroFecha("");
        setFiltroTema("");
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

            {error && (
                <Alert tipo="error" titulo="Error" mensaje={error} onCerrar={() => setError(null)} />
            )}

            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Mis clases</h1>
                <p className="text-gray-500 mt-1 text-sm sm:text-base">
                    Clases de las comisiones en las que estás inscripto.
                </p>
            </div>

            {cargando ? (
                <p className="text-sm text-gray-400">Cargando...</p>
            ) : (
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

                    filtroTema={filtroTema}
                    setFiltroTema={setFiltroTema}

                    soloLectura
                />
            )}
        </div>
    );
}

// Vista de gestión para personal (admin, docente, etc.)
function VistaPersonal({ puedeCrear, puedeActualizar, puedeEliminar }) {

    const [clases, setClases] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [claseSeleccionada, setClaseSeleccionada] = useState(null);
    const [mostrarEliminar, setMostrarEliminar] = useState(false);
    const [comisiones, setComisiones] = useState([]);
    const [error, setError] = useState(null);
    const [filtroMateria, setFiltroMateria] = useState("");
    const [filtroComision, setFiltroComision] = useState("");
    const [filtroDocente, setFiltroDocente] = useState("");
    const [filtroFecha, setFiltroFecha] = useState("");
    const [filtroTema, setFiltroTema] = useState("");

    // Puede editar/eliminar/crear solo si tiene el permiso puntual de
    // cada acción (antes se mostraban siempre, sin chequear nada).
    const puedeGestionar = puedeCrear || puedeActualizar || puedeEliminar;

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
        if (filtroTema && clase.tema !== filtroTema) return false;

        return true;
    });

    function limpiarFiltros() {
        setFiltroMateria("");
        setFiltroComision("");
        setFiltroDocente("");
        setFiltroFecha("");
        setFiltroTema("");
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
                        {puedeGestionar ? "Gestión de Clases" : "Clases"}
                    </h1>

                    <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        {puedeGestionar
                            ? "Crear, editar y eliminar clases."
                            : "Consulta de clases de todas las comisiones."}
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
                            onClick={nuevaClase}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-lg bg-red-700 px-4 py-2.5 sm:py-3 text-white hover:bg-red-800 transition whitespace-nowrap"
                        >
                            <PlusIcon className="h-5 w-5 shrink-0" />
                            Nueva Clase
                        </button>
                    )}

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

                filtroTema={filtroTema}
                setFiltroTema={setFiltroTema}

                onEditar={abrirModalEditar}
                onEliminar={abrirModalEliminar}
                // Si no puede ni editar ni eliminar, la tabla oculta la
                // columna/botones de acción por completo (aunque pueda
                // crear clases nuevas por separado).
                soloLectura={!puedeActualizar && !puedeEliminar}
            />

            {/* Modal para crear o editar */}
            {(puedeCrear || puedeActualizar) && (
                <ModalClase
                    abierto={mostrarModal}
                    clase={claseSeleccionada}
                    comisiones={comisiones}
                    onCerrar={() => setMostrarModal(false)}
                    onGuardar={guardarClase}
                />
            )}

            {/* Modal eliminar */}
            {puedeEliminar && (
                <EliminarClaseModal
                    abierto={mostrarEliminar}
                    clase={claseSeleccionada}
                    onCerrar={() => setMostrarEliminar(false)}
                    onConfirmar={confirmarEliminar}
                />
            )}
        </div>
    );
}