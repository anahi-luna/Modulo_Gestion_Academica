// Sección de la tabla de inscripciones del admin.
// Agrupa las filas bajo un título (Aceptadas o Pendientes).

import EstadoBadge from "./EstadoBadge";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";

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

            {items.length === 0 ? (
                <div className="px-5 py-8 text-center text-sm text-gray-400">
                    No hay inscripciones en esta sección.
                </div>
            ) : (
                <>
                    <div className="md:hidden divide-y divide-gray-100">
                        {items.map((ins) => (
                            <div key={ins.id} className="p-4">
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-800 truncate">{ins.alumno}</p>
                                        <p className="text-xs text-gray-400 font-mono">INS-{ins.id} · Legajo {ins.id_legajo}</p>
                                    </div>
                                    <EstadoBadge estado={ins.estado} />
                                </div>
                                <p className="text-sm text-gray-600 mb-3">{ins.comision}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onValidar(ins)}
                                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium"
                                    >
                                        <CheckIcon className="h-4 w-4" /> Validar
                                    </button>
                                    <button
                                        onClick={() => onEliminar(ins)}
                                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium"
                                    >
                                        <TrashIcon className="h-4 w-4" /> Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm min-w-[720px]">
                            <thead>
                                <tr className="text-xs text-gray-400 border-b border-gray-100 uppercase tracking-wide">
                                    <th className="px-4 py-3 text-left whitespace-nowrap">ID</th>
                                    <th className="px-4 py-3 text-left whitespace-nowrap">Legajo</th>
                                    <th className="px-4 py-3 text-left">Integrante</th>
                                    <th className="px-4 py-3 text-left">Comisión</th>
                                    <th className="px-4 py-3 text-left whitespace-nowrap">Estado</th>
                                    <th className="px-4 py-3 text-right whitespace-nowrap">Acciones</th>
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
                </>
            )}
        </div>
    );
}

function FilaInscripcion({ inscripcion, onValidar, onEliminar }) {
    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 text-xs text-gray-400 font-mono whitespace-nowrap">
                INS-{inscripcion.id}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                {inscripcion.id_legajo}
            </td>
            <td className="px-4 py-3 font-semibold text-gray-800">
                {inscripcion.alumno}
            </td>
            <td className="px-4 py-3 text-sm text-gray-600">
                {inscripcion.comision}
            </td>
            <td className="px-4 py-3 whitespace-nowrap">
                <EstadoBadge estado={inscripcion.estado} />
            </td>
            <td className="px-4 py-3">
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => onValidar(inscripcion)}
                        title="Validar"
                        className="p-1.5 rounded-md bg-green-100 hover:bg-green-200 text-green-700"
                    >
                        <CheckIcon className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onEliminar(inscripcion)}
                        title="Eliminar"
                        className="p-1.5 rounded-md bg-red-100 hover:bg-red-200 text-red-700"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}