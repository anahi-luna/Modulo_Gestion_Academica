// Vista Docente/Admin: gestión (carga y edición) de calificaciones.
// RBAC: Docente = CRU sobre sus propias comisiones. Admin/Jefe = todas.
// El Docente ve directamente la planilla de su comisión (usuario.id_comision).
// El Admin puede elegir cualquier comisión desde el selector.

import { useEffect, useState } from "react";
import {
  obtenerComisionesParaGestion,
  obtenerPlanillaDeComision,
  cargarNota,
  nuevaEvaluacion,
} from "../Services/calificacionesService";
import { ROLES } from "../mocks/usuariosMock";
import PlanillaNotas from "../components/calificaciones/PlanillaNotas";

export default function GestionCalificaciones({ usuario }) {
  const esDocente = usuario.rol === ROLES.PROFESOR;

  const [comisiones, setComisiones]       = useState([]);
  const [idComision, setIdComision]       = useState(null);
  const [evaluaciones, setEvaluaciones]   = useState([]);
  const [filas, setFilas]                 = useState([]);
  const [error, setError]                 = useState(null);
  const [cargando, setCargando]           = useState(true);
  const [mostrarNuevaEval, setMostrarNuevaEval] = useState(false);
  const [nuevaEvalForm, setNuevaEvalForm] = useState({ titulo: "", tipo: "Parcial", puntaje_maximo: 10, fecha: "" });

  useEffect(() => {
    async function cargarComisiones() {
      try {
        const data = await obtenerComisionesParaGestion(esDocente ? usuario.id_comision : null);
        setComisiones(data);
        if (data.length > 0) setIdComision(data[0].id);
      } catch (err) {
        setError(err.message);
      }
    }
    cargarComisiones();
  }, [esDocente, usuario.id_comision]);

  useEffect(() => {
    if (!idComision) return;
    cargarPlanilla();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idComision]);

  async function cargarPlanilla() {
    setCargando(true);
    setError(null);
    try {
      const { evaluaciones, filas } = await obtenerPlanillaDeComision(idComision);
      setEvaluaciones(evaluaciones);
      setFilas(filas);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  async function handleGuardarNota(idLegajo, idEvaluacion, valor) {
    await cargarNota({
      id_legajo: idLegajo,
      id_comision: idComision,
      id_evaluacion: idEvaluacion,
      nota: valor,
    });
    setFilas((prev) =>
      prev.map((f) =>
        f.id_legajo === idLegajo
          ? { ...f, notas: { ...f.notas, [idEvaluacion]: valor === "" ? null : Number(valor) } }
          : f
      )
    );
  }

  async function handleCrearEvaluacion(e) {
    e.preventDefault();
    try {
      await nuevaEvaluacion({ id_comision: idComision, ...nuevaEvalForm });
      setMostrarNuevaEval(false);
      setNuevaEvalForm({ titulo: "", tipo: "Parcial", puntaje_maximo: 10, fecha: "" });
      cargarPlanilla();
    } catch (err) {
      setError(err.message);
    }
  }

  const comisionActual = comisiones.find((c) => c.id === idComision);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestionar calificaciones</h1>
        <p className="text-sm text-gray-500 mb-6">
          {esDocente
            ? "Carga y edición de notas de tu comisión."
            : "Carga, edición y revisión de notas de todas las comisiones."}
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-100 border border-red-300 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap items-end gap-4">
          {!esDocente && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Comisión</label>
              <select
                value={idComision ?? ""}
                onChange={(e) => setIdComision(Number(e.target.value))}
                className="border border-gray-200 rounded-md px-3 py-2 text-sm"
              >
                {comisiones.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.codigo} - {c.materia}
                  </option>
                ))}
              </select>
            </div>
          )}

          {esDocente && comisionActual && (
            <div>
              <p className="text-xs text-gray-400">Comisión</p>
              <p className="font-semibold text-gray-800">
                {comisionActual.codigo} - {comisionActual.materia}
              </p>
            </div>
          )}

          <button
            onClick={() => setMostrarNuevaEval((v) => !v)}
            className="ml-auto bg-red-700 hover:bg-red-800 text-white text-sm px-4 py-2 rounded-lg font-medium"
          >
            + Nueva evaluación
          </button>
        </div>

        {mostrarNuevaEval && (
          <form
            onSubmit={handleCrearEvaluacion}
            className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
          >
            <div>
              <label className="block text-xs text-gray-500 mb-1">Título</label>
              <input
                required
                value={nuevaEvalForm.titulo}
                onChange={(e) => setNuevaEvalForm({ ...nuevaEvalForm, titulo: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
                placeholder="Ej: Parcial 2"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tipo</label>
              <select
                value={nuevaEvalForm.tipo}
                onChange={(e) => setNuevaEvalForm({ ...nuevaEvalForm, tipo: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              >
                <option value="Parcial">Parcial</option>
                <option value="TP">Trabajo Práctico</option>
                <option value="Final">Final</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Fecha</label>
              <input
                type="date"
                required
                value={nuevaEvalForm.fecha}
                onChange={(e) => setNuevaEvalForm({ ...nuevaEvalForm, fecha: e.target.value })}
                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 text-white text-sm px-4 py-2 rounded-lg font-medium"
            >
              Crear
            </button>
          </form>
        )}

        {cargando ? (
          <p className="text-sm text-gray-400">Cargando planilla...</p>
        ) : (
          <PlanillaNotas evaluaciones={evaluaciones} filas={filas} onGuardarNota={handleGuardarNota} />
        )}
      </main>
    </div>
  );
}