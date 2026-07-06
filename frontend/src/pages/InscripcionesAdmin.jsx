// Pantalla de administración de inscripciones.
// Maneja el estado, los filtros y las acciones.
// La UI está dividida en componentes en components/inscripciones/.

import { useEffect, useState, useMemo } from "react";

import StatsAdminCards        from "../components/inscripciones/StatsAdminCards";
import FiltrosInscripciones   from "../components/inscripciones/FiltrosInscripciones";
import SeccionTabla           from "../components/inscripciones/SeccionTabla";
import ModalEliminarInscripcion from "../components/inscripciones/ModalEliminarInscripcion";
import ModalValidarInscripcion  from "../components/inscripciones/ModalValidarInscripcion";

import {
    obtenerInscripciones,
    actualizarSolicitud,
    eliminarSolicitud,
    obtenerComisiones
} from "../Services/inscripcionesAdminService";

export default function InscripcionesAdmin() {

    const [inscripciones, setInscripciones]               = useState([]);
    const [comisiones, setComisiones]                     = useState([]);
    const [error, setError]                               = useState(null);
    const [busqueda, setBusqueda]                         = useState("");
    const [filtroComision, setFiltroComision]             = useState("");
    const [filtroEstado, setFiltroEstado]                 = useState("");
    const [modalValidar, setModalValidar]                 = useState(false);
    const [modalEliminar, setModalEliminar]               = useState(false);
    const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState(null);

    useEffect(() => { cargarDatos(); }, []);

    async function cargarDatos() {
        try {
            setInscripciones(await obtenerInscripciones());
            setComisiones(await obtenerComisiones());
        } catch (err) {
            setError(err.message);
        }
    }

    const filtradas = useMemo(() => inscripciones.filter(ins => {
        const matchBusqueda =
            busqueda === "" ||
            ins.alumno.toLowerCase().includes(busqueda.toLowerCase()) ||
            String(ins.id_legajo).includes(busqueda) ||
            String(ins.id).includes(busqueda);
        const matchComision =
            filtroComision === "" ||
            ins.id_comision === parseInt(filtroComision);
        const matchEstado =
            filtroEstado === "" ||
            ins.estado === filtroEstado;
        return matchBusqueda && matchComision && matchEstado;
    }), [inscripciones, busqueda, filtroComision, filtroEstado]);

    function abrirModalValidar(ins)  { setInscripcionSeleccionada(ins); setModalValidar(true);  }
    function abrirModalEliminar(ins) { setInscripcionSeleccionada(ins); setModalEliminar(true); }
    function cerrarModalValidar()    { setModalValidar(false);  setInscripcionSeleccionada(null); }
    function cerrarModalEliminar()   { setModalEliminar(false); setInscripcionSeleccionada(null); }

    async function guardarCambios(datos) {
        try {
            await actualizarSolicitud(inscripcionSeleccionada.id, datos);
            cerrarModalValidar();
            cargarDatos();
        } catch (err) { setError(err.message); }
    }

    async function confirmarEliminar() {
        try {
            await eliminarSolicitud(inscripcionSeleccionada.id);
            cerrarModalEliminar();
            cargarDatos();
        } catch (err) { setError(err.message); }
    }

    const aceptadas = filtradas.filter(i => i.estado === "Aceptada");
    const pendientes = filtradas.filter(i => i.estado === "Pendiente");
    const rechazadas = filtradas.filter(i => i.estado === "Rechazada");

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">

            <h1 className="text-2xl font-bold text-gray-800">Gestionar inscripciones</h1>
            <p className="text-sm text-gray-500 mb-6">
                Alta, baja y modificación de inscripciones de integrantes a cursos y actividades.
            </p>

            {error && (
                <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <StatsAdminCards inscripciones={inscripciones} comisiones={comisiones} />

            <FiltrosInscripciones
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                filtroComision={filtroComision}
                setFiltroComision={setFiltroComision}
                filtroEstado={filtroEstado}
                setFiltroEstado={setFiltroEstado}
                comisiones={comisiones}
                onLimpiar={() => { setBusqueda(""); setFiltroComision(""); setFiltroEstado(""); }}
            />

            {aceptadas.length > 0 && (
                <SeccionTabla titulo="Inscripciones aceptadas" icono="✓"
                    items={aceptadas} colorBadge="bg-green-500"
                    onValidar={abrirModalValidar} onEliminar={abrirModalEliminar} />
            )}

            {pendientes.length > 0 && (
                <SeccionTabla titulo="Inscripciones pendientes de validar" icono="⊙"
                    items={pendientes} colorBadge="bg-yellow-500"
                    onValidar={abrirModalValidar} onEliminar={abrirModalEliminar} />
            )}

            {rechazadas.length > 0 && (
                <SeccionTabla titulo="Inscripciones rechazadas" icono="✕"
                    items={rechazadas} colorBadge="bg-red-500"
                    onValidar={abrirModalValidar} onEliminar={abrirModalEliminar} />
            )}

            {filtradas.length === 0 && (
                <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
                    No hay inscripciones que coincidan con los filtros.
                </div>
            )}

            <ModalValidarInscripcion
                abierto={modalValidar} inscripcion={inscripcionSeleccionada}
                onCerrar={cerrarModalValidar} onGuardar={guardarCambios}
                comisiones={comisiones}
            />
            <ModalEliminarInscripcion
                abierto={modalEliminar} inscripcion={inscripcionSeleccionada}
                onCerrar={cerrarModalEliminar} onConfirmar={confirmarEliminar}
            />
        </div>
    );
}