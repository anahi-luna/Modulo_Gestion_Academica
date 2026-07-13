import PanelesClase from "../components/Asistencia/PanelesClase";
import PanelDetalleClase from "../components/Asistencia/PanelDetalleClase";
import { useState } from "react";

export default function AsistenciaAdmin() {
  const [comisionSeleccionada, setComisionSeleccionada] = useState(null);
  return (
    // p-4 en mobile, p-6 desde sm: menos padding lateral cuando la pantalla es chica
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">

      <div className="flex justify-between items-center mb-6">
        <div>
          {/* Título más chico en mobile para que no ocupe 2 líneas */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Gestionar asistencia
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Seleccioná una comision y registrá la asistencia.
          </p>
        </div>
      </div>

      {/*
        Mobile-first: por defecto es UNA sola columna (grid-cols-1),
        así el panel de clases y el detalle se apilan uno debajo del otro.
        Recién a partir de lg (1024px) volvemos a las 12 columnas
        para tener el layout de sidebar + detalle lado a lado.
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

        <PanelesClase
          comisionSeleccionada={comisionSeleccionada}
          setComisionSeleccionada={setComisionSeleccionada}
        />

        <PanelDetalleClase
          idComision={comisionSeleccionada?.id}
        />

      </div>

    </div>
  );
}