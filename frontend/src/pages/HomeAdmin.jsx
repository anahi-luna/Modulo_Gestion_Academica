import { useState, useEffect } from "react";
import ModuloCard from "../components/ModuloCard";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import {obtenerInscripciones} from "../services/inscripcionesAdminService";

/*
 * Pantalla principal del administrador.
 * Muestra un resumen de las inscripciones y el acceso
 * a los distintos módulos del sistema.
 */
export default function HomeAdmin() {
  const [historial, setHistorial] = useState([]);

  // Carga la información al iniciar la pantalla.
  useEffect(() => {
    cargarDatos();
  }, []);

  // Obtiene las inscripciones para calcular las estadísticas.
  async function cargarDatos() {
    try {
        const data = await obtenerInscripciones();
        setHistorial(data);
    } catch (err) {
        console.error(err);
    }
}

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Encabezado de bienvenida */}
      <div className="bg-red-800 text-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold">Bienvenido, Administrador</h1>
          <p className="text-red-200 text-sm mt-1">
            Panel de gestión — Instituto de Formación de Bomberos
          </p>

          {/* Estadísticas rápidas */}
          <div className="mt-5 grid grid-cols-3 gap-4">
            <div className="bg-red-900/50 rounded-xl px-4 py-3">
              <p className="text-red-200 text-xs">Total inscripciones</p>
              <p className="text-white text-2xl font-bold">{historial.length}</p>
            </div>
            <div className="bg-red-900/50 rounded-xl px-4 py-3">
              <p className="text-red-200 text-xs">Pendientes</p>
              <p className="text-white text-2xl font-bold">
                {historial.filter(i => i.estado === "Pendiente").length}
              </p>
            </div>
            <div className="bg-red-900/50 rounded-xl px-4 py-3">
              <p className="text-red-200 text-xs">Aceptadas</p>
              <p className="text-white text-2xl font-bold">
                {historial.filter(i => i.estado === "Aceptada").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Módulos */}
        <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wide">
          Módulos
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <ModuloCard
            titulo="Gestionar inscripciones"
            descripcion="Alta, baja y modificación de inscripciones."
            cantidad={`${historial.filter(i => i.estado === "Pendiente").length} Pendientes`}
            color="red"
            ruta="/inscripcionesAdmin"
            icono={<ClipboardDocumentListIcon className="h-6 w-6" />}
          />
          <ModuloCard
            titulo="Gestionar asistencia"
            descripcion="Registro y seguimiento de asistencia."
            cantidad="Hoy: 3 turnos"
            color="blue"
            icono={<ClipboardDocumentListIcon className="h-6 w-6" />}
          />
          <ModuloCard
            titulo="Gestionar calificaciones"
            descripcion="Carga y edicion de notas, evaluaciones y resultados de desempeño"
            cantidad="12 Pendientes"
            color="green"
            icono={<ClipboardDocumentListIcon className="h-6 w-6" />}
          />
          <ModuloCard
            titulo="Gestionar certificados"
            descripcion="Generacion, emision y seguimiento de certificados"
            cantidad="123 emitidos"
            color="yellow"
            icono={<ClipboardDocumentListIcon className="h-6 w-6" />}
          />
        </div>

      </div>
    </div>
  );
}