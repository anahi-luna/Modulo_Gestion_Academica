// Pantalla de administración de inscripciones.
// Agrupa las inscripciones por el estado real que devuelve el back,
// sin hardcodear strings específicos. Así si el back cambia el nombre
// del estado, la tabla sigue mostrando algo en vez de quedar en blanco.

import { useEffect, useState, useMemo } from "react";

import StatsAdminCards from "../components/inscripciones/StatsAdminCards";
import FiltrosInscripciones from "../components/inscripciones/FiltrosInscripciones";
import SeccionTabla from "../components/inscripciones/SeccionTabla";
import ModalEliminarInscripcion from "../components/inscripciones/ModalEliminarInscripcion";
import ModalValidarInscripcion from "../components/inscripciones/ModalValidarInscripcion";

import {
    obtenerInscripciones,
    actualizarSolicitud,
    eliminarSolicitud,
    obtenerComisiones
} from "../Services/inscripcionesAdminService";

// configuración visual por estado. Cubro los dos nombres posibles para
// "pendiente" porque el back podría devolver cualquiera de los dos.
// Si el back devuelve otro estado que no esté acá, cae en el default.
const CONFIG_ESTADOS = {
    "Aceptada": {
        titulo: "Inscripciones aceptadas",
        icono: "✓",
        colorBadge: "bg-green-500",
        orden: 1,
    },
    "Pendiente": {
        titulo: "Inscripciones pendientes de validar",
        icono: "⊙",
        colorBadge: "bg-yellow-500",
        orden: 2,
    },
    "Pendiente de validación": {
        titulo: "Inscripciones pendientes de validar",
        icono: "⊙",
        colorBadge: "bg-yellow-500",
        orden: 2,
    },
    "Rechazada": {
        titulo: "Inscripciones rechazadas",
        icono: "✕",
        colorBadge: "bg-red-500",
        orden: 3,
    },
};

function configDeEstado(estado) {
    return CONFIG_ESTADOS[estado] ?? {
        titulo: `Estado: ${estado}`,
        colorBadge: "bg-gray-400",
        orden: 99,
    };
}

export default function InscripcionesAdmin() {

    const [inscripciones, setInscripciones] = useState([]);
    const [comisiones, setComisiones] = useState([]);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState("");
    const [filtroComision, setFiltroComision] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [modalValidar, setModalValidar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => { cargarDatos(); }, []);

    async function cargarDatos() {
        setCargando(true);
        try {
            setInscripciones(await obtenerInscripciones());
            setComisiones(await obtenerComisiones());
        } catch (err) {
            setError(err.message);
        } finally {
            setCargando(false);
        }
    }

    const filtradas = useMemo(() => inscripciones.filter(ins => {
        const termino = busqueda.trim().toUpperCase();

        const idBusqueda = termino.startsWith("INS-")
            ? termino.replace("INS-", "")
            : termino;

        const matchBusqueda =
            termino === "" ||
            ins.alumno?.toLowerCase().includes(termino.toLowerCase()) ||
            String(ins.id_legajo).includes(idBusqueda) ||
            String(ins.id).includes(idBusqueda);

        const matchComision =
            filtroComision === "" ||
            ins.id_comision_asignatura === parseInt(filtroComision);

        const matchEstado =
            filtroEstado === "" ||
            ins.estado === filtroEstado;

        return matchBusqueda && matchComision && matchEstado;
    }), [inscripciones, busqueda, filtroComision, filtroEstado]);

    // agrupa por estado real del back, sin asumir qué strings va a devolver
    const grupos = useMemo(() => {
        const map = {};
        for (const ins of filtradas) {
            const key = ins.estado ?? "Sin estado";
            if (!map[key]) map[key] = [];
            map[key].push(ins);
        }
        // ordena los grupos según la config (aceptadas primero, pendientes, rechazadas, otros)
        return Object.entries(map).sort(([a], [b]) => {
            const oa = configDeEstado(a).orden;
            const ob = configDeEstado(b).orden;
            return oa - ob;
        });
    }, [filtradas]);

    function abrirModalValidar(ins) { setInscripcionSeleccionada(ins); setModalValidar(true); }
    function abrirModalEliminar(ins) { setInscripcionSeleccionada(ins); setModalEliminar(true); }
    function cerrarModalValidar() { setModalValidar(false); setInscripcionSeleccionada(null); }
    function cerrarModalEliminar() { setModalEliminar(false); setInscripcionSeleccionada(null); }

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

            {cargando && (
                <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
                    Cargando inscripciones...
                </div>
            )}

            {!cargando && inscripciones.length === 0 && (
                // no hay ninguna inscripción en el sistema todavía
                <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
                    No hay inscripciones cargadas todavía.
                </div>
            )}

            {!cargando && inscripciones.length > 0 && filtradas.length === 0 && (
                // hay inscripciones pero ninguna coincide con los filtros activos
                <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
                    No hay inscripciones que coincidan con los filtros.
                </div>
            )}

            {/* una sección por cada estado que venga del back, en el orden definido */}
            {!cargando && grupos.map(([estado, items]) => {
                const cfg = configDeEstado(estado);
                return (
                    <SeccionTabla
                        key={estado}
                        titulo={cfg.titulo}
                        icono={cfg.icono}
                        items={items}
                        colorBadge={cfg.colorBadge}
                        onValidar={abrirModalValidar}
                        onEliminar={abrirModalEliminar}
                    />
                );
            })}

            <ModalValidarInscripcion
                abierto={modalValidar}
                inscripcion={inscripcionSeleccionada}
                onCerrar={cerrarModalValidar}
                onGuardar={guardarCambios}
                comisiones={comisiones}
            />
            <ModalEliminarInscripcion
                abierto={modalEliminar}
                inscripcion={inscripcionSeleccionada}
                onCerrar={cerrarModalEliminar}
                onConfirmar={confirmarEliminar}
            />
        </div>
    );
}