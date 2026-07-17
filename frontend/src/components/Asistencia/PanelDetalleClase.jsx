import ClaseSelect from "./ClaseSelect";
import EstadisticaCard from "./EstadisticaCard";
import TablaAsistencia from "./AsistenciaTabla";
import { useNavigate } from "react-router-dom";
import { CalendarDaysIcon, ClockIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { getClase, getClases } from "../../Services/clasesAdminService";
import { obtenerAsistenciasPorClase, modificarAsistencia, registrarAsistenciaService, actualizarEstadoAutomaticamente } from "../../Services/asistenciaAdminService";
import { obtenerInscripcionesPorComision } from "../../Services/inscripcionesAdminService";
import { cargarDatosInscripcion } from "../../Services/inscripcionesService";
import { getComisiones } from "../../mocks/comisionesMock";
import SelectorComisiones from "./SelectorComisiones";

export default function PanelDetalleClase({ idComision }) {
    const [claseSeleccionada, setClaseSeleccionada] = useState(null);
    const [clases, setClases] = useState([]);
    const [asistencias, setAsistencias] = useState([]);
    const [comisionSeleccionada, setComisionSeleccionada] = useState(null);
    const [comisiones, setComisiones] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function cargarClases() {
            try {
                //Resetea las clases
                setClaseSeleccionada(null);
                setClases([]);
                setAsistencias([]);


                const resultado = await getClases(comisionSeleccionada.id);
                const clasesActualizadas = await Promise.all(
                    resultado.map(actualizarEstadoAutomaticamente)
                );
                setClases(clasesActualizadas);
                if (resultado.length > 0) {
                    setClaseSeleccionada(resultado[0]);
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (comisionSeleccionada?.id) {
            cargarClases();
        }
    }, [comisionSeleccionada?.id]);

    useEffect(() => {
        if (claseSeleccionada?.id) {
            cargarAsistencias();
        } else {
            setAsistencias([]);
        }
    }, [claseSeleccionada?.id]);

    useEffect(() => {
        async function cargarComisiones() {
            try{
                const resultado = await getComisiones();
                setComisiones(resultado.data);

            }catch(error){
                console.error("Error al cargar comisiones:", error);
            }
        }
        cargarComisiones();
    }, []);

    useEffect(() => {
        if(!idComision || comisiones.length === 0) {
            return;
        }

        const comisionActual = comisiones.find(
            (comision) => comision.id === Number(idComision)
        );

        setComisionSeleccionada(comisionActual ?? null);
    }, [idComision, comisiones]);


    async function cargarAsistencias() {
        try {
            const asistencias = await obtenerAsistenciasPorClase(claseSeleccionada.id);
            if (asistencias.length > 0) {
                setAsistencias(asistencias);
            } else {
                const inscriptos = await obtenerInscripcionesPorComision(comisionSeleccionada.id);
                setAsistencias(inscriptos);
            }
        } catch (error) {
            console.error(error);
        }
    }

    function cambiarEstado(idInscripcion, idEstado) {
        setAsistencias(prev =>
            prev.map(a =>
                a.id_inscripcion === idInscripcion
                    ? { ...a, id_estado: idEstado }
                    : a
            )
        );
    }

    // Actualiza la observacion de UN integrante puntual dentro del array de asistencias.
    // Recibe el id_inscripcion (para saber a quien le cambio la observacion) y el
    // texto nuevo que escribio el usuario en el input.
    function cambiarObservacion(idInscripcion, observacion) {
        setAsistencias(prev =>
            prev.map(a =>
                a.id_inscripcion === idInscripcion
                    // Si es el integrante correcto, le pisamos solo el campo "observacion"
                    // (con el spread ...a mantenemos el resto de sus datos igual)
                    ? { ...a, observacion }
                    // Si no es el integrante que estamos editando, lo dejamos igual
                    : a
            )
        );
    }

    async function guardarAsistencias() {

        if(!claseSeleccionada?.id){
            console.error("No hay una clase seleccionada")
            return;
        }
        const datos = {
            id_clase: claseSeleccionada.id,
            asistencias: asistencias.map(a => ({
                id_inscripcion: a.id_inscripcion,
                id_estado: a.id_estado,
                observacion: a.observacion ?? "",
            })),
        };

        try{
            await registrarAsistenciaService(datos);
        }catch(error){
            console.error("Error al guardar", error)

        }
        
    }

    function cambiarComision(comision){
        setComisionSeleccionada(comision);
    }

    const inscriptos = asistencias.length;
    const presentes = asistencias.filter(a => a.id_estado === 1).length;
    const ausentes = asistencias.filter(a => a.id_estado === 2).length;
    const justificado = asistencias.filter(a => a.id_estado === 3).length;
    const tarde = asistencias.filter(a => a.id_estado === 4).length;

    const comisionesDeLaMateria = comisionSeleccionada ? comisiones.filter(
        (comision) => comision.materia === comisionSeleccionada.materia
    ) : [];

    return (
        // Antes: "col-span-9" fijo. En mobile no hace falta col-span
        // (ocupa toda la única columna del grid-cols-1 del padre).
        <div className="lg:col-span-9 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

            {/* p-4 en mobile en vez de p-8, si no el contenido queda pegado a los bordes */}
            <div className="p-4 sm:p-8">

                {/*
                  Antes: "flex justify-between" ponía el título y el botón
                  siempre en la misma fila, chocando en mobile.
                  Ahora: en mobile van en columna (flex-col), y desde sm
                  vuelven a estar en fila.
                */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">

                    <div>
                        {/* text-2xl en mobile, va creciendo hasta text-4xl en desktop */}
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 break-words">
                            {claseSeleccionada?.tema}
                        </h2>

                        {/* flex-wrap: si no entran los 3 datos en una fila, pasan a la siguiente
                            en vez de desbordar el contenedor */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 sm:mt-4 text-gray-500 text-sm">
                            <div className="flex items-center gap-2">
                                <CalendarDaysIcon className="h-5 w-5 text-red-600 shrink-0" />
                                <span>{claseSeleccionada?.fecha}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ClockIcon className="h-5 w-5 text-red-600 shrink-0" />
                                <span>{claseSeleccionada?.hora_inicio}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ClockIcon className="h-5 w-5 text-red-600 shrink-0" />
                                <span>{claseSeleccionada?.hora_fin}</span>
                            </div>
                        </div>
                    </div>

                    {/* self-start en mobile para que no se estire a lo ancho */}
                    <button
                        onClick={() => navigate("/GestionClases")}
                        className="flex items-center gap-2 self-start sm:self-auto border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 transition shrink-0"
                    >
                        <PencilSquareIcon className="h-5 w-5" />
                        Gestionar Clases
                    </button>

                </div>
            </div>
            

            <SelectorComisiones
                comisiones={comisionesDeLaMateria}
                comisionSeleccionada={comisionSeleccionada}
                onCambiarComision={cambiarComision}
                
            />
            <ClaseSelect
                clases={clases}
                claseSeleccionada={claseSeleccionada}
                setClaseSeleccionada={setClaseSeleccionada}
                
            />

            {/*
              Antes: "grid-cols-4" fijo, 4 tarjetas apretadísimas en un celular.
              Ahora: 2 columnas en mobile (2 filas de 2), 4 columnas desde sm.
            */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 px-4 sm:px-8 py-4 sm:py-6">
                <EstadisticaCard titulo="Inscriptos" cantidad={inscriptos} />
                <EstadisticaCard titulo="Presentes" cantidad={presentes} color="green" />
                <EstadisticaCard titulo="Ausentes" cantidad={ausentes} color="yellow" />
                <EstadisticaCard titulo="Tarde" cantidad={tarde} color="red" />
                <EstadisticaCard titulo="Justificados" cantidad={justificado} />
            </div>

            <TablaAsistencia
                asistencias={asistencias}
                onCambiarEstado={cambiarEstado}
                onCambiarObservacion={cambiarObservacion}
            />

            {/* Antes este botón no tenía className: se veía como un link de texto plano */}
            <div className="px-4 sm:px-6 pb-6">
                <button
                    onClick={guardarAsistencias}
                    className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white rounded-lg px-5 py-2 font-medium"
                >
                    Guardar asistencias
                </button>
            </div>

        </div>
    )
}