// Página de Asistencia: vista para alumnos y docentes, según el rol del usuario.
import PanelesClase from "../components/Asistencia/PanelesClase";
import PanelDetalleClase from "../components/Asistencia/PanelDetalleClase";
import EstadisticaCard from "../components/Asistencia/EstadisticaCard";
import ResumenAsistenciaComisionCard from "../components/Asistencia/ResumenAsistenciaComisionCard";
import { useState, useEffect } from "react";
import useAuth from "../auth/hooks/useAuth";
import { obtenerMiAsistencia } from "../Services/asistenciaAlumnoService";

const ID_LEGAJO_ALUMNO_MOCK = 1; 

export default function Asistencia() {
  const [comisionSeleccionada, setComisionSeleccionada] = useState(null);
  const { user: usuario, hasPermission, hasRole } = useAuth();

  const esAlumno = hasRole("Alumno");

// Si el usuario es un alumno, no puede editar la asistencia, solo puede verla.
// Si el usuario es un docente o administrador, puede editar la asistencia si tiene los permisos correspondientes.
  const puedeEditar = ["inscripcion.asistencias.crear", "inscripcion.asistencias.actualizar"].some(hasPermission);

  if (esAlumno) {
    return <VistaAlumno idLegajo={ID_LEGAJO_ALUMNO_MOCK} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {puedeEditar ? "Gestionar asistencia" : "Asistencia"}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            {puedeEditar
              ? "Seleccioná una comision y registrá la asistencia."
              : "Consultá la asistencia registrada por comisión y clase."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

        <PanelesClase
          comisionSeleccionada={comisionSeleccionada}
          setComisionSeleccionada={setComisionSeleccionada}
        />

        <PanelDetalleClase
          idComision={comisionSeleccionada?.id}
          soloLectura={!puedeEditar}
        />

      </div>

    </div>
  );
}

// Vista del alumno: solo lectura, historial de su propia asistencia
// agrupado por comisión (mismo patrón visual que "Mis calificaciones").
function VistaAlumno({ idLegajo }) {
  const [datos, setDatos] = useState({ porComision: [], resumen: null });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        setDatos(await obtenerMiAsistencia(idLegajo));
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [idLegajo]);

  const resumen = datos.resumen ?? { porcentaje: 0, presentes: 0, ausentes: 0, justificados: 0 };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-red-800 text-white px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold text-red-200 uppercase tracking-wide">Mi asistencia</p>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">Historial de asistencia</h1>
          <p className="text-red-200 text-sm mt-1">Registro de tus presentes, ausentes y justificados</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">

        <div className="bg-white rounded-xl shadow px-4 py-3 text-sm text-gray-500">
          👁 Vista de solo lectura — el registro lo carga tu instructor.
        </div>

        {error && (
          <div className="rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {cargando && <p className="text-sm text-gray-400">Cargando tu asistencia...</p>}

        {!cargando && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <EstadisticaCard titulo="% de asistencia" cantidad={`${resumen.porcentaje}%`} />
              <EstadisticaCard titulo="Presentes" cantidad={resumen.presentes} color="green" />
              <EstadisticaCard titulo="Ausentes" cantidad={resumen.ausentes} color="red" />
              <EstadisticaCard titulo="Justificados" cantidad={resumen.justificados} color="blue" />
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Detalle por comisión
              </p>

              {datos.porComision.length === 0 ? (
                <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
                  Todavía no tenés asistencia registrada.
                </div>
              ) : (
                datos.porComision.map((c) => (
                  <ResumenAsistenciaComisionCard key={c.id_comision} comision={c} />
                ))
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}