// Pantalla de administración de inscripciones.
// Agrupa las inscripciones por el estado real que devuelve el backend.

import {
    useEffect,
    useState,
    useMemo
} from "react";

import StatsAdminCards
    from "../components/inscripciones/StatsAdminCards";

import FiltrosInscripciones
    from "../components/inscripciones/FiltrosInscripciones";

import SeccionTabla
    from "../components/inscripciones/SeccionTabla";

import ModalEliminarInscripcion
    from "../components/inscripciones/ModalEliminarInscripcion";

import ModalValidarInscripcion
    from "../components/inscripciones/ModalValidarInscripcion";

import { getEstadosInscripcion }
    from "../api/catalogosApi";

import {
    obtenerInscripciones,
    actualizarSolicitud,
    eliminarSolicitud,
    obtenerComisiones
} from "../Services/inscripcionesAdminService";

// ============================================================
// CONFIGURACIÓN VISUAL
// ============================================================

const CONFIG_ESTADOS = {
    Aceptada: {
        titulo: "Inscripciones aceptadas",
        icono: "✓",
        colorBadge: "bg-green-500",
        orden: 1,
    },

    Pendiente: {
        titulo: "Inscripciones pendientes de validar",
        icono: "⊙",
        colorBadge: "bg-yellow-500",
        orden: 2,
    },

    Rechazada: {
        titulo: "Inscripciones rechazadas",
        icono: "✕",
        colorBadge: "bg-red-500",
        orden: 3,
    },

    Cancelada: {
        titulo: "Inscripciones canceladas",
        icono: "⊘",
        colorBadge: "bg-orange-500",
        orden: 4,
    },

    Finalizada: {
        titulo: "Inscripciones finalizadas",
        icono: "✓",
        colorBadge: "bg-gray-500",
        orden: 5,
    },
};

function configDeEstado(estado) {
    return (
        CONFIG_ESTADOS[estado] ?? {
            titulo: `Estado: ${estado}`,
            icono: "•",
            colorBadge: "bg-gray-400",
            orden: 99,
        }
    );
}

// ============================================================
// COMPONENTE
// ============================================================

