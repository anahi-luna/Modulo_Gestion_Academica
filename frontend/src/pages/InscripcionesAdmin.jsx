import { useEffect, useState } from "react";
import EstadoBadge from "../components/EstadoBadge";
import { getInscripciones, aceptarInscripcion, rechazarInscripcion } from "../Services/mockInscripciones";

export default function InscripcionesAdmin() {
  const [inscripciones, setInscripciones] = useState([]);

  useEffect(() => {
    cargarInscripciones();
  }, []);

  async function cargarInscripciones() {
    const res = await getInscripciones();
    setInscripciones(res.data);
  }

  async function aprobar(id) {
    await aceptarInscripcion(id);
    cargarInscripciones();
  }

  async function rechazar(id) {
    await rechazarInscripcion(id);
    cargarInscripciones();
  }

  return (
    <ul className="divide-y divide-gray-100 rounded-xl bg-white shadow">
      {inscripciones.map((inscripcion) => (
        <li
          key={inscripcion.id}
          className="flex items-center justify-between px-6 py-4"
        >
          <div>
            <p className="font-semibold">{inscripcion.nombre}</p>
            <p className="text-sm text-gray-500">
              Legajo: {inscripcion.id_legajo}
            </p>
          </div>

          <EstadoBadge estado={inscripcion.estado} />

          <div className="flex gap-2">
            <button
              onClick={() => aprobar(inscripcion.id)}
              className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Aceptar
            </button>

            <button
              onClick={() => rechazar(inscripcion.id)}
              className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Rechazar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}