import IntegranteRow from "./IntegranteRow";

export default function AsistenciaTabla({ idClase, asistencias, onCambiarEstado }) {
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
            </tr>
          </thead>
          <tbody>
            {asistencias.map((a) => (
              <IntegranteRow
                key={a.id_inscripcion}
                asistencia={a}
                onCambiarEstado={onCambiarEstado}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}