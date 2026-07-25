// Componente para seleccionar una clase
export default function ClaseSelect({
    clases,
    claseSeleccionada,
    setClaseSeleccionada,
}) {

    return (

        <div className="border-b bg-gray-50 px-8 py-4">

            <label htmlFor="select-clase" className="block text-sm font-medium text-gray-700 mb-2">
                Clase
            </label>

            <select
                id="select-clase"
                value={claseSeleccionada?.id ?? ""}
                onChange={(e) => {

                    const clase = clases.find(
                        c => c.id === Number(e.target.value)
                    );

                    setClaseSeleccionada(clase);

                }}
                className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-red-600 focus:ring-2 focus:ring-red-200"
            >

                <option value="">
                    Seleccione una clase
                </option>

                {clases.map((clase) => (

                    <option
                        key={clase.id}
                        value={clase.id}
                    >
                        Clase {clase.numero_clase} - {clase.tema}
                    </option>

                ))}

            </select>

        </div>

    );

}