import { useEffect, useState } from "react";
import EstadoBadge from "../components/EstadoBadge";
import { getInscripciones, aceptarInscripcion, rechazarInscripcion } from "../Services/mockInscripciones";

export default function InscripcionesAdmin() {
  const [inscripciones, setInscripciones] = useState([]);
  const [ultimaAccion, setUltimaAccion] = useState(null); // { nombre, accion }

  useEffect(() => {
    cargarInscripciones();
  }, []);

  async function cargarInscripciones() {
    const res = await getInscripciones();
    // Solo muestra las PENDIENTES
    setInscripciones(res.data.filter(i => i.estado === "PENDIENTE"));
  }

  async function aprobar(id, nombre) {
    await aceptarInscripcion(id);
    setUltimaAccion({ nombre, accion: "aceptada" });
    cargarInscripciones(); // recarga → desaparece de la lista
  }

  async function rechazar(id, nombre) {
    await rechazarInscripcion(id);
    setUltimaAccion({ nombre, accion: "rechazada" });
    cargarInscripciones();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">Gestionar inscripciones</h1>

      {/* Mensaje de confirmación */}
      {ultimaAccion && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium border
          ${ultimaAccion.accion === "aceptada"
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-700"}`}>
          ✓ Inscripción de <strong>{ultimaAccion.nombre}</strong> {ultimaAccion.accion} correctamente.
        </div>
      )}

      {inscripciones.length === 0 ? (
        <div className="bg-white rounded-xl shadow px-6 py-10 text-center text-gray-400 text-sm">
          No hay inscripciones pendientes.
        </div>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-xl bg-white shadow">
          {inscripciones.map((ins) => (
            <li key={ins.id} className="flex items-center justify-between px-6 py-4 gap-4">
              <div>
                <p className="font-semibold text-gray-800">{ins.nombre}</p>
                <p className="text-sm text-gray-500">Legajo: {ins.id_legajo}</p>
                <p className="text-xs text-gray-400">{ins.materia} · {ins.comision}</p>
              </div>
              <EstadoBadge estado={ins.estado} />
              <div className="flex gap-2">
                <button
                  onClick={() => aprobar(ins.id, ins.nombre)}
                  className="rounded-md bg-green-600 px-4 py-2 text-white text-sm hover:bg-green-700"
                >
                  Aceptar
                </button>
                <button
                  onClick={() => rechazar(ins.id, ins.nombre)}
                  className="rounded-md bg-red-600 px-4 py-2 text-white text-sm hover:bg-red-700"
                >
                  Rechazar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}