import { useEffect, useState } from "react";
import ComisionCard from "../Asistencia/ComisionCard";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getComisiones } from "../../mocks/comisionesMock";

// Mismo componente que PanelesClase.jsx (Asistencia), pero para el
// módulo de Calificaciones. Reutiliza ComisionCard de Asistencia porque
// es un componente genérico (solo pinta materia/código/docente).

export default function PanelesComision({
    comisionSeleccionada,
    setComisionSeleccionada
}) {
    const [comisiones, setComisiones] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {

        async function cargarComisiones() {
            try {
                const resultado = await getComisiones();
                setComisiones(resultado.data);

                if (resultado.data.length > 0) {
                    setComisionSeleccionada(resultado.data[0]);
                }

            } catch (error) {
                console.error(error);
            }
        }

        cargarComisiones();
    }, []);

    const comisionesFiltradas = comisiones.filter((c) =>
        `${c.materia} ${c.codigo} ${c.docente}`
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    return (

        <div className="col-span-3 bg-white rounded-xl shadow border p-5">

            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold">
                    Comisiones
                </h2>
            </div>

            <div className="relative mb-5">
                <MagnifyingGlassIcon
                    className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                />
                <input
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar comisión..."
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none"
                />
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[600px] pr-1">
                {comisionesFiltradas.map((comision) => (
                    <ComisionCard
                        key={comision.id}
                        comision={comision}
                        seleccionada={comision.id === comisionSeleccionada?.id}
                        onClick={() => setComisionSeleccionada(comision)}
                    />
                ))}
            </div>

        </div>

    );

}
