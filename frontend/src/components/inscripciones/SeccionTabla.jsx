// Sección de la tabla de inscripciones del admin.
// Agrupa las filas bajo un título (Aceptadas o Pendientes).

import FilaInscripcion from "./FilaInscripcion";

export default function SeccionTabla({
    titulo,
    icono,
    items,
    colorBadge,
    onValidar,
    onEliminar
}) {
    return (
        <div className="mb-6 bg-white rounded-xl shadow overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
                <span className="font-semibold text-gray-700">
                    {icono} {titulo}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold text-white ${colorBadge}`}>
                    {items.length}
                </span>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-xs text-gray-400 border-b border-gray-100 uppercase tracking-wide">
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Legajo</th>
                            <th className="px-4 py-3 text-left">Integrante</th>
                            <th className="px-4 py-3 text-left">Comisión</th>
                            <th className="px-4 py-3 text-left">Estado</th>
                            <th className="px-4 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(ins => (
                            <FilaInscripcion
                                key={ins.id}
                                inscripcion={ins}
                                onValidar={onValidar}
                                onEliminar={onEliminar}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}