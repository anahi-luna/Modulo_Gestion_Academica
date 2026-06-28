import EstadoBadge from "../components/EstadoBadge";
import { useState, useEffect } from "react";
import ModuloCard from "../components/ModuloCard";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { getTodasInscripciones, aceptarInscripcion, rechazarInscripcion, ponerPendienteInscripcion } from "../Services/mockinscripciones";

export default function HomeAdmin() {
    const [historial, setHistorial] = useState([]);
    const [mostrarHistorial, setMostrarHistorial] = useState(false);

    useEffect(() => {
        getTodasInscripciones().then(res => setHistorial(res.data));
    }, []);

    async function cambiarEstado(id, nuevoEstado) {
    if (nuevoEstado === "Aceptada")   await aceptarInscripcion(id);
    if (nuevoEstado === "Rechazada")  await rechazarInscripcion(id);
    if (nuevoEstado === "PENDIENTE")  await ponerPendienteInscripcion(id);
    const res = await getTodasInscripciones();
    setHistorial(res.data);
}
    const historialVisible = historial.filter(
        i => i.estado === "PENDIENTE" || i.estado === "Aceptada"
    );

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
                                {historial.filter(i => i.estado === "PENDIENTE").length}
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

                {/* Historial de inscripciones */}
                {historialVisible.length > 0 && (
  <div className="bg-white rounded-2xl shadow overflow-hidden">
    <button
      onClick={() => setMostrarHistorial((v) => !v)}
      className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      <span>Historial de inscripciones ({historialVisible.length})</span>
      <span>{mostrarHistorial ? "▲" : "▼"}</span>
    </button>

    {mostrarHistorial && (
      <div className="divide-y divide-gray-100">
        {historialVisible.map((ins) => (
          <div key={ins.id} className="px-4 py-3 flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-gray-700">{ins.nombre}</p>
              <p className="text-xs text-gray-500">Legajo: {ins.id_legajo}</p>
              <p className="text-xs text-gray-400">{ins.materia} · {ins.comision}</p>
            </div>
            <select
              value={ins.estado}
              onChange={(e) => cambiarEstado(ins.id, e.target.value)}
              className="text-xs border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-red-300"
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="Aceptada">Aceptada</option>
              <option value="Rechazada">Rechazada</option>
            </select>
          </div>
        ))}
      </div>
    )}
  </div>
)}

                {/* Módulos */}
                <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wide">
                    Módulos
                </h2>
                <div className="grid grid-cols-2 gap-4">
                    <ModuloCard
                        titulo="Gestionar inscripciones"
                        descripcion="Alta, baja y modificación de inscripciones."
                        cantidad={`${historial.filter(i => i.estado === "PENDIENTE").length} pendientes`}
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
                        cantidad="12 pendientes"
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