import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import EvaluacionRow from "./EvaluacionRow";

// Componente para mostrar una tabla de evaluaciones, con filtros por materia, comisión, docente y tipo.
export default function EvaluacionesTable({
    evaluaciones,

    filtroMateria,
    setFiltroMateria,

    filtroComision,
    setFiltroComision,

    filtroDocente,
    setFiltroDocente,

    filtroTipo,
    setFiltroTipo,

    onEditar,
    onEliminar,
    soloLectura = false,
}) {

    const materias = [...new Set(evaluaciones.map(e => e.materia))];
    const comisiones = [...new Set(evaluaciones.map(e => e.codigo))];
    const docentes = [...new Set(evaluaciones.map(e => e.docente))];
    const tipos = [...new Set(evaluaciones.map(e => e.tipo))];

    function formatearFecha(fecha) {
        return new Date(fecha).toLocaleDateString("es-AR");
    }

    const colorTipo = {
        Parcial: "bg-blue-100 text-blue-700",
        TP: "bg-purple-100 text-purple-700",
        Final: "bg-red-100 text-red-700",
        Recuperatorio: "bg-yellow-100 text-yellow-700",
    };

    return (
        <div className="space-y-4">

            <div className="bg-white rounded-xl shadow border p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                    <select
                        value={filtroMateria}
                        onChange={(e) => setFiltroMateria(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                    >
                        <option value="">Materia: Todas</option>
                        {materias.map(materia => (
                            <option key={materia} value={materia}>{materia}</option>
                        ))}
                    </select>

                    <select
                        value={filtroComision}
                        onChange={(e) => setFiltroComision(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                    >
                        <option value="">Comisión: Todas</option>
                        {comisiones.map(comision => (
                            <option key={comision} value={comision}>{comision}</option>
                        ))}
                    </select>

                    <select
                        value={filtroDocente}
                        onChange={(e) => setFiltroDocente(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                    >
                        <option value="">Docente: Todos</option>
                        {docentes.map(docente => (
                            <option key={docente} value={docente}>{docente}</option>
                        ))}
                    </select>

                    <select
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                    >
                        <option value="">Tipo: Todos</option>
                        {tipos.map(tipo => (
                            <option key={tipo} value={tipo}>{tipo}</option>
                        ))}
                    </select>

                </div>
            </div>

            {evaluaciones.length === 0 ? (
                <div className="bg-white rounded-xl shadow border px-6 py-10 text-center text-gray-400">
                    No se encontraron evaluaciones.
                </div>
            ) : (
                <>
                    <div className="md:hidden space-y-3">
                        {evaluaciones.map((evaluacion) => (
                            <div key={evaluacion.id} className="bg-white rounded-xl shadow border p-4">
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-800 truncate">{evaluacion.titulo}</p>
                                        <p className="text-xs text-gray-400">{evaluacion.materia} · {evaluacion.codigo}</p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        {!soloLectura && (
                                            <>
                                                <button
                                                    title="Editar evaluación"
                                                    onClick={() => onEditar(evaluacion)}
                                                    className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                                                >
                                                    <PencilSquareIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    title="Eliminar evaluación"
                                                    onClick={() => onEliminar(evaluacion)}
                                                    className="rounded-lg border border-red-300 p-2 text-red-600 hover:bg-red-50"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                                    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${colorTipo[evaluacion.tipo] ?? "bg-gray-100 text-gray-600"}`}>
                                        {evaluacion.tipo}
                                    </span>
                                    <p><span className="text-gray-400">Docente:</span> {evaluacion.docente}</p>
                                    <p><span className="text-gray-400">Fecha:</span> {formatearFecha(evaluacion.fecha)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block rounded-xl bg-white shadow border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[860px]">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left px-6 py-4 whitespace-nowrap">Materia</th>
                                        <th className="text-left px-3 py-4 whitespace-nowrap">Comisión</th>
                                        <th className="text-left px-3 py-4 whitespace-nowrap">Docente</th>
                                        <th className="text-left px-3 py-4 whitespace-nowrap">Tipo</th>
                                        <th className="text-left px-3 py-4">Título</th>
                                        <th className="text-left px-3 py-4 whitespace-nowrap">Fecha</th>
                                        {!soloLectura && (
                                            <th className="text-center px-3 py-4 whitespace-nowrap">Acciones</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {evaluaciones.map((evaluacion) => (
                                        <EvaluacionRow
                                            key={evaluacion.id}
                                            evaluacion={evaluacion}
                                            onEditar={onEditar}
                                            onEliminar={onEliminar}
                                            soloLectura={soloLectura}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

        </div>
    );
}