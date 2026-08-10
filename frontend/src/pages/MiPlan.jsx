import { useEffect, useState } from "react";
import useAuth from "../auth/hooks/useAuth";
import { obtenerMiPlan, obtenerMisMateriasDePlan } from "../Services/planesService";
import { getEstadosResultadoPlan } from "../api/catalogosApi";
import ResumenMateriaPlanCard from "../components/planes/ResumenMateriaPlanCard";
import { hasPermission } from "../auth/utils/permissions";

// Vista del plan de estudios del alumno:
// resumen general del plan y detalle materia por materia.
// Solo lectura.

export default function MiPlan() {
  const { user: usuario, hasPermission } = useAuth();
  const esAlumno = hasPermission("inscripcion.resultado_plan.leer_propio");

  const [planes, setPlanes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [estados, setEstados] = useState([]);
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
        const [planesData, materiasData, estadosResponse] = await Promise.all([
          obtenerMiPlan(),
          obtenerMisMateriasDePlan(),
          getEstadosResultadoPlan(),
        ]);
        console.log(planesData);
        const estadosData = Array.isArray(estadosResponse)
          ? estadosResponse
          : estadosResponse.data ?? [];

        setPlanes(planesData);
        setMaterias(materiasData);
        setEstados(estadosData);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    cargar();
  }, [esAlumno, usuario]);

  if (!esAlumno) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-500 max-w-md w-full">
          Esta vista es exclusiva para alumnos. Si necesitás ver el avance de plan de todos los alumnos, entrá a "Resultado del plan".
        </div>
      </div>
    );
  }

  const estadoFinalizado = estados.find((estado) => estado.nombre === "Finalizado");

  const estilosEstado = {
    [estadoFinalizado?.id_estado_resultado_plan]: "bg-green-100 text-green-700",
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        <div className="mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Mi plan</h1>
          <p className="text-gray-500 text-sm sm:text-base">Avance del plan de estudios</p>
          <p className="text-gray-500 text-sm">Tu progreso académico respecto del plan asignado</p>
        </div>

        <div className="bg-white rounded-xl shadow px-4 py-3 text-sm text-gray-500">
          Vista de solo lectura — consultá con administración ante cualquier duda.
        </div>

        {error && <div className="rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">{error}</div>}

        {cargando && <p className="text-sm text-gray-400">Cargando tu plan...</p>}

        {!cargando && planes.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
            Todavía no tenés un plan de estudios asignado.
          </div>
        )}

        {!cargando && planes.map((plan) =>{

          const estadoVisual = estilosEstado[plan.id_estado_resultado_plan] ?? "bg-gray-100 text-gray-600";
          return(
            <div key={plan.id_plan}>
                
                  <div className="bg-white rounded-xl shadow p-5 sm:p-6">
                    <p className="font-bold text-gray-800">Plan Nº {plan.id_plan}</p>
                    <p className="text-xs text-gray-400 mb-4">Estado general de tu plan</p>

                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <p className="text-xs text-gray-400">Estado actual</p>
                        <span className={`inline-block mt-1 px-3 py-1 rounded-lg text-sm font-medium ${estadoVisual}`}>
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

                  {plan.id_estado_resultado_plan === estadoFinalizado?.id_estado_resultado_plan && (
                    <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">
                      ✓ Completaste tu plan de estudios. Revisá tu certificado en la sección "Mis certificados".
                    </div>
                  )}

                  <div>
                    <h2 className="text-base font-semibold text-gray-700 mb-3">Materias</h2>

                    {materias.length === 0 && (
                      <div className="bg-white rounded-xl shadow px-6 py-8 text-center text-sm text-gray-400">
                        Todavía no tenés materias cursadas.
                      </div>
                    )}

                    {materias.map((materia) => (
                      <ResumenMateriaPlanCard key={materia.id_comision_asignatura} materia={materia} />
                    ))}
                  </div>
                
            </div>
          );
          
        })}
      </div>
    </div>
  );
}