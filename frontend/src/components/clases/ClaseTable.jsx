import ClaseRow from "./ClaseRow";

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
}) {

    const materias = [...new Set(clases.map(c => c.materia))];
    const comisiones = [...new Set(clases.map(c => c.codigo))];
    const docentes = [...new Set(clases.map(c => c.docente))];
    const fechas = [...new Set(clases.map(c => c.fecha))];
    const temas = [...new Set(clases.map(c => c.tema))];

    return (

        <div className="rounded-xl bg-white shadow border overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full">

                <thead className="bg-gray-100">

                    <tr>

                        <th className="text-left px-6 py-4">Materia</th>
                        <th className="text-left py-4">Comisión</th>
                        <th className="text-left py-4">Docente</th>
                        <th className="text-left py-4">Fecha</th>
                        <th className="text-left py-4">Tema</th>
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
                                    <option key={materia} value={materia}>
                                        {materia}
                                    </option>
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
                                    <option key={comision} value={comision}>
                                        {comision}
                                    </option>
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
                                    <option key={docente} value={docente}>
                                        {docente}
                                    </option>
                                ))}

                            </select>

                        </th>

                        <th className="py-2">

                            <select
                                value={filtroFecha}
                                onChange={(e) => setFiltroFecha(e.target.value)}
                                className="w-full rounded border px-2 py-1"
                            >
                                <option value="">Todas</option>

                                {fechas.map(fecha => (
                                    <option key={fecha} value={fecha}>
                                        {fecha}
                                    </option>
                                ))}

                            </select>

                        </th>

                        <th className="py-2">

                            <select
                                value={filtroTema}
                                onChange={(e) => setFiltroTema(e.target.value)}
                                className="w-full rounded border px-2 py-1"
                            >
                                <option value="">Todos</option>

                                {temas.map(tema => (
                                    <option key={tema} value={tema}>
                                        {tema}
                                    </option>
                                ))}

                            </select>

                        </th>

                        <th></th>

                    </tr>

                </thead>

                <tbody>

                    {clases.length === 0 ? (

                        <tr>

                            <td
                                colSpan={6}
                                className="py-8 text-center text-gray-400"
                            >

                                No se encontraron clases.

                            </td>

                        </tr>

                    ) : (

                        clases.map((clase) => (

                            <ClaseRow
                                key={clase.id}
                                clase={clase}
                                onEditar={onEditar}
                                onEliminar={onEliminar}
                            />

                        ))

                    )}

                </tbody>

            </table>

        </div>
        </div>

    );

}