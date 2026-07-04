import { useEffect, useState } from "react";
import IntegranteRow from "./IntegranteRow";
import { obtenerAsistenciasPorComision, actualizarAsistencia} from "../../Services/asistenciaAdminService";

export default function AsistenciaTabla({idComision}) {
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    cargarAsistencias();
  }, [idComision]);

  async function cargarAsistencias() {
    const resultado = await obtenerAsistenciasPorComision(idComision);
    setAsistencias(resultado);
  }

  async function actualizarEstado(idAsistencia, idEstado) {
    await actualizarAsistencia(idAsistencia, idEstado);
    cargarAsistencias();
  }

  return (
    <div className="px-6 pb-6">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3">Integrante</th>
            <th className="text-left">DNI</th>
            <th className="text-left">Asistencia</th>
          </tr>
        </thead>

        <tbody>
          {asistencias.map((a) => (
            <IntegranteRow
              key={a.id}
              asistencia={a}
              onActualizarEstado={actualizarEstado}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}