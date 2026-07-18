// Vista "Mi plan": el alumno consulta el avance de su propio plan de
// estudios. Es la contracara, del lado del alumno, de "Resultado del
// plan" (pages/ResultadoPlan.jsx), que ve el personal del instituto.
// No depende de ningún permiso del microservicio: cualquier alumno ve
// su propio plan, igual que ya pasa con /inscripciones (pedir una
// inscripción) y con la vista de alumno de Certificados.jsx.

import { useEffect, useState } from "react";
import { usePermissions } from "../context/PermissionsContext";
import { obtenerMiPlan } from "../Services/planesService";

const ID_LEGAJO_ALUMNO_MOCK = 1; // mismo TODO que en Calificaciones.jsx

const ESTILOS_ESTADO = {
  Aprobado: "bg-green-100 text-green-700",
  "En curso": "bg-blue-100 text-blue-700",
  Incompleto: "bg-yellow-100 text-yellow-700",
  Abandono: "bg-red-100 text-red-700",
};

export default function MiPlan() {
  const { usuario } = usePermissions();
  const esAlumno = usuario?.usuario === "alumno";

  const [plan, setPlan] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!esAlumno) {
      setCargando(false);
      return;
    }
    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        setPlan(await obtenerMiPlan(ID_LEGAJO_ALUMNO_MOCK));
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [esAlumno]);

  if (!esAlumno) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400 max-w-sm">
          Esta vista es exclusiva para alumnos. Si necesitás ver el avance
          de plan de todos los alumnos, entrá a "Resultado del plan".
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-red-800 text-white px-4 sm:px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold text-red-200 uppercase tracking-wide">Mi plan</p>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">Avance del plan de estudios</h1>
          <p className="text-red-200 text-sm mt-1">Tu progreso académico respecto del plan asignado</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">

        <div className="bg-white rounded-xl shadow px-4 py-3 text-sm text-gray-500">
           Vista de solo lectura — consultá con administración ante cualquier duda.
        </div>

        {error && (
          <div className="rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {cargando && <p className="text-sm text-gray-400">Cargando tu plan...</p>}

        {!cargando && !plan && !error && (
          <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
            Todavía no tenés un plan de estudios asignado.
          </div>
        )}

        {!cargando && plan && (
          <>
            <div className="bg-white rounded-xl shadow p-5 sm:p-6">
              <p className="font-bold text-gray-800">{plan.codigo_plan}</p>
              <p className="text-xs text-gray-400 mb-4">Estado general de tu plan</p>

              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-xs text-gray-400">Estado actual</p>
                  <span className={`inline-block mt-1 px-3 py-1 rounded-lg text-sm font-medium ${ESTILOS_ESTADO[plan.estado] ?? "bg-gray-100 text-gray-600"}`}>
                    {plan.estado}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Avance</p>
                  <p className="text-2xl font-bold text-gray-800">{plan.avance}%</p>
                </div>
              </div>

              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-red-700 rounded-full" style={{ width: `${plan.avance}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow p-5 text-center">
                <p className="text-xs text-gray-400">Materias totales</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{plan.materias_totales}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-5 text-center">
                <p className="text-xs text-gray-400">Materias aprobadas</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{plan.materias_aprobadas}</p>
              </div>
              <div className="bg-white rounded-xl shadow p-5 text-center">
                <p className="text-xs text-gray-400">Materias finalizadas</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{plan.materias_finalizadas}</p>
              </div>
            </div>

            {plan.estado === "Aprobado" && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
                ✓ Completaste tu plan de estudios. Revisá tu certificado en la sección "Mis certificados".
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}