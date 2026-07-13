export default function EvaluacionSelect({
    evaluaciones,
    evaluacionSeleccionada,
    setEvaluacionSeleccionada,
}) {

    return (

        <div className="border-b bg-gray-50 px-8 py-4">

            <label className="block text-sm font-medium text-gray-700 mb-2">
                Evaluación
            </label>

            <select
                value={evaluacionSeleccionada?.id ?? ""}
                onChange={(e) => {

                    const evaluacion = evaluaciones.find(
                        ev => ev.id === Number(e.target.value)
                    );

                    setEvaluacionSeleccionada(evaluacion);

                }}
                className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-red-600 focus:ring-2 focus:ring-red-200"
            >

                <option value="">
                    Seleccione una evaluación
                </option>

                {evaluaciones.map((evaluacion) => (

                    <option
                        key={evaluacion.id}
                        value={evaluacion.id}
                    >
                        {evaluacion.tipo} - {evaluacion.titulo}
                    </option>

                ))}

            </select>

        </div>

    );

}
