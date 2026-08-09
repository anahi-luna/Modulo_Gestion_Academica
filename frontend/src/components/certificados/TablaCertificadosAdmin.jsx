import EstadoPlanBadge from "../planes/EstadoPlanBadge";
import EstadoCertificadoBadge from "./EstadoCertificadoBadge";

// Tabla de certificados para la vista administrativa.
// Los estados y tipos que muestra provienen de la información obtenida desde el backend.

export default function TablaCertificadosAdmin({ filas, onEmitir, onRevocar, onDescargar, onAdjuntar }) {
    if (filas.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
                No hay alumnos que coincidan.
            </div>
        );
    }

    // ========================================================
    // ACCIONES
    // ========================================================

    function Acciones({ f }) {
        return (
            <div className="flex flex-wrap justify-end gap-2">
                {/* Emitir certificado */}
                {f.elegiblePararCertificado && onEmitir && (
                    <button
                        onClick={() => onEmitir(f)}
                        className="px-2 py-1 rounded-md bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium whitespace-nowrap"
                    >
                        Emitir certificado
                    </button>
                )}

                {/* Certificado existente */}
                {f.certificado && (
                    <>
                        {/* Descargar solamente si tiene un archivo adjunto */}
                        {f.certificado.url_documento && onDescargar && (
                            <button
                                onClick={() => onDescargar(f.certificado)}
                                className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium"
                            >
                                Descargar
                            </button>
                        )}

                        {/* Adjuntar / reemplazar PDF */}
                        {onAdjuntar && (
                            <button
                                onClick={() => onAdjuntar(f.certificado)}
                                className="px-2 py-1 rounded-md bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium whitespace-nowrap"
                            >
                                {f.certificado.url_documento ? "Reemplazar archivo" : "Adjuntar archivo"}
                            </button>
                        )}

                        {/* Revocar */}
                        {onRevocar && f.certificado.estado !== "Revocado" && (
                            <button
                                onClick={() => onRevocar(f.certificado)}
                                className="px-2 py-1 rounded-md bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium"
                            >
                                Revocar
                            </button>
                        )}
                    </>
                )}

                {/* Sin certificado */}
                {!f.elegiblePararCertificado && !f.certificado && (
                    <span className="text-xs text-gray-400">{f.estado_plan}</span>
                )}
            </div>
        );
    }

    return (
        <>
            {/* MOBILE */}
            <div className="md:hidden space-y-3">
                {filas.map((f) => (
                    <article key={f.id_resultado_plan} className="bg-white rounded-xl shadow p-4">
                        <div className="flex justify-between items-start gap-3">
                            <div>
                                <p className="font-semibold text-gray-800">{f.alumno}</p>
                                <p className="text-xs text-gray-400">{f.numero_legajo}</p>
                            </div>
                            {f.certificado && <EstadoCertificadoBadge estado={f.certificado.estado} />}
                        </div>

                        <div className="mt-4 space-y-3">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Estado del plan</p>
                                <EstadoPlanBadge estado={f.estado_plan} />
                            </div>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs text-gray-400">Avance</span>
                                    <span className="text-xs font-semibold text-gray-600">{f.avance}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-700 rounded-full"
                                        style={{ width: `${f.avance}%` }}
                                    />
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 mb-1">Certificado</p>
                                {f.certificado ? (
                                    <div className="flex items-center gap-2">
                                        <EstadoCertificadoBadge estado={f.certificado.estado} />
                                        <span className="text-xs text-gray-400">{f.certificado.tipo}</span>
                                    </div>
                                ) : (
                                    <span className="text-xs text-gray-400">Sin emitir</span>
                                )}
                            </div>

                            <div className="pt-2">
                                <Acciones f={f} />
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            {/* DESKTOP / TABLET */}
            <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[760px]">
                        <thead>
                            <tr className="text-xs text-gray-400 border-b border-gray-100 uppercase tracking-wide">
                                <th className="px-4 py-3 text-left">Alumno</th>
                                <th className="px-4 py-3 text-left">Estado del plan</th>
                                <th className="px-4 py-3 text-left">Avance</th>
                                <th className="px-4 py-3 text-left">Certificado</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filas.map((f) => (
                                <tr key={f.id_resultado_plan} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-semibold text-gray-800">
                                        {f.alumno}
                                        <span className="block text-xs font-normal text-gray-400">
                                            {f.numero_legajo}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <EstadoPlanBadge estado={f.estado_plan} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2 w-28">
                                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-red-700 rounded-full"
                                                    style={{ width: `${f.avance}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-600">{f.avance}%</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {f.certificado ? (
                                            <div className="flex items-center gap-2">
                                                <EstadoCertificadoBadge estado={f.certificado.estado} />
                                                <span className="text-xs text-gray-400">{f.certificado.tipo}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">Sin emitir</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Acciones f={f} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}