import PanelClases from "../components/Asistencia/PanelesClase";
import PanelDetalleClase from "../components/Asistencia/PanelDetalleClase";
import PanelesClase from "../components/Asistencia/PanelesClase";

export default function AsistenciaAdmin() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-3xl font-bold text-gray-800">
            Gestionar asistencia
          </h1>

          <p className="text-gray-500">
            Seleccioná una clase y registrá la asistencia.
          </p>

        </div>

        <button
          className="bg-red-700 hover:bg-red-800 text-white px-5 py-3 rounded-lg font-medium"
        >
          + Nueva clase
        </button>

      </div>

      <div className="grid grid-cols-12 gap-6">

        <PanelesClase />

        <PanelDetalleClase />

      </div>

    </div>
  );
}