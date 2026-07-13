import IntegranteRow from "./IntegranteRow";

// Recibe onCambiarObservacion además de onCambiarEstado: son dos funciones
// que vienen desde PanelDetalleClase.jsx (el padre) y se pasan hacia abajo
// hasta llegar al input de cada fila.
export default function AsistenciaTabla({ idClase, asistencias, onCambiarEstado, onCambiarObservacion }) {
  return (
    <div className="px-4 sm:px-6 pb-6">
      {/* overflow-x-auto: si la tabla no entra en el ancho de la pantalla,
          en vez de romper el layout, aparece scroll horizontal SOLO acá */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Integrante</th>
              <th className="text-left">Legajo</th>
              <th className="text-left">Asistencia</th>
              {/* Columna nueva: para escribir una observacion por integrante */}
              <th className="text-left">Observacion</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((a) => (
              <IntegranteRow
                key={a.id_inscripcion}
                asistencia={a}
                onCambiarEstado={onCambiarEstado}
                onCambiarObservacion={onCambiarObservacion}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}