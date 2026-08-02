// Paso 1 del flujo de inscripción.
// Formulario para ingresar el número de legajo.

export default function PasoLegajo({
    nroLegajo,
    onChange,
    onSubmit,
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
                        <label htmlFor="numero-legajo" className="block text-xs font-medium text-gray-600 mb-1">
                            Nro. de Legajo *
                        </label>
                        <input
                            id="numero-legajo"
                            type="text"
                            value={nroLegajo}
                            onChange={onChange}
                            placeholder="Ej: LEG-000"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                                       focus:outline-none focus:ring-2 focus:ring-red-300"
                        />
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