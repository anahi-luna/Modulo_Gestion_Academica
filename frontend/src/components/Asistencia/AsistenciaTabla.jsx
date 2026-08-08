import IntegranteRow from "./IntegranteRow";

// Recibe onCambiarObservacion además de onCambiarEstado: son dos funciones
// que vienen desde PanelDetalleClase.jsx (el padre) y se pasan hacia abajo
// hasta llegar al input de cada fila.
export default function AsistenciaTabla({ idClase, asistencias, estados,onCambiarEstado, onCambiarObservacion, soloLectura = false, onEliminarAsistencia }) {
  return (
    <div className="px-4 sm:px-6 pb-6">
      {/* overflow-x-auto: si la tabla no entra en el ancho de la pantalla,
          en vez de romper el layout, aparece scroll horizontal SOLO acá */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Integrante</th>
              <th className="text-left">Legajo</th>
              <th className="text-left">Asistencia</th>
              {/* Columna nueva: para escribir una observacion por integrante */}
              <th className="text-left">Observación</th>
              <th className="text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((a) => (
              <IntegranteRow
                key={a.id_inscripcion}
                asistencia={a}
                estados={estados}
                onCambiarEstado={onCambiarEstado}
                onCambiarObservacion={onCambiarObservacion}
                soloLectura={soloLectura}
                onEliminarAsistencia={onEliminarAsistencia}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}