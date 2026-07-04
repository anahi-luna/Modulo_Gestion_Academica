import ComisionTabs from "./ComisionTabs";
import EstadisticaCard from "./EstadisticaCard";
import TablaAsistencia from "./AsistenciaTabla";
import { CalendarDaysIcon, ClockIcon, MapPinIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

export default function PanelDetalleClase(){

    return(

        <div className="col-span-9 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">

            <div className="p-8">

                <div className="flex justify-between">

                    <div>

                        <h2 className="text-4xl font-bold text-gray-800">

                            Primeros Auxilios

                        </h2>

                        <div className="flex gap-6 mt-4 text-gray-500 text-sm">

                            <div className="flex items-center gap-2">
                                <CalendarDaysIcon className="h-5 w-5 text-red-600" />
                                <span>02 Jul</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <ClockIcon className="h-5 w-5 text-red-600" />
                                <span>09:00</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <MapPinIcon className="h-5 w-5 text-red-600" />
                                <span>Sede Central</span>
                            </div>

                        </div>

                    </div>

                    <button
                        className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
                    >
                        <PencilSquareIcon className="h-5 w-5" />
                        Editar clase

                    </button>

                </div>

            </div>

            <ComisionTabs />

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

            <TablaAsistencia/>

        </div>

    )

}