import { useEffect, useState } from "react";
import IntegranteRow from "./IntegranteRow";

export default function AsistenciaTabla({idClase, asistencias, onCambiarEstado}) {
  

  

  return (
    <div className="px-6 pb-6">
      <table className="w-full">
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
  );
}