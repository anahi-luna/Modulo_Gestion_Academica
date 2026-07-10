import { useEffect, useState } from "react";
import { obtenerMiAsistencia } from "../Services/asistenciaAlumnoService";
import EstadoAsistenciaBadge from "../components/asistenciaAlumno/EstadoAsistenciaBadge";
import ResumenAsistenciaCards from "../components/asistenciaAlumno/ResumenAsistenciaCards";

export default function MiAsistencia({ usuario }) {
  const [clases, setClases] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        const { clases, resumen } = await obtenerMiAsistencia(usuario.id_legajo);
        setClases(clases);
        setResumen(resumen);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [usuario.id_legajo]);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800">Mi asistencia</h1>
        <p className="text-sm text-gray-500 mb-6">
          Registro de asistencia por clase. Esta vista es de solo lectura.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {cargando && <p className="text-sm text-gray-400">Cargando asistencia...</p>}

        {!cargando && resumen && <ResumenAsistenciaCards resumen={resumen} />}

        {!cargando && clases.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
            Todavía no hay clases con asistencia registrada.
          </div>
        )}

        {clases.length > 0 && (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100 uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Materia</th>
                  <th className="px-4 py-3 text-left">Horario</th>
                  <th className="px-4 py-3 text-left">Lugar</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Observación</th>
                </tr>
              </thead>
              <tbody>
                {clases.map((c) => (
                  <tr key={c.id_clase} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700">{c.fecha}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {c.materia}
                      <span className="block text-xs text-gray-400">{c.comision}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{c.hora_inicio} - {c.hora_fin}</td>
                    <td className="px-4 py-3 text-gray-500">{c.lugar}</td>
                    <td className="px-4 py-3"><EstadoAsistenciaBadge estado={c.estado} /></td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{c.observacion || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}