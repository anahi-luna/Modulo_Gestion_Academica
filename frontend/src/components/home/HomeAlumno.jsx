// Esta vista solo se muestra cuando el usuario logueado es el alumno
// de prueba (usuario.usuario === "alumno"), decidido en Home.jsx —
// mismo criterio que ya se usa en Calificaciones.jsx y Certificados.jsx.

import { useEffect, useState } from "react";
import BannerAlumno from "./BannerAlumno";
import ResumenActivo from "./ResumenActivo";
import ResumenVacio from "./ResumenVacio";
import ProximasClasesPorComision from "./ProximasClasesPorComision";
import { obtenerMisInscripciones } from "../../Services/inscripcionesService";
import { obtenerMiPlan } from "../../Services/planesService";
import { obtenerMisClases } from "../../Services/clasesAlumnoService";
import { obtenerMiAsistencia } from "../../Services/asistenciaAlumnoService";
import { obtenerMisCertificados } from "../../Services/certificadosService";

const ID_LEGAJO_ALUMNO_MOCK = 1; // mismo TODO que en Calificaciones.jsx y Certificados.jsx

const ESTILOS_ESTADO_PLAN = {
  Aprobado: "bg-green-100 text-green-700",
  "En curso": "bg-blue-100 text-blue-700",
  Incompleto: "bg-yellow-100 text-yellow-700",
  Abandono: "bg-red-100 text-red-700",
};

export default function HomeAlumno({ usuario }) {
  const [inscripciones, setInscripciones] = useState([]);
  const [plan, setPlan] = useState(null);
  const [clasesInfo, setClasesInfo] = useState({ porComision: [], proximaClase: null });
  const [porcentajeAsistencia, setPorcentajeAsistencia] = useState(null);
  const [certificadosObtenidos, setCertificadosObtenidos] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      try {
        const [misInscripciones, miPlan, misClases, miAsistencia, misCertificados] =
          await Promise.all([
            obtenerMisInscripciones(ID_LEGAJO_ALUMNO_MOCK),
            obtenerMiPlan(ID_LEGAJO_ALUMNO_MOCK),
            obtenerMisClases(ID_LEGAJO_ALUMNO_MOCK),
            obtenerMiAsistencia(ID_LEGAJO_ALUMNO_MOCK),
            obtenerMisCertificados(ID_LEGAJO_ALUMNO_MOCK),
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
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  const tieneInscripciones = inscripciones.length > 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <BannerAlumno usuario={usuario} tieneInscripciones={tieneInscripciones} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

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
                  <p className="text-xs text-gray-400 mt-2">Plan {plan.codigo_plan}</p>
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