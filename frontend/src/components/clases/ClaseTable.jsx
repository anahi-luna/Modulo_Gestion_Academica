import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import ClaseRow from "./ClaseRow";

// Mismo criterio que ya usamos en TablaCertificadosAdmin.jsx: en vez de
// forzar la tabla completa  a deslizar para el costado todo el tiempo, en mobile mostramos una lista de
// tarjetas apiladas con lo mismo que la tabla, y recién a partir de
// tablet (md) mostramos la tabla de verdad con todas las columnas.
export default function ClasesTable({
    clases,

    filtroMateria,
    setFiltroMateria,

    filtroComision,
    setFiltroComision,

    filtroDocente,
    setFiltroDocente,

    filtroFecha,
    setFiltroFecha,

    filtroTema,
    setFiltroTema,

    onEditar,
    onEliminar,
    // Cuando el usuario no tiene permiso para crear/editar/eliminar
    // clases (por ejemplo un alumno, que solo tiene "clases.leer"), se
    // sigue viendo la tabla/tarjetas igual, pero sin ningún botón de
    // acción.
    soloLectura = false,
}) {

    const materias = [...new Set(clases.map(c => c.materia))];
    const comisiones = [...new Set(clases.map(c => c.codigo))];
    const docentes = [...new Set(clases.map(c => c.docente))];
    const fechas = [...new Set(clases.map(c => c.fecha))];
    const temas = [...new Set(clases.map(c => c.tema))];

    function formatearFecha(fecha) {
        return new Date(fecha).toLocaleDateString("es-AR");
    }

    return (
        <div className="space-y-4">

            <div className="bg-white rounded-xl shadow border p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">

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
                        value={filtroFecha}
                        onChange={(e) => setFiltroFecha(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                    >
                        <option value="">Fecha: Todas</option>
                        {fechas.map(fecha => (
                            <option key={fecha} value={fecha}>{formatearFecha(fecha)}</option>
                        ))}
                    </select>

                    <select
                        value={filtroTema}
                        onChange={(e) => setFiltroTema(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                    >
                        <option value="">Tema: Todos</option>
                        {temas.map(tema => (
                            <option key={tema} value={tema}>{tema}</option>
                        ))}
                    </select>

                </div>
            </div>

            {clases.length === 0 ? (
                <div className="bg-white rounded-xl shadow border px-6 py-10 text-center text-gray-400">
                    No se encontraron clases.
                </div>
            ) : (
                <>
                    {/* ---------- MOBILE (< md): tarjetas apiladas ---------- */}
                    <div className="md:hidden space-y-3">
                        {clases.map((clase) => (
                            <div key={clase.id} className="bg-white rounded-xl shadow border p-4">
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-800 truncate">{clase.materia}</p>
                                        <p className="text-xs text-gray-400">{clase.codigo} · {clase.docente}</p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        {!soloLectura && (
                                            <>
                                                <button
                                                    title="Editar clase"
                                                    onClick={() => onEditar(clase)}
                                                    className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                                                >
                                                    <PencilSquareIcon className="h-4 w-4" />
                                                </button>
                                                <button
                                                    title="Eliminar clase"
                                                    onClick={() => onEliminar(clase)}
                                                    className="rounded-lg border border-red-300 p-2 text-red-600 hover:bg-red-50"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                                    <p><span className="text-gray-400">Fecha:</span> {formatearFecha(clase.fecha)}</p>
                                    <p><span className="text-gray-400">Tema:</span> {clase.tema}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ---------- DESKTOP/TABLET (>= md): tabla completa ---------- */}
                    <div className="hidden md:block rounded-xl bg-white shadow border overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[720px]">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left px-6 py-4 whitespace-nowrap">Materia</th>
                                        <th className="text-left px-3 py-4 whitespace-nowrap">Comisión</th>
                                        <th className="text-left px-3 py-4 whitespace-nowrap">Docente</th>
                                        <th className="text-left px-3 py-4 whitespace-nowrap">Fecha</th>
                                        <th className="text-left px-3 py-4">Tema</th>
                                        {!soloLectura && (
                                            <th className="text-center px-3 py-4 whitespace-nowrap">Acciones</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {clases.map((clase) => (
                                        <ClaseRow
                                            key={clase.id}
                                            clase={clase}
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