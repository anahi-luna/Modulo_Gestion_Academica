// Paso 2 del flujo de inscripción.
// Muestra el legajo encontrado, el historial y la grilla de comisiones.

import ComisionCard from "../ComisionCard";
import EstadoBadge from "./EstadoBadge";

export default function PasoComision({
    legajoData,
    comisiones,
    comisionElegida,
    onSeleccionarComision,
    historial,
    mostrarHistorial,
    onToggleHistorial,
    error,
    enviando,
    onConfirmar,
    onCambiarLegajo
}) {
    return (
        <div className="space-y-6">

            {/* Tarjeta del legajo encontrado */}
            <div className="bg-white rounded-2xl shadow p-4 flex flex-col sm:flex-row
                            sm:items-center justify-between gap-3">
                <div>
                    <p className="text-xs text-gray-400 font-mono">
                        Legajo #{legajoData.numero_legajo}
                    </p>
                    <p className="font-bold text-gray-800">
                        {legajoData.nombre} {legajoData.apellido}
                    </p>
                    {/*<p className="text-sm text-gray-500">{legajoData.rango}</p>*/}
                </div>
                <button
                    onClick={onCambiarLegajo}
                    className="text-xs text-gray-400 hover:text-gray-600 underline"
                >
                    Cambiar legajo
                </button>
            </div>

            {/* Historial (solo si tiene) */}
            {historial.length > 0 && (
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <button
                        onClick={onToggleHistorial}
                        className="w-full flex items-center justify-between px-4 py-3
                                   text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <span>Historial de inscripciones ({historial.length})</span>
                        <span>{mostrarHistorial ? "▲" : "▼"}</span>
                    </button>
                    {mostrarHistorial && (
                        <div className="divide-y divide-gray-100">
                            {historial.map((ins) => (
                                <div key={ins.id} className="px-4 py-3 flex items-center justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">{ins.materia}</p>
                                        <p className="text-xs text-gray-400">{ins.comision} · {ins.horario}</p>
                                    </div>
                                    <EstadoBadge estado={ins.estado} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Grilla de comisiones */}
            <div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Elegir comisión</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Seleccioná la comisión en la que querés inscribirte.
                    Las que aparecen opacas no tienen cupo disponible.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {comisiones.map((com) => (
                        <ComisionCard
                            key={com.id_comision_asignatura}
                            comision={com}
                            seleccionada={comisionElegida?.id_comision_asignatura === com.id_comision_asignatura}
                            onSeleccionar={onSeleccionarComision}
                        />
                    ))}
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700 mb-4">
                        {error}
                    </div>
                )}

                {/* Panel de confirmación IMPORTANTE CHEQUEAR SI FUNCIONA, SINO CAMBIAR DAtOS */}
                {comisionElegida && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4
                                    flex flex-col sm:flex-row items-start sm:items-center
                                    justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-red-800">
                                Seleccionaste: {comisionElegida.materia}
                            </p>
                            <p className="text-xs text-red-600">
                                {comisionElegida.codigo} · {comisionElegida.modalidad}
                            </p>
                        </div>
                        <button
                            onClick={onConfirmar}
                            disabled={enviando}
                            className="w-full sm:w-auto px-6 py-2.5 bg-red-700 hover:bg-red-800
                                       disabled:opacity-50 text-white font-medium rounded-lg
                                       text-sm transition-colors"
                        >
                            {enviando ? "Procesando..." : "Confirmar inscripción"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}