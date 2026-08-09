import { useEffect, useState } from "react";
import { useModalAccessibility } from "../../hooks/useModalAccessibility";
import { obtenerDocenteTitular } from "../../api/comisiones";
import Alert from "../Alert";

export default function EvaluacionModal({
  abierto,
  evaluacion,
  comisiones = [],
  tiposEvaluacion = [],
  onCerrar,
  onGuardar,
}) {
  const [alerta, setAlerta] = useState(null);
  const [formulario, setFormulario] = useState({
    id_comision_asignatura: "",
    id_tipo_evaluacion: "",
    titulo: "",
    fecha: "",
    puntaje_maximo: 10,
  });

  useEffect(() => {
    if (evaluacion) {
      setFormulario({
        id_comision_asignatura: evaluacion.id_comision_asignatura ?? evaluacion.id_comision ?? "",
        id_tipo_evaluacion: evaluacion.id_tipo_evaluacion ?? "",
        titulo: evaluacion.titulo ?? "",
        fecha: evaluacion.fecha ?? "",
        puntaje_maximo: evaluacion.puntaje_maximo ?? 10,
      });
    } else {
      setFormulario({
        id_comision_asignatura: "",
        id_tipo_evaluacion: "",
        titulo: "",
        fecha: "",
        puntaje_maximo: 10,
      });
    }
    setAlerta(null);
  }, [evaluacion]);

  const modalRef = useModalAccessibility(abierto, onCerrar);

  if (!abierto) return null;

  const comisionSeleccionada = comisiones.find(
    (c) => Number(c.id_comision_asignatura) === Number(formulario.id_comision_asignatura)
  );

  const handleChange = (campo, valor) => {
    setFormulario((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleSubmit = () => {
    if (!formulario.id_comision_asignatura) {
      setAlerta({
        tipo: "warning",
        titulo: "Campo Obligatorio",
        mensaje: "Debe seleccionar una comisión",
      });
      return;
    }

    if (!formulario.id_tipo_evaluacion) {
      setAlerta({
        tipo: "warning",
        titulo: "Campo Obligatorio",
        mensaje: "Debe seleccionar un tipo de evaluación",
      });
      return;
    }

    if (!formulario.titulo.trim()) {
      setAlerta({
        tipo: "warning",
        titulo: "Campo Obligatorio",
        mensaje: "Debe ingresar un título",
      });
      return;
    }

    if (!formulario.fecha) {
      setAlerta({
        tipo: "warning",
        titulo: "Campo Obligatorio",
        mensaje: "Debe seleccionar una fecha",
      });
      return;
    }

    if (formulario.puntaje_maximo === "" || formulario.puntaje_maximo === null) {
      setAlerta({
        tipo: "warning",
        titulo: "Campo Obligatorio",
        mensaje: "Debe ingresar un puntaje máximo",
      });
      return;
    }

    if (Number(formulario.puntaje_maximo) > 100) {
      setAlerta({
        tipo: "warning",
        titulo: "Puntaje inválido",
        mensaje: "El puntaje máximo no puede superar los 100",
      });
      return;
    }

    setAlerta(null);
    onGuardar({
      ...formulario,
      id_comision_asignatura: Number(formulario.id_comision_asignatura),
      id_tipo_evaluacion: Number(formulario.id_tipo_evaluacion),
      puntaje_maximo: Number(formulario.puntaje_maximo),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-xl min-w-0 max-h-[90vh] overflow-y-auto p-6"
      >
        <h2 className="text-2xl font-bold text-red-700 mb-6">
          {evaluacion ? "Editar Evaluación" : "Nueva Evaluación"}
        </h2>

        {alerta && (
          <Alert
            tipo={alerta.tipo}
            titulo={alerta.titulo}
            mensaje={alerta.mensaje}
            onCerrar={() => setAlerta(null)}
          />
        )}

        <div className="space-y-5">
          {/* COMISIÓN */}
          <div className="min-w-0">
            <label htmlFor="evaluacion-comision" className="block font-medium mb-2">
              Comisión
            </label>
            <select
              id="evaluacion-comision"
              value={formulario.id_comision_asignatura}
              onChange={(e) => handleChange("id_comision_asignatura", e.target.value)}
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">Seleccione una comisión</option>
              {comisiones.map((comision) => (
                <option
                  key={comision.id_comision_asignatura}
                  value={comision.id_comision_asignatura}
                >
                  {comision.comision?.descripcion} - {comision.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* INFORMACIÓN DE LA COMISIÓN */}
          {comisionSeleccionada && (
            <div className="rounded-lg bg-gray-100 p-4 space-y-2 min-w-0">
              <p className="break-words">
                <strong>Materia:</strong> {comisionSeleccionada.nombre}
              </p>
              <p className="break-words">
                <strong>Docente:</strong> {obtenerDocenteTitular(comisionSeleccionada)}
              </p>
            </div>
          )}

          {/* TIPO DE EVALUACIÓN */}
          <div>
            <label htmlFor="evaluacion-tipo" className="block font-medium mb-2">
              Tipo
            </label>
            <select
              id="evaluacion-tipo"
              value={formulario.id_tipo_evaluacion}
              onChange={(e) => handleChange("id_tipo_evaluacion", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="">Seleccione un tipo</option>
              {tiposEvaluacion.map((tipo) => (
                <option key={tipo.id_tipo_evaluacion} value={tipo.id_tipo_evaluacion}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* TÍTULO */}
          <div>
            <label htmlFor="evaluacion-titulo" className="block font-medium mb-2">
              Título
            </label>
            <input
              id="evaluacion-titulo"
              type="text"
              value={formulario.titulo}
              placeholder="Ej: Parcial 1"
              onChange={(e) => handleChange("titulo", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          {/* FECHA */}
          <div>
            <label htmlFor="evaluacion-fecha" className="block font-medium mb-2">
              Fecha
            </label>
            <input
              id="evaluacion-fecha"
              type="date"
              value={formulario.fecha}
              onChange={(e) => handleChange("fecha", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          {/* PUNTAJE MÁXIMO */}
          <div>
            <label htmlFor="evaluacion-puntaje" className="block font-medium mb-2">
              Puntaje máximo
            </label>
            <input
              id="evaluacion-puntaje"
              type="number"
              min="0"
              max="100"
              value={formulario.puntaje_maximo}
              onChange={(e) => handleChange("puntaje_maximo", e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            type="button"
            onClick={onCerrar}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white"
          >
            {evaluacion ? "Guardar cambios" : "Crear evaluación"}
          </button>
        </div>
      </div>
    </div>
  );
}