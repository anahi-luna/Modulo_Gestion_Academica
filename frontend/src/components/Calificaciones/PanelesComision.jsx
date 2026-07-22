import { useEffect, useState } from "react";
import ComisionCard from "../Asistencia/ComisionCard";
import Alert from "../Alert";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { getComisiones } from "../../mocks/comisionesMock";

export default function PanelesComision({
    comisionSeleccionada,
    setComisionSeleccionada
}) {
    const [comisiones, setComisiones] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    // Antes esto solo se logueaba a consola: la lista se quedaba vacía
    // sin explicar por qué.
    const [error, setError] = useState(null);

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
                setError("No se pudieron cargar las comisiones.");
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
        // lg:col-span-3 en vez de col-span-3 fijo (mismo criterio que PanelesClase)
        <div className="lg:col-span-3 bg-white rounded-xl shadow border p-4 sm:p-5">

            <div className="flex justify-between items-center mb-4 sm:mb-5">
                <h2 className="text-lg sm:text-xl font-semibold">Comisiones</h2>
            </div>

            {error && (
                <div className="mb-4">
                    <Alert tipo="error" titulo="Error" mensaje={error} onCerrar={() => setError(null)} />
                </div>
            )}

            <div className="relative mb-4 sm:mb-5">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar comisión..."
                    className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-3 focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none"
                />
            </div>

            <div className="space-y-3 overflow-y-auto max-h-72 lg:max-h-[600px] pr-1">
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