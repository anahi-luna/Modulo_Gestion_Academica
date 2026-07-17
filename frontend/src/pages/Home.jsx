// Antes tenía 3 Home distintos (HomeAdmin, HomeProfesor, HomeAlumno) y en
// App.jsx elegía cuál mostrar según el rol. Ahora tengo UN solo Home:
// muestro la card de cada módulo solamente si el usuario tiene el
// permiso de LECTURA de ese módulo (por eso antes se veían "Gestionar
// calificaciones" y "Gestionar certificados" duplicados: había quedado
// pegado un ModuloCard viejo sin ruta al lado del nuevo. Ahora ese
// listado sale de MODULOS, una sola fuente de verdad, así que no se
// puede duplicar por accidente).

import { useState, useEffect } from "react";
import ModuloCard from "../components/ModuloCard";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { obtenerInscripciones } from "../Services/inscripcionesAdminService";
import { usePermissions } from "../context/PermissionsContext";
import { MODULOS } from "../config/modulos";

export default function Home() {
  const { usuario, hasPermission } = usePermissions();
  const [historial, setHistorial] = useState([]);

  // Las estadísticas de inscripciones solo tienen sentido si el usuario
  // puede leer ese módulo (si no, ni siquiera le pido el endpoint).
  useEffect(() => {
    if (hasPermission("micro2.inscripciones.leer")) {
      cargarDatos();
    }
  }, [usuario]);

  async function cargarDatos() {
    try {
      const data = await obtenerInscripciones();
      setHistorial(data);
    } catch (err) {
      console.error(err);
    }
  }

  if (!usuario) {
    return (
      <div className="flex justify-center py-20 text-gray-400 text-sm">
        Cargando...
      </div>
    );
  }

  // Filtro los módulos: solo entran los que el usuario puede leer.
  // A un alumno con el rol "Consulta Académica" le van a aparecer
  // TODOS los módulos en modo lectura (así está armado ese rol en
  // roles.yml); a un docente con el rol "Docencia" le van a aparecer
  // solo Asistencia, Evaluaciones y Calificaciones, por ejemplo.
  const modulosVisibles = MODULOS.filter((m) => hasPermission(m.permisoLeer));

  const pendientes = historial.filter((i) => i.estado === "Pendiente").length;

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-red-800 text-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold">Hola, {usuario.nombre}</h1>
          <p className="text-red-200 text-sm mt-1">
            {usuario.cargo} — Instituto de Formación de Bomberos
          </p>

          {hasPermission("micro2.inscripciones.leer") && (
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
