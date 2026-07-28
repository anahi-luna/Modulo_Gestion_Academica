//vista para el alumno: solo lectura, muestra su propia asistencia en cada comisión en la que está inscripto. 
//vista para el personal (admin, profesor, etc): elijo una comisión y veo/cargo la asistencia de todos 
// los alumnos de una clase.
import { useEffect, useState } from "react";
import useAuth from "../auth/hooks/useAuth";

import PanelesComision from "../components/Calificaciones/PanelesComision";
import PanelDetalleCalificaciones from "../components/Calificaciones/PanelDetalleCalificaciones";
import ResumenComisionCard from "../components/Calificaciones/ResumenComisionCard";
import { obtenerMisCalificaciones } from "../Services/calificacionesAlumnoService";
import { obtenerIdLegajo } from "../config/legajo";



export default function Calificaciones() {
  const { user: usuario, hasPermission, hasRole } = useAuth();

  const esAlumno = hasRole("Alumno");
// Si el usuario es un alumno, no puede editar la calificación, solo puede verla.
// Si el usuario es un docente o administrador, puede editar la calificación si tiene los permisos correspondientes.
  const puedeEditar = ["inscripcion.calificaciones.crear", "inscripcion.calificaciones.actualizar"].some(hasPermission);
  const idLegajo = obtenerIdLegajo(usuario)

  if (esAlumno) {
    return <VistaAlumno idLegajo={idLegajo} />;
  }

  return <VistaComisiones puedeEditar={puedeEditar} />;
}

// Vista para el personal (admin, profesor, etc): elijo una comisión y
// veo/cargo las notas de todos los alumnos de una evaluación.
function VistaComisiones({ puedeEditar }) {
  const [comisionSeleccionada, setComisionSeleccionada] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {puedeEditar ? "Gestionar calificaciones" : "Calificaciones"}
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            {puedeEditar
              ? "Seleccioná una comisión y cargá las notas por evaluación."
              : "Consultá las notas cargadas por comisión y evaluación."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

        <PanelesComision
          comisionSeleccionada={comisionSeleccionada}
          setComisionSeleccionada={setComisionSeleccionada}
        />

        <PanelDetalleCalificaciones
          idComision={comisionSeleccionada?.id}
          soloLectura={!puedeEditar}
        />

      </div>

    </div>
  );
}

// Vista para el alumno: solo lectura, muestra sus propias notas en
// cada comisión en la que está inscripto.
function VistaAlumno({ idLegajo }) {
  const [comisiones, setComisiones] = useState([]);
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
        const data = await obtenerMisCalificaciones(idLegajo);
        setComisiones(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [idLegajo]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800">Mis calificaciones</h1>
        <p className="text-gray-500 mb-6">
          Notas obtenidas en cada comisión en la que estás inscripto. Esta vista es de solo lectura.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {cargando && (
          <p className="text-sm text-gray-400">Cargando calificaciones...</p>
        )}

        {!cargando && comisiones.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
            Todavía no tenés calificaciones cargadas.
          </div>
        )}

        {comisiones.map((c) => (
          <ResumenComisionCard key={c.id_comision} comision={c} />
        ))}

      </div>
    </div>
  );
}
