// Componente para seleccionar el estado de asistencia
export default function EstadoSelect({
    idEstado,
    estados,
    onCambiarEstado,
    soloLectura = false,
}) {
    return (
        <select
            disabled={soloLectura}
            value={idEstado ?? ""}
            onChange={(e) =>
                onCambiarEstado(Number(e.target.value))
            }
            className="
                w-full max-w-56 rounded-lg border px-3 py-2
                text-sm font-medium outline-none transition
                focus:ring-2 focus:ring-red-100
            "
        >
            <option value="" disabled hidden>
                Seleccionar estado
            </option>

            {estados.map((estado) => (
                <option
                    key={estado.id_estado_asistencia}
                    value={estado.id_estado_asistencia}
                >
                    {estado.nombre}
                </option>
            ))}
        </select>
    );
}