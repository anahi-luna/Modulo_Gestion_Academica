// Barra de búsqueda y filtro por comisión para el panel admin.

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function FiltrosInscripciones({
    busqueda,
    setBusqueda,
    filtroComision,
    setFiltroComision,
    filtroEstado,
    setFiltroEstado,
    comisiones,
    onLimpiar
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1 min-w-0">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por legajo, ID de inscripción o integrante..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm
                               focus:outline-none focus:ring-2 focus:ring-red-300"
                />
            </div>
            <div className="flex flex-wrap gap-3">
                <select
                    value={filtroComision}
                    onChange={(e) => setFiltroComision(e.target.value)}
                    className="flex-1 sm:flex-none border border-gray-300 rounded-lg px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                    <option value="">Todas las comisiones</option>
                    {comisiones.map(c => (
                        <option key={c.id_comision_asignatura} value={c.id_comision_asignatura}>
                            {c.comision.descripcion} - {c.nombre}
                        </option>
                    ))}
                </select>
                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="flex-1 sm:flex-none border border-gray-300 rounded-lg px-3 py-2 text-sm
                               focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                    <option value="">Todos los estados</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aceptada">Aceptada</option>
                    <option value="Rechazada">Rechazada</option>
                    <option value="Cancelada">Cancelada</option>
                </select>
                <button
                    onClick={onLimpiar}
                    className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 whitespace-nowrap"
                >
                    Limpiar filtros
                </button>
            </div>
        </div>
    );
}