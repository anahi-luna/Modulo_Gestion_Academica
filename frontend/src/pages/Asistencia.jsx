// Antes esta vista se llamaba AsistenciaAdmin y solo la veían ADMIN y
// PROFESOR. Ahora es una sola vista para cualquiera que tenga el
// permiso de LEER asistencias (la ruta ya se protege con RutaProtegida
// en App.jsx usando ese permiso). Adentro, le paso a PanelesClase y a
// PanelDetalleClase si puede además CREAR/ACTUALIZAR asistencias; si no
// puede, los componentes hijos van a mostrar todo pero sin poder tocar
// nada (inputs y botones deshabilitados).
import PanelesClase from "../components/Asistencia/PanelesClase";
import PanelDetalleClase from "../components/Asistencia/PanelDetalleClase";
import { useState } from "react";
import { usePermissions } from "../context/PermissionsContext";
import { ACCIONES } from "../config/modulos";

export default function Asistencia() {
  const [comisionSeleccionada, setComisionSeleccionada] = useState(null);
  const { hasAnyPermission } = usePermissions();

  // Puede tomar asistencia (marcar presente/ausente/etc y escribir
  // observaciones) si tiene el permiso de crear O actualizar asistencias.
  const puedeEditar = hasAnyPermission([
    ACCIONES.ASISTENCIAS_CREAR,
    ACCIONES.ASISTENCIAS_ACTUALIZAR,
  ]);

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
