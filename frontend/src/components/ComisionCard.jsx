// ============================================================
// ComisionCard.jsx
// Tarjeta que muestra la información de una comisión.
// Recibe la comisión y una función onSeleccionar que se
// llama cuando el usuario elige esa comisión para inscribirse.
// ============================================================

export default function ComisionCard({ comision, onSeleccionar, seleccionada }) {
  // Calculamos el cupo restante
  const cupoLibre = comision.cupo - comision.inscriptos;
  const sinCupo   = cupoLibre <= 0;

  // Porcentaje de ocupación para la barra de progreso
  const porcentaje = Math.round((comision.inscriptos / comision.cupo) * 100);

  // Color de la barra según ocupación
  const colorBarra =
    porcentaje >= 100 ? "bg-red-500" :
    porcentaje >= 80  ? "bg-yellow-500" :
    "bg-green-500";

  return (
    <div
      className={`
        rounded-xl border-2 p-4 transition-all cursor-pointer
        ${sinCupo
          ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"      // Sin cupo: deshabilitado
          : seleccionada
            ? "border-red-600 bg-red-50 shadow-md"                          // Seleccionada: borde rojo bomberos
            : "border-gray-200 bg-white hover:border-red-400 hover:shadow"  // Normal: hover rojo
        }
      `}
      onClick={() => {
        if (!sinCupo) onSeleccionar(comision); // Solo seleccionable si hay cupo
      }}
    >
      {/* Encabezado: código y materia */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-xs font-mono text-gray-400">{comision.codigo}</p>
          <h3 className="font-bold text-gray-800 text-sm sm:text-base leading-tight">
            {comision.materia}
          </h3>
        </div>
        {/* Indicador de selección */}
        <div className={`
          w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center
          ${seleccionada ? "border-red-600 bg-red-600" : "border-gray-300"}
        `}>
          {seleccionada && (
            <span className="text-white text-xs">✓</span>
          )}
        </div>
      </div>

      {/* Docente y horario */}
      <div className="space-y-1 mb-3">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span></span> {comision.docente}
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span></span> {comision.horario}
        </p>
        {/* Correlativas y rango mínimo si existen */}
        {comision.rango_minimo && (
          <p className="text-xs text-orange-600 flex items-center gap-1">
            <span></span> Rango mínimo: {comision.rango_minimo}
          </p>
        )}
        {comision.correlativas.length > 0 && (
          <p className="text-xs text-blue-600 flex items-center gap-1">
            <span></span> Requiere correlativas
          </p>
        )}
      </div>

      {/* Barra de cupo */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Cupo</span>
          <span className={sinCupo ? "text-red-600 font-semibold" : ""}>
            {sinCupo ? "Sin cupo" : `${cupoLibre} disponibles`}
          </span>
        </div>
        {/* Barra de progreso visual */}
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${colorBarra}`}
            style={{ width: `${Math.min(porcentaje, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {comision.inscriptos}/{comision.cupo}
        </p>
      </div>
    </div>
  );
}
