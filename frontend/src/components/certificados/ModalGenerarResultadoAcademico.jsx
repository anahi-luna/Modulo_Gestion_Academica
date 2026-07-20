// Modal para "cerrar" la cursada de un alumno en una materia: acá se
// carga lo que el DER modela como ResultadoAcademico (promedio_final,
// porcentaje_asistencia, id_estado_academico, fecha_cierre,
// observaciones). Sirve tanto para generarlo por primera vez como para
// corregirlo si ya existía (por eso, si "resultadoExistente" viene con
// datos, precargo el formulario con esos valores en vez de arrancar
// vacío).

import { useEffect, useState } from "react";
import { ESTADOS_ACADEMICOS } from "../../Services/resultadoAcademicoService";

const HOY = new Date().toISOString().slice(0, 10);

export default function ModalGenerarResultadoAcademico({
  abierto,
  certificado, // la fila de la tabla de certificados: trae alumno, materia, id_legajo, id_comision
  resultadoExistente, // null si todavía no se generó, o el objeto ya guardado
  usuario,
  onCerrar,
  onGenerar,
}) {
  const [promedioFinal, setPromedioFinal] = useState("");
  const [porcentajeAsistencia, setPorcentajeAsistencia] = useState("");
  const [idEstadoAcademico, setIdEstadoAcademico] = useState(ESTADOS_ACADEMICOS[0].id);
  const [fechaCierre, setFechaCierre] = useState(HOY);
  const [observaciones, setObservaciones] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  // Cada vez que se abre el modal para un certificado distinto, piso
  // el formulario: si ya existía un resultado académico para esta
  // materia, precargo sus valores (para poder corregirlo); si no
  // existía, arranco en blanco con la fecha de hoy.
  useEffect(() => {
    if (!abierto) return;
    if (resultadoExistente) {
      setPromedioFinal(resultadoExistente.promedio_final ?? "");
      setPorcentajeAsistencia(resultadoExistente.porcentaje_asistencia ?? "");
      setIdEstadoAcademico(resultadoExistente.id_estado_academico ?? ESTADOS_ACADEMICOS[0].id);
      setFechaCierre(resultadoExistente.fecha_cierre ?? HOY);
      setObservaciones(resultadoExistente.observaciones ?? "");
    } else {
      setPromedioFinal("");
      setPorcentajeAsistencia("");
      setIdEstadoAcademico(ESTADOS_ACADEMICOS[0].id);
      setFechaCierre(HOY);
      setObservaciones("");
    }
    setError(null);
  }, [abierto, resultadoExistente]);

  if (!abierto || !certificado) return null;

  async function handleGuardar() {
    // Validación mínima: promedio 0-10 y asistencia 0-100, para no
    // mandar al back (o al mock) un dato que ya sabemos que está mal.
    const promedio = Number(promedioFinal);
    const asistencia = Number(porcentajeAsistencia);

    if (promedioFinal === "" || promedio < 0 || promedio > 10) {
      setError("El promedio final tiene que ser un número entre 0 y 10.");
      return;
    }
    if (porcentajeAsistencia === "" || asistencia < 0 || asistencia > 100) {
      setError("El porcentaje de asistencia tiene que estar entre 0 y 100.");
      return;
    }
    if (!fechaCierre) {
      setError("Falta la fecha de cierre.");
      return;
    }

    setEnviando(true);
    setError(null);
    try {
      await onGenerar({
        id_legajo: certificado.id_legajo,
        id_comision: certificado.id_comision,
        promedio_final: promedio,
        porcentaje_asistencia: asistencia,
        id_estado_academico: Number(idEstadoAcademico),
        fecha_cierre: fechaCierre,
        observaciones,
        id_usuario_creacion: usuario?.id,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-800 mb-1">
          {resultadoExistente ? "Corregir resultado académico" : "Generar resultado académico"}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Cierra la cursada del alumno en esta materia con su nota final, asistencia y estado.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm mb-4">
          <p><span className="text-gray-400">Alumno:</span> {certificado.alumno}</p>
          <p><span className="text-gray-400">Materia:</span> {certificado.materia}</p>
          <p><span className="text-gray-400">Comisión:</span> {certificado.comision}</p>
        </div>

        <div className="space-y-3 mb-4">

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Promedio final (0-10)</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={promedioFinal}
                onChange={(e) => setPromedioFinal(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Asistencia (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={porcentajeAsistencia}
                onChange={(e) => setPorcentajeAsistencia(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Estado académico</label>
            <select
              value={idEstadoAcademico}
              onChange={(e) => setIdEstadoAcademico(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none"
            >
              {ESTADOS_ACADEMICOS.map((e) => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Fecha de cierre</label>
            <input
              type="date"
              value={fechaCierre}
              onChange={(e) => setFechaCierre(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Observaciones (opcional)</label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-200 outline-none resize-none"
            />
          </div>

        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCerrar}
            className="flex-1 border border-gray-200 text-gray-600 rounded-lg py-2 text-sm font-medium hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={enviando}
            className="flex-1 bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium"
          >
            {enviando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
