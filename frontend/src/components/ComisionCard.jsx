// Componente de tarjeta de comisión que muestra información relevante de la comisión, como código, 
// materia, docente, horario, cupo y correlativas.
// Componente de tarjeta de comisión
import { obtenerDocenteTitular } from "../api/comisiones";

export default function ComisionCard({ comision, onSeleccionar, seleccionada }) {
  const cupo = Number(comision.cupo_maximo ?? comision.cupo ?? 0);
  const inscriptos = Number(comision.inscriptos ?? 0);
  const cupoLibre = Math.max(cupo - inscriptos, 0);
  const porcentaje = cupo > 0 ? Math.round((inscriptos / cupo) * 100) : 0;
  const sinCupo = cupoLibre <= 0;

  const correlativas = comision.plan_asignaturas?.correlativas ?? [];

  const colorBarra =
    porcentaje >= 100
      ? "bg-red-500"
      : porcentaje >= 80
        ? "bg-yellow-500"
        : "bg-green-500";

  return (
    <div
      className={`
        rounded-xl border-2 p-4 transition-all cursor-pointer
        ${
          sinCupo
            ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
            : seleccionada
              ? "border-red-600 bg-red-50 shadow-md"
              : "border-gray-200 bg-white hover:border-red-400 hover:shadow"
        }
      `}
      onClick={() => {
        if (!sinCupo) onSeleccionar(comision);
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-xs font-mono text-gray-400">
            {comision.comision?.descripcion ?? "-"}
          </p>
          <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-tight">
            {comision.nombre}
          </h3>
        </div>
        <div
          className={`
          w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center
          ${seleccionada ? "border-red-600 bg-red-600" : "border-gray-300"}
        `}
        >
          {seleccionada && <span className="text-white text-xs">✓</span>}
        </div>
      </div>

      <div className="space-y-1 mb-3">
        <p className="text-xs text-gray-500">{obtenerDocenteTitular(comision)}</p>
        <p className="text-xs text-gray-500">{comision.modalidad ?? "-"}</p>
        {correlativas.length > 0 && (
          <p className="text-xs text-blue-600">Requiere correlativas</p>
        )}
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Cupo</span>
          <span className={sinCupo ? "text-red-600 font-semibold" : ""}>
            {sinCupo ? "Sin cupo" : `${cupoLibre} disponibles`}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${colorBarra}`}
            style={{ width: `${Math.min(porcentaje, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {inscriptos}/{cupo}
        </p>
      </div>
    </div>
  );
}