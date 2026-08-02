// Componente para mostrar la página de inicio del alumno, con un banner, un resumen de sus inscripciones, 
// plan, clases y asistencia, y un listado de próximas clases por comisión.

import { useEffect, useState } from "react";
import BannerAlumno from "./BannerAlumno";
import ResumenActivo from "./ResumenActivo";
import ResumenVacio from "./ResumenVacio";
import ProximasClasesPorComision from "./ProximasClasesPorComision";
import Alert from "../Alert";
import { obtenerMisInscripciones } from "../../Services/inscripcionesService";
import { obtenerMiPlan } from "../../Services/planesService";
import { obtenerMisClases } from "../../Services/clasesAlumnoService";
import { obtenerMiAsistencia } from "../../Services/asistenciaAlumnoService";
import { obtenerMisCertificados } from "../../Services/certificadosService";
import { obtenerIdLegajo } from "../../config/legajo";
 
const ESTILOS_ESTADO_PLAN = {
  Finalizado: "bg-green-100 text-green-700",
  "En curso": "bg-blue-100 text-blue-700",
  Incompleto: "bg-yellow-100 text-yellow-700",
  Abandonado: "bg-red-100 text-red-700",
};

export default function HomeAlumno({ usuario }) {
  const idLegajo = obtenerIdLegajo(usuario);
  const [inscripciones, setInscripciones] = useState([]);
  const [plan, setPlan] = useState(null);
  const [clasesInfo, setClasesInfo] = useState({ porComision: [], proximaClase: null });
  const [porcentajeAsistencia, setPorcentajeAsistencia] = useState(null);
  const [certificadosObtenidos, setCertificadosObtenidos] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idLegajo) {
      setCargando(false);
      setError("No pudimos identificar tu legajo. Volvé a iniciar sesión o contactá a soporte.");
      return;
    }
    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        const [misInscripciones, miPlan, misClases, miAsistencia, misCertificados] =
          await Promise.all([
            obtenerMisInscripciones(usuario?.id_legajo),
            obtenerMiPlan(usuario?.id_legajo),
            obtenerMisClases(usuario?.id_legajo),
            obtenerMiAsistencia(usuario?.id_legajo),
            obtenerMisCertificados(usuario?.id_legajo),
          ]);
        setInscripciones(misInscripciones);
        setPlan(miPlan);
        setClasesInfo(misClases);
        setPorcentajeAsistencia(miAsistencia.resumen.porcentaje);
        setCertificadosObtenidos(
          misCertificados.filter((c) => c.estado === "Emitido").length
        );
      } catch (error) {
        console.error("No pude cargar el resumen del alumno", error);
        setError("No se pudo cargar tu resumen. Probá recargar la página.");
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [usuario?.id_legajo]);

  const tieneInscripciones = inscripciones.length > 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <BannerAlumno usuario={usuario} tieneInscripciones={tieneInscripciones} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {error && <Alert tipo="error" titulo="Error" mensaje={error} onCerrar={() => setError(null)} />}

        {cargando && <p className="text-sm text-gray-400">Cargando tu resumen...</p>}

        {!cargando && (
          tieneInscripciones ? (
            <ResumenActivo
              inscripciones={inscripciones}
              porcentajeAsistencia={porcentajeAsistencia}
              certificadosObtenidos={certificadosObtenidos}
            />
          ) : (
            <ResumenVacio />
          )
        )}

        {/* Estado del plan + próxima clase: los muestro apenas hay
            algo que contar (plan asignado o alguna clase programada) */}
        {!cargando && (plan || clasesInfo.proximaClase) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Estado del plan
              </p>
              {plan ? (
                <>
                  <span className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${ESTILOS_ESTADO_PLAN[plan.estado] ?? "bg-gray-100 text-gray-600"}`}>
                    {plan.estado}
                  </span>
                  <p className="text-xs text-gray-400 mt-2">Plan Nº {plan.id_plan}</p>
                </>
              ) : (
                <p className="text-sm text-gray-400">Todavía no tenés un plan asignado.</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Próxima clase
              </p>
              {clasesInfo.proximaClase ? (
                <>
                  <p className="font-medium text-gray-800">{clasesInfo.proximaClase.tema}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {clasesInfo.proximaClase.fecha} · {clasesInfo.proximaClase.docente}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400">No tenés clases programadas próximamente.</p>
              )}
            </div>

          </div>
        )}

        {/* Próximas clases por comisión */}
        {!cargando && tieneInscripciones && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Próximas clases
            </p>
            <ProximasClasesPorComision porComision={clasesInfo.porComision} />
          </div>
        )}

      </div>
    </div>
  );
}