import ClaseSelect from "./ClaseSelect";
import EstadisticaCard from "./EstadisticaCard";
import TablaAsistencia from "./AsistenciaTabla";
import { useNavigate } from "react-router-dom";
import { CalendarDaysIcon, ClockIcon, MapPinIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { getClase, getClases } from "../../Services/clasesAdminService";
import { obtenerAsistenciasPorClase, modificarAsistencia, registrarAsistenciaService, actualizarEstadoAutomaticamente } from "../../Services/asistenciaAdminService";
import { obtenerInscripcionesPorComision } from "../../Services/inscripcionesAdminService";
import { cargarDatosInscripcion } from "../../Services/inscripcionesService";




export default function PanelDetalleClase({idComision}){
    const [claseSeleccionada, setClaseSeleccionada] = useState(null);
    const [clases, setClases] = useState([])
    const [asistencias, setAsistencias] = useState([]);

    const navigate = useNavigate();

    console.log("idComision:", idComision);

    useEffect(() => {

        async function cargarClases() {
            try {

                const resultado = await getClases(idComision);
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

        if (idComision) {
            cargarClases();
        }

    }, [idComision]);

    useEffect(() => {

        if(claseSeleccionada?.id){
        cargarAsistencias();
        } else{
        setAsistencias([]);
        }
    
    }, [claseSeleccionada?.id]);

    async function cargarAsistencias() {
        try{
            
            const asistencias = await obtenerAsistenciasPorClase(claseSeleccionada.id);
            if(asistencias.length > 0){
                setAsistencias(asistencias);
            }else{
                const inscriptos = await obtenerInscripcionesPorComision(idComision);

                setAsistencias(inscriptos);
            }
            
            

        }catch(error){

            console.error(error);

        }
    
    }

    function cambiarEstado(idInscripcion, idEstado){

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
  
    async function guardarAsistencias(){

        const datos = {

            id_clase: claseSeleccionada.id,

            asistencias: asistencias.map(a => ({

                id_inscripcion: a.id_inscripcion,

                id_estado: a.id_estado,

                observacion: a.observacion

            }))

        };
        console.log(datos);
        await registrarAsistenciaService(datos);

    }
    console.log(asistencias);
    const inscriptos = asistencias.length;

    const presentes = asistencias.filter(
        a => a.id_estado === 1
    ).length;

    const ausentes = asistencias.filter(
        a => a.id_estado === 2
    ).length;


    const justificado = asistencias.filter(
        a => a.id_estado === 3

    ).length;

    const tarde = asistencias.filter(
        a => a.id_estado === 4
    ).length;

    return(

        <div className="col-span-9 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

            <div className="p-8">

                <div className="flex justify-between">

                    <div>

                        <h2 className="text-4xl font-bold text-gray-800">
                            {claseSeleccionada?.tema}
                            

                        </h2>

                        <div className="flex gap-6 mt-4 text-gray-500 text-sm">

                            <div className="flex items-center gap-2">
                                <CalendarDaysIcon className="h-5 w-5 text-red-600" />
                                <span>{claseSeleccionada?.fecha}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <ClockIcon className="h-5 w-5 text-red-600" />
                                <span>{claseSeleccionada?.hora_inicio}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <ClockIcon className="h-5 w-5 text-red-600" />
                                <span>{claseSeleccionada?.hora_fin}</span>
                            </div>

                        </div>

                    </div>

                    <button
                        onClick={() => navigate("/GestionClases")}
                        className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
                    >
                        <PencilSquareIcon className="h-5 w-5" />
                        Gestionar Clases

                    </button>

                </div>

            </div>

            <ClaseSelect
                clases={clases}
                claseSeleccionada={claseSeleccionada}
                setClaseSeleccionada={setClaseSeleccionada}
            />

            <div className="grid grid-cols-4 gap-5 px-8 py-6">

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
                onCambiarEstado={cambiarEstado}
            />

            <button
                onClick={guardarAsistencias}
            >

                Guardar asistencias

            </button>

        </div>

    )

}