// Indicador visual de pasos del flujo de inscripción.

export default function StepIndicator({ pasoActual }) {
    const pasos = ["Legajo", "Comisión", "Resultado"];

    return (
        <div className="flex items-center justify-center gap-2 mb-6">
            {pasos.map((nombre, idx) => {
                const num = idx + 1;
                const activo = num === pasoActual;
                const pasado = num < pasoActual;

                return (
                    <div key={nombre} className="flex items-center gap-2">
                        <div className={`
                            w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                            ${pasado ? "bg-green-500 text-white"  :
                              activo ? "bg-red-700 text-white"    :
                                       "bg-gray-200 text-gray-400"}
                        `}>
                            {pasado ? "✓" : num}
                        </div>
                        <span className={`
                            hidden sm:inline text-xs font-medium
                            ${activo ? "text-red-700" : "text-gray-400"}
                        `}>
                            {nombre}
                        </span>
                        {idx < pasos.length - 1 && (
                            <div className={`w-8 h-0.5 ${pasado ? "bg-green-400" : "bg-gray-200"}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}