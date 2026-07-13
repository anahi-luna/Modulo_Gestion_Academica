import EvaluacionRow from "./EvaluacionRow";

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
}) {

    const materias = [...new Set(evaluaciones.map(e => e.materia))];
    const comisiones = [...new Set(evaluaciones.map(e => e.codigo))];
    const docentes = [...new Set(evaluaciones.map(e => e.docente))];
    const tipos = [...new Set(evaluaciones.map(e => e.tipo))];

    return (

        <div className="rounded-xl bg-white shadow border overflow-hidden">

            <table className="w-full">

                <thead className="bg-gray-100">

                    <tr>
                        <th className="text-left px-6 py-4">Materia</th>
                        <th className="text-left py-4">Comisión</th>
                        <th className="text-left py-4">Docente</th>
                        <th className="text-left py-4">Tipo</th>
                        <th className="text-left py-4">Título</th>
                        <th className="text-left py-4">Fecha</th>
                        <th className="text-center py-4">Acciones</th>
                    </tr>

                    <tr className="bg-white border-t">

                        <th className="px-6 py-2">
                            <select
                                value={filtroMateria}
                                onChange={(e) => setFiltroMateria(e.target.value)}
                                className="w-full rounded border px-2 py-1"
                            >
                                <option value="">Todas</option>
                                {materias.map(materia => (
                                    <option key={materia} value={materia}>{materia}</option>
                                ))}
                            </select>
                        </th>

                        <th className="py-2">
                            <select
                                value={filtroComision}
                                onChange={(e) => setFiltroComision(e.target.value)}
                                className="w-full rounded border px-2 py-1"
                            >
                                <option value="">Todas</option>
                                {comisiones.map(comision => (
                                    <option key={comision} value={comision}>{comision}</option>
                                ))}
                            </select>
                        </th>

                        <th className="py-2">
                            <select
                                value={filtroDocente}
                                onChange={(e) => setFiltroDocente(e.target.value)}
                                className="w-full rounded border px-2 py-1"
                            >
                                <option value="">Todos</option>
                                {docentes.map(docente => (
                                    <option key={docente} value={docente}>{docente}</option>
                                ))}
                            </select>
                        </th>

                        <th className="py-2">
                            <select
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                                className="w-full rounded border px-2 py-1"
                            >
                                <option value="">Todos</option>
                                {tipos.map(tipo => (
                                    <option key={tipo} value={tipo}>{tipo}</option>
                                ))}
                            </select>
                        </th>

                        <th></th>
                        <th></th>
                        <th></th>

                    </tr>

                </thead>

                <tbody>

                    {evaluaciones.length === 0 ? (

                        <tr>
                            <td colSpan={7} className="py-8 text-center text-gray-400">
                                No se encontraron evaluaciones.
                            </td>
                        </tr>

                    ) : (

                        evaluaciones.map((evaluacion) => (
                            <EvaluacionRow
                                key={evaluacion.id}
                                evaluacion={evaluacion}
                                onEditar={onEditar}
                                onEliminar={onEliminar}
                            />
                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}
