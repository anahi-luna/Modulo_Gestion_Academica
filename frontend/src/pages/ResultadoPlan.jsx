import { useEffect, useState } from "react";
import EstadisticaCard from "../components/Asistencia/EstadisticaCard";
import TablaResultadoPlan from "../components/planes/TablaResultadoPlan";
import { obtenerTodosLosPlanes, marcarAbandono, generarCertificadoDePlan } from "../Services/planesService";
import { getEstadosResultadoPlan } from "../api/catalogosApi";

// Acá se ve el avance de TODOS los alumnos respecto de su plan.
// Se puede marcar un plan como abandonado y generar el certificado cuando corresponde.

export default function ResultadoPlan() {
  const [planes, setPlanes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    setError(null);
    try {
      const [planesData, estadosResponse] = await Promise.all([
        obtenerTodosLosPlanes(),
        getEstadosResultadoPlan()
      ]);

      const estadosData = Array.isArray(estadosResponse)
        ? estadosResponse
        : estadosResponse.data ?? [];

      setPlanes(planesData);
      setEstados(estadosData);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function handleMarcarAbandono(plan) {
    if (!confirm(`¿Marcar como abandono el plan de ${plan.alumno}?`)) {
      return;
    }
    try {
      await marcarAbandono(plan.id);
      await cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleGenerarCertificado(plan) {
    try {
      await generarCertificadoDePlan(plan);
      alert(`Certificado de finalización generado para ${plan.alumno}. Ya está disponible en el módulo de Certificados.`);
    } catch (err) {
      setError(err.message);
    }
  }

  // Los conteos se hacen utilizando el ID real del catálogo.
  const obtenerIdEstado = (nombre) => estados.find((estado) => estado.nombre === nombre)?.id_estado_resultado_plan;

  const idEnCurso = obtenerIdEstado("En curso");
  const idFinalizado = obtenerIdEstado("Finalizado");
  const idIncompleto = obtenerIdEstado("Incompleto");
  const idAbandonado = obtenerIdEstado("Abandonado");

  const enCurso = planes.filter((p) => p.id_estado_resultado_plan === idEnCurso).length;
  const finalizados = planes.filter((p) => p.id_estado_resultado_plan === idFinalizado).length;
  const incompletos = planes.filter((p) => p.id_estado_resultado_plan === idIncompleto).length;
  const abandonados = planes.filter((p) => p.id_estado_resultado_plan === idAbandonado).length;

  const filtrados = planes.filter((p) => {
    const coincideEstado = filtroEstado ? p.id_estado_resultado_plan === Number(filtroEstado) : true;
    const textoBusqueda = busqueda.toLowerCase();
    const coincideBusqueda = busqueda
      ? p.numero_legajo?.toLowerCase().includes(textoBusqueda) || p.alumno?.toLowerCase().includes(textoBusqueda)
      : true;

    return coincideEstado && coincideBusqueda;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Módulo · Resultado del plan</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mt-1">Resultado del plan</h1>
          <p className="text-gray-500 text-sm sm:text-base">Avance académico del alumno respecto de su plan de estudios</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 mb-6">
          <EstadisticaCard titulo="En curso" cantidad={enCurso} />
          <EstadisticaCard titulo="Finalizados" cantidad={finalizados} color="green" />
          <EstadisticaCard titulo="Incompletos" cantidad={incompletos} color="yellow" />
          <EstadisticaCard titulo="Abandonados" cantidad={abandonados} color="red" />
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">{error}</div>}

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
            {estados.map((estado) => (
              <option key={estado.id_estado_resultado_plan} value={estado.id_estado_resultado_plan}>
                {estado.nombre}
              </option>
            ))}
          </select>
        </div>

        {cargando ? (
          <p className="text-sm text-gray-400">Cargando planes...</p>
        ) : (
          <TablaResultadoPlan
            planes={filtrados}
            estados={estados}
            onMarcarAbandono={handleMarcarAbandono}
            onGenerarCertificado={handleGenerarCertificado}
          />
        )}
      </div>
    </div>
  );
}