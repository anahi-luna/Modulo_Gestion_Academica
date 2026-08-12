//vista para el alumno: solo lectura, muestra su propia asistencia en cada comisión en la que está inscripto. 
//vista para el personal (admin, profesor, etc): elijo una comisión y veo/cargo la asistencia de todos 
// los alumnos de una clase.
import { useEffect, useState } from "react";
import useAuth from "../auth/hooks/useAuth";
import PanelesComision from "../components/Calificaciones/PanelesComision";
import PanelDetalleCalificaciones from "../components/Calificaciones/PanelDetalleCalificaciones";
import ResumenComisionCard from "../components/Calificaciones/ResumenComisionCard";




export default function GestionCalificaciones() {
  const {  hasPermission} = useAuth();

// Si el usuario es un docente o administrador, puede editar la calificación si tiene los permisos correspondientes.
  const puedeEditar = hasPermission("inscripcion.calificaciones.actualizar");
  const puedeCrear = hasPermission("inscripcion.calificaciones.crear");
  const puedeEliminar = hasPermission("inscripcion.calificaciones.eliminar");

  
  return <VistaComisiones puedeEditar={puedeEditar} puedeCrear={puedeCrear} puedeEliminar={puedeEliminar} />;
}

// Vista para el personal (admin, profesor, etc): elijo una comisión y
// veo/cargo las notas de todos los alumnos de una evaluación.
function VistaComisiones({ puedeEditar, puedeCrear, puedeEliminar }) {
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
          idComision={comisionSeleccionada?.id_comision_asignatura}
          puedeCrear={puedeCrear}
          puedeEditar={puedeEditar}
          puedeEliminar={puedeEliminar}

        />

      </div>

    </div>
  );
}
