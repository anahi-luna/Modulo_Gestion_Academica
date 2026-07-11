import PanelClases from "../components/Asistencia/PanelesClase";
import PanelDetalleClase from "../components/Asistencia/PanelDetalleClase";
import PanelesClase from "../components/Asistencia/PanelesClase";
import { useState } from "react";

export default function AsistenciaAdmin() {
  const [comisionSeleccionada, setComisionSeleccionada] = useState(null);
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Gestionar asistencia
          </h1>

          <p className="text-gray-500">
            Seleccioná una comision y registrá la asistencia.
          </p>

        </div>


      </div>

      <div className="grid grid-cols-12 gap-6">

        <PanelesClase
          comisionSeleccionada={comisionSeleccionada}
          setComisionSeleccionada={setComisionSeleccionada}
        />

        <PanelDetalleClase 
          idComision = {comisionSeleccionada?.id}
        />

      </div>

    </div>
  );
}