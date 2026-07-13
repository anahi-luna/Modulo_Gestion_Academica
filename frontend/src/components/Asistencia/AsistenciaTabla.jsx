import { useEffect, useState } from "react";
import IntegranteRow from "./IntegranteRow";

export default function AsistenciaTabla({idClase, asistencias, onCambiarEstado, onCambiarObservacion}) {
  

  

  return (
    <div className="px-6 pb-6">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3">Integrante</th>
            <th className="text-left">Legajo</th>
            <th className="text-left">Asistencia</th>
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
  );
}