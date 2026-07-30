import EvaluacionSelect from "./EvaluacionSelect";
import EstadisticaCard from "../Asistencia/EstadisticaCard";
import CalificacionTabla from "./CalificacionTabla";
import Alert from "../Alert";
import HistorialCalificaciones from "./HistorialCalificaciones";
import { useNavigate } from "react-router-dom";
import { AcademicCapIcon, CalendarDaysIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { getEvaluaciones } from "../../Services/evaluacionesAdminService";
import { obtenerCalificacionesPorEvaluacion, registrarCalificacionesService, obtenerHistorialCalificacionesPorComision, eliminarCalificacionService, eliminarCalificacionesPorEvaluacion } from "../../Services/calificacionesAdminService";
import { obtenerInscripcionesPorComision } from "../../Services/inscripcionesAdminService";

// Componente para mostrar el panel de detalle de calificaciones de una comisión, 
// incluyendo selección de evaluación, tabla de calificaciones y estadísticas.
// Le agrego soloLectura: cuando el usuario no tiene permiso para
// cargar/actualizar calificaciones, deshabilito los inputs y escondo
// el botón de guardar, pero sigue viendo la planilla igual.
export default function PanelDetalleCalificaciones({ idComision, soloLectura = false }) {
    const [evaluacionSeleccionada, setEvaluacionSeleccionada] = useState(null);
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [calificaciones, setCalificaciones] = useState([]);
    const [guardando, setGuardando] = useState(false);
    const [cargandoEvaluaciones, setCargandoEvaluaciones] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [historial, setHistorial] = useState([]);
    const [calificacionesRegistradas, setCalificacionesRegistradas] = useState(false);
    const [alerta, setAlerta] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function cargarEvaluaciones() {
            try {
                setEvaluacionSeleccionada(null);
                setEvaluaciones([]);
                setCalificaciones([]);
                setCargandoEvaluaciones(true);

                const resultado = await getEvaluaciones(idComision);
               
                //Elimina del select las evaluaciones registradas y las pasa al historial.
                //Deja las que todavia tienen pendiente de cargar.
                const evaluacionesVerificadas = await Promise.all(
                    resultado.map(async(evaluacion) => {
                        const calificacionesExistentes = await obtenerCalificacionesPorEvaluacion(evaluacion.id);

                        return calificacionesExistentes.length === 0
                            ?evaluacion: null;
                    })
                );

                const evaluacionesPendientes = evaluacionesVerificadas.filter(Boolean);

                setEvaluaciones(evaluacionesPendientes);
                setEvaluacionSeleccionada(null);
                setCalificaciones([]);
                setModoEdicion(false);
                setCalificacionesRegistradas(false);
            } catch (error) {
                console.error(error);
                setAlerta({
                    tipo: "error",
                    titulo: "Error",
                    mensaje: "No se pudieron cargar las evaluaciones de esta comisión.",
                });
            } finally {
                setCargandoEvaluaciones(false);
            }
        }
        if (idComision) {
            cargarEvaluaciones();
        } else {
            // Tampoco había comisión antes: limpio igual, por las dudas.
            setEvaluacionSeleccionada(null);
            setEvaluaciones([]);
            setCalificaciones([]);
        }
    }, [idComision]);

    useEffect(() => {
        if (evaluacionSeleccionada?.id) {
            cargarCalificaciones();
        } else {
            setCalificaciones([]);
        }
    }, [evaluacionSeleccionada?.id]);

    // Carga las calificaciones de la evaluación seleccionada. 
    // Si no hay calificaciones registradas, carga la lista de inscriptos y 
    // prepara la planilla para registrar nuevas calificaciones.
    async function cargarCalificaciones() {
        try {
            const notas = await obtenerCalificacionesPorEvaluacion(evaluacionSeleccionada.id);
            if (notas.length > 0) {
                setCalificaciones(notas);
                setCalificacionesRegistradas(true);
            } else {
                const inscriptos = await obtenerInscripcionesPorComision(idComision);
                setCalificaciones(
                    inscriptos.map((i) => ({
                        id_legajo: i.id_legajo,
                        alumno: i.alumno,
                        id_inscripcion: i.id_inscripcion,
                        id_comision_asignatura: i.id_comision_asignatura,
                        nota: null,
                        observacion: "",
                    }))
                );

                setCalificacionesRegistradas(false);
            }
        } catch (error) {
            console.error(error);
            setAlerta({
                tipo: "error",
                titulo: "Error",
                mensaje: "No se pudieron cargar las calificaciones de esta evaluación.",
            });
        }
    }

    // Cambia la nota de un alumno en la planilla de calificaciones
    function cambiarNota(idInscripcion, valor) {
        setCalificaciones(prev =>
            prev.map(c =>
                c.id_inscripcion === idInscripcion
                    ? { ...c, nota: valor === "" ? null : valor }
                    : c
            )
        );
    }

    // Cambia la observación de un alumno en la planilla de calificaciones
    function cambiarObservacion(idInscripcion, valor) {
        setCalificaciones(prev =>
            prev.map(c =>
                c.id_inscripcion === idInscripcion
                    ? { ...c, observacion: valor }
                    : c
            )
        );
    }

    // Guarda las calificaciones de la evaluación seleccionada. 
    // Si ya había calificaciones registradas, las actualiza; si no, las crea.
    async function guardarCalificaciones() {
        const datos = {
            id_evaluacion: evaluacionSeleccionada.id,
            calificaciones: calificaciones.map(c => ({
                // Si la fila ya tenía una calificación cargada (viene con
                // id), lo mando para que el service sepa que va por PUT
                // en vez de por POST.
                id: c.id,
                id_inscripcion: c.id_inscripcion,
                nota: c.nota === "" || c.nota === null ? null : Number(c.nota),
                observacion: c.observacion,
            })),
        };
        try {
            setGuardando(true);
            await registrarCalificacionesService(datos);
            await cargarCalificaciones();
            await cargarHistorial();
            setAlerta({
                tipo: "success",
                titulo: "Calificaciones guardadas",
                mensaje: "Las calificaciones se registraron con éxito.",
            });

            if(!modoEdicion){
                setEvaluaciones((evaluacionesActuales) => evaluacionesActuales.filter(
                    (evaluacion) => evaluacion.id !== evaluacionSeleccionada.id
                ))
            }
            setEvaluacionSeleccionada(null);
            setCalificaciones([]);
            setCalificacionesRegistradas(false);
            setModoEdicion(false);
        } catch (error) {
            console.error(error);
            setAlerta({
                tipo: "error",
                titulo: "Error",
                mensaje: "Ocurrió un error al guardar las calificaciones. Volvé a intentar.",
            });
        } finally {
            setGuardando(false);
        }
    }

    useEffect(() => {
        cargarHistorial();
    }, [idComision]);

    // Carga el historial de calificaciones de la comisión.
    async function cargarHistorial() {
        if(!idComision){
            setHistorial([]);
            return;
        }

        try{
                const resultado = await obtenerHistorialCalificacionesPorComision(idComision);

                setHistorial(resultado);

        }catch(error){
            console.error("Error al cargar el historial de calificaciones", error)

            setHistorial([]);
        }

    }

    // Permite editar las calificaciones de una evaluación que ya tiene calificaciones registradas.
    async function editarDesdeHistorial(evaluacion){
        setEvaluacionSeleccionada(evaluacion);
        setModoEdicion(true);

        try{
            const resultado = await obtenerCalificacionesPorEvaluacion(evaluacion.id);

            setCalificaciones(resultado);
            setCalificacionesRegistradas(true);
        }catch(error){
            console.error("Error al cargar las calificaciones para editar", error);
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // Elimina todas las calificaciones de una evaluación, con confirmación del usuario.
    async function eliminarTodas(evaluacion) {
        const confirmar = window.confirm(`¿Querés eliminar todas las calificaciones de "${evaluacion.titulo}"?`);

        if(!confirmar){
            return;
        }

        try{
            //Llama al metodo para eliminar del service
            await eliminarCalificacionesPorEvaluacion(evaluacion.id);
            //Vuelve a cargar las evaluaciones en el select cuando se eliminan, para volver a registrar en caso de ser necesario.
            setEvaluaciones((evaluacionesActuales) => {
                const yaExiste = evaluacionesActuales.some((item) => item.id === evaluacion.id);

                if(yaExiste){
                    return evaluacionesActuales;
                }

                return[
                    ...evaluacionesActuales,
                    evaluacion
                ]
            })
            //Actualiza el historial
            await cargarHistorial();

            //En caso de justo estar editando esa evaluacion, limpia la pantalla
            if(evaluacionSeleccionada?.id === evaluacion.id){
                setEvaluacionSeleccionada(null);
                setCalificaciones([]);
                setModoEdicion(false);
                setCalificacionesRegistradas(false);
            }

            setAlerta({
                tipo: "success",
                titulo: "Calificaciones eliminadas",
                mensaje: "Se eliminaron todas las calificaciones de la evaluación",
            })
        }catch(error){
            console.error(error);

            setAlerta({
                tipo: "error",
                titulo: "Error",
                mensaje: "No fue posible eliminar las calificaciones",
            });
        }
    }

    // Elimina una calificación puntual de un alumno, con confirmación del usuario.
    async function eliminarUnaCalificacion(calificacion) {
        if(!calificacion?.id) {
            console.error("La calificación no tiene un identificador válido");
            return;
        }
        

        const confirmar = window.confirm(`¿Queres eliminar la calificacion de ${calificacion.alumno}`);

        if(!confirmar){
            return;
        }

        try{
            await eliminarCalificacionService(calificacion.id);

            const calificacionesRestantes = calificaciones.filter((item) => item.id !== calificacion.id);

            setCalificaciones(calificacionesRestantes);

            await cargarHistorial();

            //Al eliminar la ultima calificacion, la evaluacion vuelve al select.

            if(calificacionesRestantes.length === 0 && evaluacionSeleccionada){
                setEvaluaciones((evaluacionesActuales) =>{
                    const yaExiste = evaluacionesActuales.some((evaluacion) => evaluacion.id === evaluacionSeleccionada.id);

                    if(yaExiste){
                        return evaluacionesActuales;
                    }

                    return[
                        ...evaluacionesActuales,
                        evaluacionSeleccionada,
                    ];
                });

                setEvaluacionSeleccionada(null);
                setCalificaciones([]);
                setCalificacionesRegistradas(false);
                setModoEdicion(false);
            }
            setAlerta({
                tipo: "success",
                titulo: "Calificación eliminadas",
                mensaje: `Se eliminó la calificación de ${calificacion.alumno}`,
            })

        }catch(error){
            console.error("Error al eliminar la calificación" ,error);
            setAlerta({
                tipo: "error",
                titulo: "Error",
                mensaje: "No se pudo eliminar la evaluación",
            })
        }

    }
    const inscriptos = calificaciones.length;
    const conNota = calificaciones.filter(
        c => c.nota !== null && c.nota !== undefined && c.nota !== ""
    );
    const aprobados = conNota.filter(c => Number(c.nota) >= 6).length;
    const desaprobados = conNota.filter(c => Number(c.nota) < 6).length;
    const promedio = conNota.length > 0
        ? (conNota.reduce((acc, c) => acc + Number(c.nota), 0) / conNota.length).toFixed(1)
        : "-";

    return (
        <div className="lg:col-span-9 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

            {alerta && (
                <div className="p-4 pb-0 sm:p-8 sm:pb-0">
                    <Alert
                        tipo={alerta.tipo}
                        titulo={alerta.titulo}
                        mensaje={alerta.mensaje}
                        onCerrar={() => setAlerta(null)}
                    />
                </div>
            )}

            <div className="p-4 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

                    <div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 break-words">
                            {evaluacionSeleccionada?.titulo}
                        </h2>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 sm:mt-4 text-gray-500 text-sm">
                            <div className="flex items-center gap-2">
                                <AcademicCapIcon className="h-5 w-5 text-red-600 shrink-0" />
                                <span>{evaluacionSeleccionada?.tipo}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CalendarDaysIcon className="h-5 w-5 text-red-600 shrink-0" />
                                <span>{evaluacionSeleccionada?.fecha}</span>
                            </div>
                        </div>
                    </div>

                    {!soloLectura && (
                        <button
                            onClick={() => navigate("/GestionEvaluaciones")}
                            className="flex items-center gap-2 self-start sm:self-auto border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 transition shrink-0"
                        >
                            <PencilSquareIcon className="h-5 w-5" />
                            Gestionar Evaluaciones
                        </button>
                    )}

                </div>
            </div>
            {modoEdicion && evaluacionSeleccionada &&(
                <div className="mx-4 mb-4 rounded-xl border border-blue-300 bg-blue-50 p-4 sm:mx-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-semibold text-blue-800">
                                Estás editando calificaciones registradas
                            </p>

                            <p className="mt-1 text-sm text-blue-700">
                                {evaluacionSeleccionada.titulo} .{""}
                                {evaluacionSeleccionada.fecha}
                            </p>
                        </div>

                        <button 
                            type="button"
                            onClick={() => {
                                setModoEdicion(false);
                                setEvaluacionSeleccionada(null);
                                setCalificaciones([]);
                                setCalificacionesRegistradas(false);
                            }}
                            className="self-start rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 sm:self-auto"
                        >
                            Cancelar edición

                        </button>
                    </div>
                </div>
            )}

            {!modoEdicion && (
                <EvaluacionSelect
                    evaluaciones={evaluaciones}
                    evaluacionSeleccionada={evaluacionSeleccionada}
                    setEvaluacionSeleccionada={setEvaluacionSeleccionada}
                />
            )}        
            

            {/* Aviso explícito cuando la comisión no tiene evaluaciones
            */}
            {!cargandoEvaluaciones && idComision && evaluaciones.length === 0 && (
                <div className="px-4 sm:px-8 py-6 text-sm text-gray-400">
                    Esta comisión todavía no tiene evaluaciones cargadas.
                </div>
            )}

            {evaluacionSeleccionada && (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 px-4 sm:px-8 py-4 sm:py-6">
                        <EstadisticaCard titulo="Inscriptos" cantidad={inscriptos} />
                        <EstadisticaCard titulo="Aprobados" cantidad={aprobados} color="green" />
                        <EstadisticaCard titulo="Desaprobados" cantidad={desaprobados} color="red" />
                        <EstadisticaCard titulo="Promedio" cantidad={promedio} />
                    </div>

                    <CalificacionTabla
                        calificaciones={calificaciones}
                        onCambiarNota={cambiarNota}
                        onCambiarObservacion={cambiarObservacion}
                        onEliminarCalificacion={eliminarUnaCalificacion}
                        soloLectura={soloLectura}
                    />

                    {!soloLectura && (
                        <div className="px-4 sm:px-6 pb-6">
                            <button
                                onClick={guardarCalificaciones}
                                disabled={guardando || !evaluacionSeleccionada}
                                className="w-full sm:w-auto bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white rounded-lg px-5 py-2 font-medium"
                            >
                                {guardando 
                                    ? "Guardando..." 
                                    :modoEdicion
                                        ? "Guardar cambios"
                                        : "Guardar calificaciones"}
                            </button>
                        </div>
                    )}
                </>
            )}

            <HistorialCalificaciones
                historial={historial}
                onEditar={editarDesdeHistorial}
                onEliminar={eliminarTodas}
                evaluacionEditandoId={
                    modoEdicion
                        ?evaluacionSeleccionada?.id: null
                }
            />

        </div>
    );
}
