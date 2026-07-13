import PanelesComision from "../components/Calificaciones/PanelesComision";
import PanelDetalleCalificaciones from "../components/Calificaciones/PanelDetalleCalificaciones";
import { useState } from "react";

export default function CalificacionesAdmin() {
  const [comisionSeleccionada, setComisionSeleccionada] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Gestionar calificaciones
          </h1>

          <p className="text-gray-500">
            Seleccioná una comisión y cargá las notas por evaluación.
          </p>

        </div>

      </div>

      <div className="grid grid-cols-12 gap-6">

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
