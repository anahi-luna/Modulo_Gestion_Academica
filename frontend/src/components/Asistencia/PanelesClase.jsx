import { useEffect, useState } from "react";
import ClaseCard from "./ComisionCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getComisiones } from "../../mocks/comisionesMock";
import ComisionCard from "./ComisionCard";



export default function PanelesClase({
    comisionSeleccionada,
    setComisionSeleccionada
}) {
    const [comisiones, setComisiones] = useState([]);
    
    {/*Carga las comisiones*/}
    useEffect(() =>{
    
            async function cargarComisiones() {
                try{
                    console.log("Cargando comisiones...");
                    const resultado = await getComisiones();
                    setComisiones(resultado.data);
    
                    if(resultado.data.length > 0) {
                        setComisionSeleccionada(resultado.data[0]);
    
                    }
    
    
                }catch(error){
                    console.error(error);
                }
            }
            
            cargarComisiones();
        }, []);
    return (

        <div className="col-span-3 bg-white rounded-xl shadow border p-5">

            <div className="flex justify-between items-center mb-5">

                <h2 className="text-xl font-semibold">

                    Clases

                </h2>

            </div>

            <div className="relative mb-5">

                <MagnifyingGlassIcon
                    className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                />

                <input
                    placeholder="Buscar clase..."
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none"
                />

            </div>

            <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
                {/*Busca las comisiones para ser seleccionadas */}
                {comisiones.map((comision)=>(
                    <ComisionCard
                        key={comision.id}
                        comision={comision}
                        seleccionada={comision.id === comisionSeleccionada?.id}
                        onClick={() => setComisionSeleccionada(comision)}
                    />
                ))}

               

            </div>

        </div>

    )

}