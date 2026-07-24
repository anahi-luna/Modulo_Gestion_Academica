// Le agrego soloLectura: si es true (el usuario no tiene permiso para
// crear/actualizar asistencias, por ejemplo un alumno mirando la
// planilla) deshabilito los 4 botones de estado y el input de

import EstadoSelect from "./EstadoSelect";
import { TrashIcon } from "@heroicons/react/24/outline";

// observación, pero sigo mostrando todo igual para que pueda consultar.
export default function IntegranteRow({ asistencia, onCambiarEstado, onCambiarObservacion, soloLectura = false, onEliminarAsistencia }) {

  const estadoActivo = "ring-2 ring-offset-1 ring-gray-500";

  return (
    <tr className="border-b">
      <td className="py-4 pr-2">{asistencia.alumno}</td>
      <td className="pr-2">{asistencia.id_legajo}</td>
      <td>
        {/* flex-wrap: si los 4 botones no entran en una fila, bajan a la siguiente
            en vez de forzar el ancho de toda la fila de la tabla */}
        <div className="flex flex-wrap gap-2 py-2">
          <EstadoSelect
            idEstado={asistencia.id_estado}
            soloLectura={soloLectura}
            onCambiarEstado={(nuevoEstado) =>
              onCambiarEstado(
                asistencia.id_inscripcion,
                nuevoEstado
              )
            }
          />
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
          placeholder="Observación"
          className="w-full rounded-lg border border-gray-300 px-2 py-1 text-sm disabled:opacity-50 disabled:bg-gray-100"
        />
      </td>

      <td className="pl-2">
          {!soloLectura && asistencia.id && (
            <button
              type="button"
              onClick={() => onEliminarAsistencia(asistencia)}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-700 px-3 py-2 text-sm font-medium text-white hover:bg-red-800"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          )}
      </td>
    </tr>
  );
}
