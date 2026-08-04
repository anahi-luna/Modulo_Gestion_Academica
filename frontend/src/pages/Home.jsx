// Página de inicio del módulo de gestión académica. Muestra un dashboard con estadísticas y
//  accesos a los distintos módulos según el rol del usuario.
// Para el alumno, muestra su propio dashboard con inscripciones, plan de estudios, asistencia y
//  próximas clases.  
// Para el personal (admin, profesor, etc), muestra un dashboard con estadísticas de inscripciones
//  y accesos a los distintos módulos según los permisos del usuario.

import { useState, useEffect } from "react";
import ModuloCard from "../components/ModuloCard";
import HomeAlumno from "../components/home/HomeAlumno";
import Alert from "../components/Alert";
import { obtenerInscripciones } from "../Services/inscripcionesAdminService";
import useAuth from "../auth/hooks/useAuth";
import { MODULOS } from "../config/modulos";
import { ClipboardDocumentListIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import pdfManual from "../docs/manualUsuario.pdf"; 

export default function Home() {
  const { user: usuario, hasPermission, hasRole } = useAuth();
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState(null);

  const esAlumno = hasRole("Alumno");

  // Las estadísticas de inscripciones solo tienen sentido si el usuario
  // puede leer ese módulo (si no, ni siquiera le pido el endpoint), y
  // no aplican al alumno (que tiene su propio dashboard en HomeAlumno).
  useEffect(() => {
    if (!esAlumno && hasPermission("inscripcion.inscripciones.leer")) {
      cargarDatos();
    }
  }, [usuario]);

  async function cargarDatos() {
    try {
      const data = await obtenerInscripciones();
      setHistorial(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las estadísticas de inscripciones.");
    }
  }

  if (!usuario) {
    return (
      <div className="flex justify-center py-20 text-gray-400 text-sm">
        Cargando...
      </div>
    );
  }

  // El alumno tiene su propio dashboard, con inscripciones, plan,
  // asistencia y próximas clases: no tiene sentido mostrarle el
  // listado de módulos de gestión.
  if (esAlumno) {
    return <HomeAlumno usuario={usuario} />;
  }

  const modulosVisibles = MODULOS.filter((m) => hasPermission(m.permisoLeer));

  const pendientes = historial.filter((i) => i.estado === "Pendiente").length;

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-red-800 text-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Contenedor flexible para alinear el saludo y el botón del manual */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold">Hola, {usuario.nombre}</h1>
              <p className="text-red-200 text-sm mt-1">
                {usuario.cargo} — Instituto de Formación de Bomberos
              </p>
            </div>

            <a
              href={pdfManual}
              download="Manual_de_Usuario_Bomberos.pdf"
              className="bg-red-700 hover:bg-red-600 text-white text-sm font-medium py-2 px-4 rounded-lg shadow border border-red-600 transition-colors duration-200 flex items-center gap-2"
            >
              <BookOpenIcon className="h-5 w-5 text-red-200" />
              Manual de Usuario
            </a>
          </div>

          {hasPermission("inscripcion.inscripciones.leer") && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-red-900/50 rounded-xl px-4 py-3">
                <p className="text-red-200 text-xs">Total inscripciones</p>
                <p className="text-white text-2xl font-bold">{historial.length}</p>
              </div>
              <div className="bg-red-900/50 rounded-xl px-4 py-3">
                <p className="text-red-200 text-xs">Pendientes</p>
                <p className="text-white text-2xl font-bold">{pendientes}</p>
              </div>
              <div className="bg-red-900/50 rounded-xl px-4 py-3">
                <p className="text-red-200 text-xs">Aceptadas</p>
                <p className="text-white text-2xl font-bold">
                  {historial.filter((i) => i.estado === "Aceptada").length}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <Alert tipo="error" titulo="Error" mensaje={error} onCerrar={() => setError(null)} />
        )}

        <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wide">
          Módulos
        </h2>

        {modulosVisibles.length === 0 && (
          <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-sm text-gray-400">
            Tu usuario todavía no tiene ningún módulo asignado.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {modulosVisibles.map((modulo) => (
            <ModuloCard
              key={modulo.id}
              titulo={modulo.titulo}
              descripcion={modulo.descripcion}
              cantidad={
                modulo.id === "inscripciones"
                  ? `${pendientes} pendientes`
                  : null
              }
              color={modulo.color}
              ruta={modulo.ruta}
              icono={<ClipboardDocumentListIcon className="h-6 w-6" />}
            />
          ))}
        </div>
      </div>
    </div>
  );
}