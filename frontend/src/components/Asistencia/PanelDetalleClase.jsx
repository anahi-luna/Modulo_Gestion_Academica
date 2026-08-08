import ClaseSelect from "./ClaseSelect";
import EstadisticaCard from "./EstadisticaCard";
import TablaAsistencia from "./AsistenciaTabla";
import HistorialAsistencias from "./HistorialAsistencias";

import { useNavigate } from "react-router-dom";
import {
    CalendarDaysIcon,
    ClockIcon,
    PencilSquareIcon
} from "@heroicons/react/24/outline";

import { useState, useEffect } from "react";

import {
    getClases
} from "../../Services/clasesAdminService";

import {
    obtenerAsistenciasPorClase,
    modificarAsistencia,
    registrarAsistenciaService,
    actualizarEstadoAutomaticamente,
    eliminarAsistenciasPorClase,
    obtenerHistorialPorComision,
    eliminarAsistenciaService
} from "../../Services/asistenciaAdminService";

import {
    obtenerInscripcionesPorComision
} from "../../Services/inscripcionesAdminService";

import { getComisiones } from "../../api/comisiones";

import {
    getEstadosAsistencia
} from "../../api/catalogosApi";

import Alert from "../Alert";


// Componente principal para mostrar el panel de detalle de una clase,
// incluyendo la selección de clase, estadísticas, tabla de asistencias y
// historial.
export default function PanelDetalleClase({
    idComision,
    idClaseInicial = null,
}) {

    const [claseSeleccionada, setClaseSeleccionada] = useState(null);

    const [clases, setClases] = useState([]);

    const [asistencias, setAsistencias] = useState([]);

    const [modoEdicion, setModoEdicion] = useState(false);

    const [historial, setHistorial] = useState([]);

    const [asistenciaRegistrada, setAsistenciaRegistrada] = useState(false);

    const [alerta, setAlerta] = useState(null);

    // Catálogo de estados de asistencia
    const [estadosAsistencia, setEstadosAsistencia] = useState([]);

    const navigate = useNavigate();


    // ============================================================
    // CARGAR ESTADOS DE ASISTENCIA
    // ============================================================

    useEffect(() => {

        async function cargarEstadosAsistencia() {

            try {

                const resultado = await getEstadosAsistencia();

                setEstadosAsistencia(resultado);

            } catch (error) {

                console.error(
                    "Error al cargar los estados de asistencia:",
                    error
                );

                setAlerta({
                    tipo: "error",
                    titulo: "Error",
                    mensaje: "No se pudieron cargar los estados de asistencia."
                });

            }
        }

        cargarEstadosAsistencia();

    }, []);


    // ============================================================
    // CARGAR CLASES
    // ============================================================

    useEffect(() => {

        async function cargarClases() {

            try {

                // Resetea las clases
                setClaseSeleccionada(null);
                setClases([]);
                setAsistencias([]);

                const resultado = await getClases(idComision);

                const clasesActualizadas = await Promise.all(
                    resultado.map(actualizarEstadoAutomaticamente)
                );

                setClases(clasesActualizadas);

                if (resultado.length > 0) {

                    const claseInicial = idClaseInicial
                        ? clasesActualizadas.find(
                            (clase) =>
                                clase.id === Number(idClaseInicial)
                        )
                        : null;

                    setClaseSeleccionada(
                        claseInicial ?? null
                    );
                }

                const clasesSinAsistencia = [];

                for (const clase of clasesActualizadas) {

                    const asistenciasClase =
                        await obtenerAsistenciasPorClase(clase.id);

                    if (asistenciasClase.length === 0) {

                        clasesSinAsistencia.push(clase);

                    }

                }

                setClases(clasesSinAsistencia);

            } catch (error) {

                console.error(error);

            }

        }

        if (idComision) {
            cargarClases();
        }

    }, [idComision, idClaseInicial]);


    // ============================================================
    // CARGAR ASISTENCIAS DE LA CLASE SELECCIONADA
    // ============================================================

    useEffect(() => {

        if (claseSeleccionada?.id) {

            cargarAsistencias();

        } else {

            setAsistencias([]);

        }

    }, [claseSeleccionada?.id]);


    async function cargarAsistencias() {

        try {

            const asistenciasObtenidas =
                await obtenerAsistenciasPorClase(
                    claseSeleccionada.id
                );

            if (asistenciasObtenidas.length > 0) {

                setAsistencias(asistenciasObtenidas);

                setAsistenciaRegistrada(true);

            } else {

                const inscriptos =
                    await obtenerInscripcionesPorComision(
                        idComision
                    );

                setAsistencias(inscriptos);

                setAsistenciaRegistrada(false);

            }

        } catch (error) {

            console.error(error);

            setAsistenciaRegistrada(false);

        }

    }


    // ============================================================
    // CAMBIAR ESTADO DE UNA ASISTENCIA
    // ============================================================

    function cambiarEstado(idInscripcion, idEstado) {

        setAsistencias(prev =>
            prev.map(a =>
                a.id_inscripcion === idInscripcion
                    ? {
                        ...a,
                        id_estado: idEstado
                    }
                    : a
            )
        );

    }


    // ============================================================
    // CAMBIAR OBSERVACIÓN
    // ============================================================

    function cambiarObservacion(
        idInscripcion,
        observacion
    ) {

        setAsistencias(prev =>
            prev.map(a =>
                a.id_inscripcion === idInscripcion
                    ? {
                        ...a,
                        observacion
                    }
                    : a
            )
        );

    }


    // ============================================================
    // GUARDAR ASISTENCIAS
    // ============================================================

    async function guardarAsistencias() {

        if (!claseSeleccionada?.id) {

            console.error(
                "No hay una clase seleccionada"
            );

            return;
        }


        const observacionInvalida =
            asistencias.some(a => {

                const obs =
                    (a.observacion ?? "").trim();

                // Si escribió algo, debe contener al menos una letra
                return (
                    obs !== "" &&
                    !/[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(obs)
                );

            });


        if (observacionInvalida) {

            setAlerta({
                tipo: "error",
                titulo: "Observación inválida",
                mensaje:
                    "La observación debe contener al menos una letra.",
            });

            return;
        }


        try {

            const asistenciasExistentes =
                asistencias.filter(
                    (a) => a.id
                );

            const asistenciasNuevas =
                asistencias.filter(
                    (a) => !a.id
                );


            // ----------------------------------------------------
            // MODIFICAR ASISTENCIAS EXISTENTES
            // ----------------------------------------------------

            if (asistenciasExistentes.length > 0) {

                await Promise.all(

                    asistenciasExistentes.map((a) =>

                        modificarAsistencia(
                            a.id,
                            {
                                id_estado: a.id_estado,
                                observacion:
                                    a.observacion ?? "",
                            }
                        )

                    )

                );

            }


            // ----------------------------------------------------
            // CREAR NUEVAS ASISTENCIAS
            // ----------------------------------------------------

            if (asistenciasNuevas.length > 0) {

                const datos = {

                    id_clase:
                        claseSeleccionada.id,

                    asistencias:
                        asistenciasNuevas.map((a) => ({

                            id_inscripcion:
                                a.id_inscripcion,

                            id_estado:
                                a.id_estado,

                            observacion:
                                a.observacion ?? "",

                        }))

                };


                await registrarAsistenciaService(
                    datos
                );

            }


            // Elimina la clase del select una vez
            // que se guardan las asistencias por primera vez
            setClases((clasesActuales) =>
                clasesActuales.filter(
                    (clase) =>
                        clase.id !==
                        claseSeleccionada.id
                )
            );


            // Sale del modo edición
            setModoEdicion(false);


            // Limpia la tabla
            setClaseSeleccionada(null);

            setAsistencias([]);

            setAsistenciaRegistrada(false);


            await cargarHistorial();


            setAlerta({
                tipo: "success",
                titulo: "Asistencia registrada",
                mensaje:
                    "La asistencia se registró con éxito",
            });


        } catch (error) {

            setAlerta({
                tipo: "error",
                titulo: "Error",
                mensaje:
                    "Ocurrió un error al guardar la asistencia",
            });

            console.error(
                "Error al guardar",
                error
            );

        }

    }


    // ============================================================
    // SELECCIONAR CLASE
    // ============================================================

    function seleccionarClaseNormal(clase) {

        setClaseSeleccionada(clase);

        setModoEdicion(false);

    }


    // ============================================================
    // HISTORIAL
    // ============================================================

    useEffect(() => {

        cargarHistorial();

    }, [idComision]);


    async function cargarHistorial() {

        if (!idComision) {

            setHistorial([]);

            return;

        }


        try {

            const resultado =
                await obtenerHistorialPorComision(
                    idComision
                );

            setHistorial(resultado);

        } catch (error) {

            console.error(
                "Error al cargar el historial:",
                error
            );

            setHistorial([]);

        }

    }


    // ============================================================
    // EDITAR DESDE HISTORIAL
    // ============================================================

    async function editarDesdeHistorial(clase) {

        setClaseSeleccionada(clase);

        setModoEdicion(true);


        try {

            const resultado =
                await obtenerAsistenciasPorClase(
                    clase.id
                );

            setAsistencias(resultado);

            setAsistenciaRegistrada(true);

        } catch (error) {

            console.error(
                "Error al cargar la asistencia para editar",
                error
            );

        }


        window.scrollTo({

            top: 0,

            behavior: "smooth",

        });

    }


    // ============================================================
    // ELIMINAR UNA ASISTENCIA
    // ============================================================

    async function eliminarUnaAsistencia(asistencia) {

        if (!asistencia?.id) {

            console.error(
                "La asistencia no tiene un identificador válido"
            );

            return;

        }


        const confirmar =
            window.confirm(
                `¿Querés eliminar la asistencia de ${asistencia.alumno}?`
            );


        if (!confirmar) {
            return;
        }


        try {

            await eliminarAsistenciaService(
                asistencia.id
            );


            const asistenciasRestantes =
                asistencias.filter(
                    (item) =>
                        item.id !== asistencia.id
                );


            setAsistencias(
                asistenciasRestantes
            );


            await cargarHistorial();


            if (
                asistenciasRestantes.length === 0 &&
                claseSeleccionada
            ) {

                setClases((clasesActuales) => {

                    const yaExiste =
                        clasesActuales.some(
                            (clase) =>
                                clase.id ===
                                claseSeleccionada.id
                        );


                    if (yaExiste) {
                        return clasesActuales;
                    }


                    return [

                        ...clasesActuales,

                        claseSeleccionada,

                    ];

                });


                setClaseSeleccionada(null);

                setAsistenciaRegistrada(false);

                setModoEdicion(false);

            }


            setAlerta({

                tipo: "success",

                titulo: "Asistencia eliminada",

                mensaje:
                    `Se eliminó la asistencia de ${asistencia.alumno}.`,

            });


        } catch (error) {

            console.error(
                "Error al eliminar la asistencia:",
                error
            );


            setAlerta({

                tipo: "error",

                titulo: "Error",

                mensaje:
                    "No se pudo eliminar la asistencia.",

            });

        }

    }


    // ============================================================
    // ELIMINAR ASISTENCIAS DE UNA CLASE
    // ============================================================

    async function eliminarDesdeHistorial(clase) {

        const confirmar =
            window.confirm(
                `¿Querés eliminar todas las asistencias de ${clase.tema}`
            );


        if (!confirmar) {
            return;
        }


        try {

            await eliminarAsistenciasPorClase(
                clase.id
            );


            setHistorial(
                (historialActual) =>
                    historialActual.filter(
                        (item) =>
                            item.id !== clase.id
                    )
            );


            if (
                claseSeleccionada?.id === clase.id
            ) {

                setAsistencias([]);

                setModoEdicion(false);

            }


            setAlerta({

                tipo: "success",

                titulo: "Asistencia eliminada",

                mensaje:
                    "La asistencia se eliminó con éxito",

            });


        } catch (error) {

            console.error(
                "Error al eliminar las asistencias",
                error
            );


            setAlerta({

                tipo: "error",

                titulo: "Error",

                mensaje:
                    "Error al eliminar la asistencia",

            });

        }

    }


    // ============================================================
    // ESTADÍSTICAS
    // ============================================================

    const inscriptos =
        asistencias.length;


    // Buscamos el ID de cada estado desde el catálogo.
    const idPresente =
        estadosAsistencia.find(
            (estado) =>
                estado.nombre === "Presente"
        )?.id_estado_asistencia;


    const idAusente =
        estadosAsistencia.find(
            (estado) =>
                estado.nombre === "Ausente"
        )?.id_estado_asistencia;


    const idJustificado =
        estadosAsistencia.find(
            (estado) =>
                estado.nombre === "Justificado"
        )?.id_estado_asistencia;


    const idTarde =
        estadosAsistencia.find(
            (estado) =>
                estado.nombre === "Tarde"
        )?.id_estado_asistencia;


    const presentes =
        asistencias.filter(
            (a) =>
                a.id_estado === idPresente
        ).length;


    const ausentes =
        asistencias.filter(
            (a) =>
                a.id_estado === idAusente
        ).length;


    const justificado =
        asistencias.filter(
            (a) =>
                a.id_estado === idJustificado
        ).length;


    const tarde =
        asistencias.filter(
            (a) =>
                a.id_estado === idTarde
        ).length;


    // ============================================================
    // RENDER
    // ============================================================

    return (

        <div className="lg:col-span-9 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

            {alerta && (

                <div className="p-4 pb-0 sm:p-8 sm:pb-0">

                    <Alert
                        tipo={alerta.tipo}
                        titulo={alerta.titulo}
                        mensaje={alerta.mensaje}
                        onCerrar={() =>
                            setAlerta(null)
                        }
                    />

                </div>

            )}


            <div className="p-4 sm:p-8">

                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

                    <div>

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 break-words">
                            {claseSeleccionada?.tema}
                        </h2>


                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 sm:mt-4 text-gray-500 text-sm">

                            <div className="flex items-center gap-2">

                                <CalendarDaysIcon
                                    className="h-5 w-5 text-red-600 shrink-0"
                                />

                                <span>
                                    {claseSeleccionada?.fecha}
                                </span>

                            </div>


                            <div className="flex items-center gap-2">

                                <ClockIcon
                                    className="h-5 w-5 text-red-600 shrink-0"
                                />

                                <span>
                                    {claseSeleccionada?.hora_inicio}
                                </span>

                            </div>
                            <div className="flex items-center gap-2">
                                <ClockIcon
                                    className="h-5 w-5 text-red-600 shrink-0"
                                />
                                <span>
                                    {claseSeleccionada?.hora_fin}
                                </span>
                            </div>
                        </div>
                    </div>


                    <button
                        onClick={() =>
                            navigate("/GestionClases")
                        }
                        className="flex items-center gap-2 self-start sm:self-auto border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 transition shrink-0"
                    >
                        <PencilSquareIcon
                            className="h-5 w-5"
                        />
                        Gestionar Clases
                    </button>
                </div>
            </div>


            {/* Modo edición */}

            {modoEdicion &&
                claseSeleccionada && (
                    <div className="mx-4 mb-4 rounded-xl border border-blue-300 bg-blue-50 p-4 sm:mx-8">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-semibold text-blue-800">
                                    Estás editando una asistencia registrada
                                </p>
                                <p>
                                    {claseSeleccionada.tema}
                                    {" . "}
                                    {claseSeleccionada.fecha}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setModoEdicion(false)
                                }
                                className="self-start rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 sm:self-auto"
                            >
                                Cancelar edición
                            </button>
                        </div>
                    </div>
                )}

            {!modoEdicion && (
                <ClaseSelect
                    clases={clases}
                    claseSeleccionada={claseSeleccionada}
                    setClaseSeleccionada={
                        seleccionarClaseNormal
                    }
                />
            )}

            {claseSeleccionada && (
                <>
                    {asistenciaRegistrada &&
                        !modoEdicion && (
                            <div className="
                                mx-4 mb-4 rounded-xl border
                                border-green-300 bg-green-50 p-4
                                text-sm text-green-800 sm:mx-8
                            ">
                                Esta asistencia ya fue registrada.
                                Para modificarla, seleccioná
                                <strong> Editar </strong>
                                desde el historial.
                            </div>
                        )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 px-4 sm:px-8 py-4 sm:py-6">

                        <EstadisticaCard
                            titulo="Inscriptos"
                            cantidad={inscriptos}
                        />

                        <EstadisticaCard
                            titulo="Presentes"
                            cantidad={presentes}
                            color="green"
                        />

                        <EstadisticaCard
                            titulo="Ausentes"
                            cantidad={ausentes}
                            color="yellow"
                        />

                        <EstadisticaCard
                            titulo="Tarde"
                            cantidad={tarde}
                            color="red"
                        />
                        <EstadisticaCard
                            titulo="Justificados"
                            cantidad={justificado}
                        />
                    </div>

                    <TablaAsistencia
                        asistencias={asistencias}
                        estados={estadosAsistencia}
                        onCambiarEstado={cambiarEstado}
                        onCambiarObservacion={cambiarObservacion}
                        onEliminarAsistencia={eliminarUnaAsistencia}
                        soloLectura={asistenciaRegistrada &&!modoEdicion}
                    />
                    {(!asistenciaRegistrada ||
                        modoEdicion) && (
                            <div className="px-4 sm:px-6 pb-6">
                                <button
                                    onClick={guardarAsistencias}
                                    className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white rounded-lg px-5 py-2 font-medium"
                                >
                                    {modoEdicion
                                        ? "Guardar cambios"
                                        : "Guardar asistencias"
                                    }
                                </button>
                            </div>
                        )}
                </>
            )}

            <HistorialAsistencias
                historial={historial}
                onEditar={
                    editarDesdeHistorial
                }
                onEliminar={
                    eliminarDesdeHistorial
                }
                claseEditandoId={
                    modoEdicion
                        ? claseSeleccionada?.id
                        : null
                }
            />
        </div>
    );
}