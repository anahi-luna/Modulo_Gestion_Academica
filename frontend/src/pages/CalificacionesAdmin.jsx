import PanelesComision from "../components/Calificaciones/PanelesComision";
import PanelDetalleCalificaciones from "../components/Calificaciones/PanelDetalleCalificaciones";
import { useState } from "react";

export default function CalificacionesAdmin() {
  const [comisionSeleccionada, setComisionSeleccionada] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Gestionar calificaciones
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Seleccioná una comisión y cargá las notas por evaluación.
          </p>
        </div>
      </div>

      {/* Mismo criterio que AsistenciaAdmin: 1 columna en mobile, 12 desde lg */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

        <PanelesComision
          comisionSeleccionada={comisionSeleccionada}
          setComisionSeleccionada={setComisionSeleccionada}
        />

        <PanelDetalleCalificaciones
          idComision={comisionSeleccionada?.id}
        />

      </div>

    </div>
  );
}