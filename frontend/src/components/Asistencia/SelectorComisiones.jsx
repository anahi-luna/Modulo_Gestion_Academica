export default function SelectorComisiones({
    comisiones = [],
    comisionSeleccionada,
    onCambiarComision,
}) {
    {/*Hace que las solapas se muestren cuando hay mas de una comision */}
    if (comisiones.length <= 1) {
        return null;
    }

    return (
        <section className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
            <p className="mb-2 text-sm font-semibold text-gray-700">
                Comisión
            </p>

            <div className="flex gap-2 overflow-x-auto pb-2">
                {comisiones.map((comision) => {
                    const activa =
                        comisionSeleccionada?.id === comision.id;

                    return (
                        <button
                            key={comision.id}
                            type="button"
                            onClick={() =>
                                onCambiarComision(comision)
                            }
                            className={`
                                shrink-0 whitespace-nowrap rounded-full
                                border px-4 py-2 text-sm font-medium
                                transition-colors
                                ${
                                    activa
                                        ? "border-red-700 bg-red-700 text-white"
                                        : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                }
                            `}
                        >
                            {comision.codigo}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}