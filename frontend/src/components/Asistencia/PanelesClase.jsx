import ClaseCard from "./ClaseCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function PanelesClase() {

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

                <ClaseCard
                    nombre="Primeros Auxilios"
                    fecha="02 Jul"
                    cantidad={3}
                    seleccionada
                />

                <ClaseCard
                    nombre="Gestión Operativa"
                    fecha="05 Jul"
                    cantidad={2}
                />

                <ClaseCard
                    nombre="Defensa Civil"
                    fecha="12 Jul"
                    cantidad={1}
                />

            </div>

        </div>

    )

}