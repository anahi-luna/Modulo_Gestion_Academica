// Unifico acá lo que antes eran DOS páginas separadas:
// - CalificacionesAdmin.jsx (admin/profesor: elegía una comisión y
//   cargaba notas de TODOS los alumnos de esa evaluación)
// - MisCalificaciones.jsx (alumno: veía SUS PROPIAS notas en todas las
//   comisiones en las que está inscripto)
//
// Ojo con algo importante: estas dos vistas no son "lo mismo pero con
// botones ocultos", son dos formas de mirar los datos totalmente
// distintas (una es "toda la planilla de una comisión", la otra es
// "mi propio historial en varias comisiones"). Por eso decidí que la
// MISMA ruta /calificaciones muestre una u otra cosa según el tipo de
// usuario, en vez de forzar todo dentro de una sola tabla que no
// tendría sentido para ninguno de los dos casos.
//
// TODO importante para cuando el back linkee usuario <-> legajo:
// hoy en usuarios_mock.yml el usuario "alumno" no tiene un id_legajo
// asociado, así que distingo "es alumno" mirando el username
// (usuario.usuario === "alumno") y le pongo un id_legajo fijo (1) para
// poder mostrar la pantalla. El día que el back devuelva el id_legajo
// real dentro de /api/auth/me, esta parte se simplifica: se saca el
// id_legajo directo de ahí en vez de hardcodearlo.

import { useEffect, useState } from "react";
import { usePermissions } from "../context/PermissionsContext";
import { ACCIONES } from "../config/modulos";

import PanelesComision from "../components/Calificaciones/PanelesComision";
import PanelDetalleCalificaciones from "../components/Calificaciones/PanelDetalleCalificaciones";
import ResumenComisionCard from "../components/Calificaciones/ResumenComisionCard";
import { obtenerMisCalificaciones } from "../Services/calificacionesAlumnoService";

const ID_LEGAJO_ALUMNO_MOCK = 1; // ver TODO arriba

export default function Calificaciones() {
  const { usuario, hasAnyPermission } = usePermissions();

  const esAlumno = usuario?.usuario === "alumno";

  // Puede cargar/editar notas si tiene permiso de crear o actualizar
  // calificaciones (el alumno nunca los va a tener, así que para él
  // esto siempre da false y ve todo de solo lectura).
  const puedeEditar = hasAnyPermission([
    ACCIONES.CALIFICACIONES_CREAR,
    ACCIONES.CALIFICACIONES_ACTUALIZAR,
  ]);

  if (esAlumno) {
    return <VistaAlumno idLegajo={ID_LEGAJO_ALUMNO_MOCK} />;
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
// cada comisión en la que está inscripto. Es exactamente el contenido
// que antes vivía en pages/MisCalificaciones.jsx.
function VistaAlumno({ idLegajo }) {
  const [comisiones, setComisiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
