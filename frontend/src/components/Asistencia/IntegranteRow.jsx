// Le agrego soloLectura: si es true (el usuario no tiene permiso para
// crear/actualizar asistencias, por ejemplo un alumno mirando la
// planilla) deshabilito los 4 botones de estado y el input de
// observación, pero sigo mostrando todo igual para que pueda consultar.
export default function IntegranteRow({ asistencia, onCambiarEstado, onCambiarObservacion, soloLectura = false }) {

  const estadoActivo = "ring-2 ring-offset-1 ring-gray-500";

  return (
    <tr className="border-b">
      <td className="py-4 pr-2">{asistencia.alumno}</td>
      <td className="pr-2">{asistencia.id_legajo}</td>
      <td>
        {/* flex-wrap: si los 4 botones no entran en una fila, bajan a la siguiente
            en vez de forzar el ancho de toda la fila de la tabla */}
        <div className="flex flex-wrap gap-2 py-2">
          <button
            disabled={soloLectura}
            className={`bg-green-100 text-green-700 rounded-lg px-3 py-1 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${asistencia.id_estado === 1 ? estadoActivo : ""}`}
            onClick={() => onCambiarEstado(asistencia.id_inscripcion, 1)}
          >
            Presente
          </button>
          <button
            disabled={soloLectura}
            className={`bg-yellow-100 text-yellow-700 rounded-lg px-3 py-1 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${asistencia.id_estado === 2 ? estadoActivo : ""}`}
            onClick={() => onCambiarEstado(asistencia.id_inscripcion, 2)}
          >
            Ausente
          </button>
          <button
            disabled={soloLectura}
            className={`bg-red-100 text-red-700 rounded-lg px-3 py-1 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${asistencia.id_estado === 3 ? estadoActivo : ""}`}
            onClick={() => onCambiarEstado(asistencia.id_inscripcion, 3)}
          >
            Justificado
          </button>
          <button
            disabled={soloLectura}
            className={`bg-red-100 text-red-700 rounded-lg px-3 py-1 text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${asistencia.id_estado === 4 ? estadoActivo : ""}`}
            onClick={() => onCambiarEstado(asistencia.id_inscripcion, 4)}
          >
            Tarde
          </button>
        </div>
      </td>
      {/* Celda nueva: input controlado para la observacion de este integrante.
          value sale siempre del estado (asistencia.observacion) y cada
          onChange llama a onCambiarObservacion para actualizar ese estado
          en el componente padre (PanelDetalleClase). */}
      <td>
        <input
          type="text"
          disabled={soloLectura}
          value={asistencia.observacion ?? ""}
          onChange={(e) =>
            onCambiarObservacion(asistencia.id_inscripcion, e.target.value)
          }
          placeholder="Observacion"
          className="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm disabled:opacity-50 disabled:bg-gray-100"
        />
      </td>
    </tr>
  );
}
