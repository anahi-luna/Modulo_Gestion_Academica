//Acá se ve el avance de TODOS los
// alumnos respecto de su plan de estudios, se puede marcar un plan
// como abandonado y generar el certificado de finalización cuando el
// alumno ya completó el 100% (queda emitido en el módulo de
// Certificados con tipo "Finalización de Plan").

import { useEffect, useState } from "react";
import { usePermissions } from "../context/PermissionsContext";
import EstadisticaCard from "../components/Asistencia/EstadisticaCard";
import TablaResultadoPlan from "../components/planes/TablaResultadoPlan";
import {
  obtenerTodosLosPlanes,
  marcarAbandono,
  generarCertificadoDePlan,
} from "../Services/planesService";

export default function ResultadoPlan() {
  const { usuario } = usePermissions();
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  useEffect(() => { cargarDatos(); }, []);

  async function cargarDatos() {
    setCargando(true);
    setError(null);
    try {
      setPlanes(await obtenerTodosLosPlanes());
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function handleMarcarAbandono(plan) {
    if (!confirm(`¿Marcar como abandono el plan de ${plan.alumno}?`)) return;
    try {
      await marcarAbandono(plan.id_plan);
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleGenerarCertificado(plan) {
    try {
      await generarCertificadoDePlan(plan, usuario?.nombre ?? "Administración");
      alert(`Certificado de finalización generado para ${plan.alumno}. Ya está disponible en el módulo de Certificados.`);
    } catch (err) {
      setError(err.message);
    }
  }

  const enCurso = planes.filter((p) => p.estado === "En curso").length;
  const aprobados = planes.filter((p) => p.estado === "Aprobado").length;
  const incompletos = planes.filter((p) => p.estado === "Incompleto").length;
  const abandonos = planes.filter((p) => p.estado === "Abandono").length;

  const filtrados = planes.filter((p) => {
    const coincideEstado = filtroEstado ? p.estado === filtroEstado : true;
    const coincideBusqueda = busqueda
      ? p.numero_legajo.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.alumno.toLowerCase().includes(busqueda.toLowerCase())
      : true;
    return coincideEstado && coincideBusqueda;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">

      <div className="mb-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Módulo · Resultado del plan</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">Resultado del plan</h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Avance académico del alumno respecto de su plan de estudios
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 mb-6">
        <EstadisticaCard titulo="En curso" cantidad={enCurso} />
        <EstadisticaCard titulo="Aprobados" cantidad={aprobados} color="green" />
        <EstadisticaCard titulo="Incompletos" cantidad={incompletos} color="yellow" />
        <EstadisticaCard titulo="Abandonos" cantidad={abandonos} color="red" />
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por legajo o alumno..."
          className="w-full sm:flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none"
        />
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border border-gray-200 rounded-md px-3 py-2 text-sm w-full sm:w-auto"
        >
          <option value="">Todos los estados</option>
          <option value="En curso">En curso</option>
          <option value="Aprobado">Aprobado</option>
          <option value="Incompleto">Incompleto</option>
          <option value="Abandono">Abandono</option>
        </select>
      </div>

      {cargando ? (
        <p className="text-sm text-gray-400">Cargando planes...</p>
      ) : (
        <TablaResultadoPlan
          planes={filtrados}
          onMarcarAbandono={handleMarcarAbandono}
          onGenerarCertificado={handleGenerarCertificado}
        />
      )}

    </div>
  );
}