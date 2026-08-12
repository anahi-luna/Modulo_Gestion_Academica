import { obtenerMisCalificaciones } from "../Services/calificacionesAlumnoService";
import { useState, useEffect } from "react";
import ResumenComisionCard from "../components/Calificaciones/ResumenComisionCard";

export default function MisCalificaciones() {
  const [comisiones, setComisiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargar() {
      setCargando(true);
      setError(null);
      try {
        const data = await obtenerMisCalificaciones();
        setComisiones(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

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
          <ResumenComisionCard key={c.id_comision_asignatura} comision={c} />
        ))}

      </div>
    </div>
  );
}