export default function InscripcionesAdmin() {
    const [inscripciones, setInscripciones] =
        useState([]);

    const [comisiones, setComisiones] =
        useState([]);

    const [error, setError] =
        useState(null);

    const [busqueda, setBusqueda] =
        useState("");

    const [filtroComision, setFiltroComision] =
        useState("");

    const [filtroEstado, setFiltroEstado] =
        useState("");

    const [modalValidar, setModalValidar] =
        useState(false);

    const [modalEliminar, setModalEliminar] =
        useState(false);

    const [
        inscripcionSeleccionada,
        setInscripcionSeleccionada
    ] = useState(null);

    const [cargando, setCargando] =
        useState(true);

    const [estadosInscripcion, setEstadosInscripcion] =
        useState([]);

    // ========================================================
    // CARGA
    // ========================================================

    useEffect(() => {
        cargarDatos();
    }, []);

    async function cargarDatos() {
        setCargando(true);

        try {
            const [
                listaInscripciones,
                listaComisiones,
                listaEstados
            ] = await Promise.all([
                obtenerInscripciones(),
                obtenerComisiones(),
                getEstadosInscripcion()
            ]);

            setInscripciones(listaInscripciones);
            setComisiones(listaComisiones);
            setEstadosInscripcion(listaEstados);

        } catch (err) {
            setError(err.message);

        } finally {
            setCargando(false);
        }
    }

    // ========================================================
    // FILTROS
    // ========================================================

    const filtradas = useMemo(
        () =>
            inscripciones.filter((inscripcion) => {
                const termino =
                    busqueda.trim().toUpperCase();

                const idBusqueda =
                    termino.startsWith("INS-")
                        ? termino.replace("INS-", "")
                        : termino;

                const matchBusqueda =
                    termino === "" ||
                    inscripcion.alumno
                        ?.toUpperCase()
                        .includes(termino) ||
                    String(inscripcion.id_legajo)
                        .includes(idBusqueda) ||
                    String(inscripcion.id)
                        .includes(idBusqueda);

                const matchComision =
                    filtroComision === "" ||
                    inscripcion.id_comision_asignatura ===
                    parseInt(filtroComision);

                const matchEstado =
                    filtroEstado === "" ||
                    inscripcion.id_estado ===
                    Number(filtroEstado);

                return (
                    matchBusqueda &&
                    matchComision &&
                    matchEstado
                );
            }),
        [
            inscripciones,
            busqueda,
            filtroComision,
            filtroEstado
        ]
    );

    // ========================================================
    // AGRUPACIÓN
    // ========================================================

    const grupos = useMemo(() => {
        const map = {};

        for (const inscripcion of filtradas) {
            const key =
                inscripcion.estado ??
                "Sin estado";

            if (!map[key]) {
                map[key] = [];
            }

            map[key].push(inscripcion);
        }

        return Object.entries(map).sort(
            ([estadoA], [estadoB]) => {
                const ordenA =
                    configDeEstado(estadoA).orden;

                const ordenB =
                    configDeEstado(estadoB).orden;

                return ordenA - ordenB;
            }
        );
    }, [filtradas]);

    // ========================================================
    // MODALES
    // ========================================================

    function abrirModalValidar(inscripcion) {
        setInscripcionSeleccionada(inscripcion);
        setModalValidar(true);
    }

    function abrirModalEliminar(inscripcion) {
        setInscripcionSeleccionada(inscripcion);
        setModalEliminar(true);
    }

    function cerrarModalValidar() {
        setModalValidar(false);
        setInscripcionSeleccionada(null);
    }

    function cerrarModalEliminar() {
        setModalEliminar(false);
        setInscripcionSeleccionada(null);
    }

    // ========================================================
    // ACTUALIZAR
    // ========================================================

    async function guardarCambios(datos) {
        try {
            await actualizarSolicitud(
                inscripcionSeleccionada.id,
                datos
            );

            cerrarModalValidar();

            await cargarDatos();

        } catch (err) {
            setError(err.message);
        }
    }

    // ========================================================
    // ELIMINAR
    // ========================================================

    async function confirmarEliminar() {
        try {
            await eliminarSolicitud(
                inscripcionSeleccionada.id
            );

            cerrarModalEliminar();

            await cargarDatos();

        } catch (err) {
            setError(err.message);
        }
    }

    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">

            <h1 className="text-2xl font-bold text-gray-800">
                Gestionar inscripciones
            </h1>

            <p className="text-sm text-gray-500 mb-6">
                Alta, baja y modificación de inscripciones
                de integrantes a cursos y actividades.
            </p>

            {error && (
                <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <StatsAdminCards
                inscripciones={inscripciones}
                comisiones={comisiones}
                estadosInscripcion={estadosInscripcion}
            />

            <FiltrosInscripciones
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                filtroComision={filtroComision}
                setFiltroComision={setFiltroComision}
                filtroEstado={filtroEstado}
                setFiltroEstado={setFiltroEstado}
                comisiones={comisiones}
                estadosInscripcion={estadosInscripcion}
                onLimpiar={() => {
                    setBusqueda("");
                    setFiltroComision("");
                    setFiltroEstado("");
                }}
            />

            {cargando && (
                <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
                    Cargando inscripciones...
                </div>
            )}

            {!cargando &&
                inscripciones.length === 0 && (
                    <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
                        No hay inscripciones cargadas todavía.
                    </div>
                )}

            {!cargando &&
                inscripciones.length > 0 &&
                filtradas.length === 0 && (
                    <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
                        No hay inscripciones que coincidan
                        con los filtros.
                    </div>
                )}

            {!cargando &&
                grupos.map(([estado, items]) => {
                    const config =
                        configDeEstado(estado);

                    return (
                        <SeccionTabla
                            key={estado}
                            titulo={config.titulo}
                            icono={config.icono}
                            items={items}
                            colorBadge={config.colorBadge}
                            estadosInscripcion={estadosInscripcion}
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
                estadosInscripcion={estadosInscripcion}
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