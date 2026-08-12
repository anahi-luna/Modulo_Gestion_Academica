// Página de Asistencia: vista para alumnos y docentes, según el rol del usuario.
import PanelesClase from "../components/Asistencia/PanelesClase";
import PanelDetalleClase from "../components/Asistencia/PanelDetalleClase";

import { useState, useEffect } from "react";
import useAuth from "../auth/hooks/useAuth";



export default function GestionAsistencia() {
  const [comisionSeleccionada, setComisionSeleccionada] = useState(null);
  const { hasPermission } = useAuth();

// Si el usuario es un docente o administrador, puede editar la asistencia si tiene los permisos correspondientes.
  const puedeEditar = ["inscripcion.asistencias.crear", "inscripcion.asistencias.actualizar"].some(hasPermission);

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
          idComision={comisionSeleccionada?.id_comision_asignatura}
          soloLectura={!puedeEditar}
        />

      </div>

    </div>
  );
}

// Vista del alumno: solo lectura, historial de su propia asistencia
// agrupado por comisión (mismo patrón visual que "Mis calificaciones").
