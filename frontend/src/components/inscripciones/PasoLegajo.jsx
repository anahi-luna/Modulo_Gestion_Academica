// Paso 1 del flujo de inscripción.
// Formulario para ingresar el número de legajo.

export default function PasoLegajo({
    nroLegajo,
    onChange,
    onSubmit,
    onGenerarAleatorio,
    error,
    cargando
}) {
    return (
        <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow p-6">
                <h1 className="text-xl font-bold text-gray-800 mb-1">
                    Solicitar inscripción
                </h1>
                <p className="text-sm text-gray-500 mb-6">
                    Ingresá tu número de legajo para buscar las comisiones disponibles.
                </p>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Nro. de Legajo *
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={nroLegajo}
                                onChange={onChange}
                                placeholder="Ej: 000125"
                                maxLength={6}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm
                                           focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                            <button
                                type="button"
                                onClick={onGenerarAleatorio}
                                title="Generar legajo de prueba"
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300
                                           rounded-lg text-xs text-gray-600 transition-colors whitespace-nowrap"
                            >
                                Aleatorio
                            </button>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Legajos de prueba: 000123, 000124, 000125
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!nroLegajo || cargando}
                        className="w-full py-2.5 bg-red-700 hover:bg-red-800 disabled:opacity-50
                                   disabled:cursor-not-allowed text-white font-medium rounded-lg
                                   text-sm transition-colors"
                    >
                        {cargando ? "Buscando..." : "Buscar legajo"}
                    </button>
                </form>
            </div>
        </div>
    );
}