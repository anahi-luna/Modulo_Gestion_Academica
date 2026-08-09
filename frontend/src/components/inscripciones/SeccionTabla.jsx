// Sección de la tabla de inscripciones del admin.
// Agrupa las filas bajo un título según el estado real
// recibido desde el backend.

import EstadoBadge from "./EstadoBadge";
import FilaInscripcion from "./FilaInscripcion";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function SeccionTabla({
  titulo,
  icono,
  items,
  colorBadge,
  estadosInscripcion = [],
  onValidar,
  onEliminar
}) {
  // ESTADOS QUE NO PERMITEN VALIDACIÓN / EDICIÓN
  const idsEstadosNoEditables = estadosInscripcion
    .filter((estado) =>
      ["Finalizada", "Cancelada"].includes(estado.nombre)
    )
    .map((estado) => estado.id_estado);

  function puedeEditar(inscripcion) {
    return !idsEstadosNoEditables.includes(inscripcion.id_estado);
  }

  return (
    <div className="bg-white rounded-xl shadow mb-6 overflow-hidden">
      {/* CABECERA */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icono}</span>
          <h2 className="font-bold text-gray-800">{titulo}</h2>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-bold text-white ${colorBadge}`}>
          {items.length}
        </span>
      </div>

      {/* CONTENIDO */}
      {items.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-gray-400">
          No hay inscripciones en esta sección.
        </div>
      ) : (
        <>
          {/* MOBILE */}
          <div className="md:hidden divide-y divide-gray-100">
            {items.map((inscripcion) => {
              const editable = puedeEditar(inscripcion);
              return (
                <div key={inscripcion.id} className="p-4">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 truncate">
                        {inscripcion.alumno}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">
                        INS-{inscripcion.id} · Legajo {inscripcion.id_legajo}
                      </p>
                    </div>
                    <EstadoBadge estado={inscripcion.estado} />
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {inscripcion.comision}
                  </p>

                  <div className="flex gap-2">
                    {editable && (
                      <button
                        onClick={() => onValidar(inscripcion)}
                        className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md bg-green-100 hover:bg-green-200 text-green-700 text-xs font-medium"
                      >
                        <CheckIcon className="h-4 w-4" />
                        Validar
                      </button>
                    )}
                    <button
                      onClick={() => onEliminar(inscripcion)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium"
                    >
                      <TrashIcon className="h-4 w-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-xs text-gray-400 border-b border-gray-100 uppercase tracking-wide">
                  <th className="px-4 py-3 text-left whitespace-nowrap">ID</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Legajo</th>
                  <th className="px-4 py-3 text-left">Integrante</th>
                  <th className="px-4 py-3 text-left">Comisión</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">Estado</th>
                  <th className="px-4 py-3 text-right whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((inscripcion) => {
                  const editable = puedeEditar(inscripcion);
                  return (
                    <FilaInscripcion
                      key={inscripcion.id}
                      inscripcion={inscripcion}
                      onValidar={editable ? onValidar : undefined}
                      onEliminar={onEliminar}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}