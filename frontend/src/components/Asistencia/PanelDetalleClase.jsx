import ClaseSelect from "./ClaseSelect";
import EstadisticaCard from "./EstadisticaCard";
import TablaAsistencia from "./AsistenciaTabla";
import { useNavigate } from "react-router-dom";
import { CalendarDaysIcon, ClockIcon, MapPinIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { getClase, getClases } from "../../Services/clasesAdminService";




export default function PanelDetalleClase({idComision}){
    const [claseSeleccionada, setClaseSeleccionada] = useState(null);
    const [clases, setClases] = useState([])

    const navigate = useNavigate();

    console.log("idComision:", idComision);

    useEffect(() =>{

        async function cargarClases() {
            try{
                console.log("Cargando clases...");
                const resultado = await getClases(idComision);
                setClases(resultado);

                if(resultado.length > 0) {
                    setClaseSeleccionada(resultado[0]);

                }


            }catch(error){
                console.error(error);
            }
        }

        if(idComision) {
            cargarClases(); 
        }
    },[idComision]);

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
                    cantidad={18}
                />

                <EstadisticaCard
                    titulo="Presentes"
                    cantidad={14}
                    color="green"
                />

                <EstadisticaCard
                    titulo="Tarde"
                    cantidad={2}
                    color="yellow"
                />

                <EstadisticaCard
                    titulo="Ausentes"
                    cantidad={2}
                    color="red"
                />

            </div>

            <TablaAsistencia idClase={claseSeleccionada?.id}/>

        </div>

    )

}