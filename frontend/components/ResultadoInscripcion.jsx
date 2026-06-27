// ============================================================
// ResultadoInscripcion.jsx
// Modal que muestra el resultado final de la inscripción:
// si fue Aceptada o Rechazada, con el motivo si aplica.
// Se usa después de hacer el POST al backend (o mock).
// ============================================================

export default function ResultadoInscripcion({ resultado, onCerrar, onNueva }) {
  // resultado es el objeto data que devuelve el mock/API
  const esAceptada = resultado?.estado === "Aceptada";

  return (
    // Fondo oscuro semitransparente que cubre toda la pantalla
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-fade-in">

        {/* Ícono grande según resultado */}
        <div className={`
          mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center text-3xl
          ${esAceptada ? "bg-green-100" : "bg-red-100"}
        `}>
          {esAceptada ? "SI" : "NO"}
        </div>

        {/* Título */}
        <h2 className={`text-xl font-bold mb-1 ${esAceptada ? "text-green-700" : "text-red-700"}`}>
          Inscripción {resultado.estado}
        </h2>

        {/* Datos de la comisión */}
        <div className="bg-gray-50 rounded-xl p-4 my-4 text-left space-y-2">
          <Row label="Comisión" valor={resultado.comision} />
          <Row label="Materia"  valor={resultado.materia} />
          <Row label="Legajo"   valor={resultado.id_legajo} />
          <Row label="Estado"   valor={resultado.estado} />
          {/* Motivo de rechazo, si existe */}
          {resultado.motivo && (
            <Row label="Motivo" valor={resultado.motivo} colorValor="text-red-600" />
          )}
        </div>

        {/* Número de ID de inscripción (útil para el alumno) */}
        <p className="text-xs text-gray-400 mb-6">
          Nro. de solicitud: #{resultado.id}
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onNueva}
            className="w-full py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white
                       font-medium text-sm transition-colors"
          >
            Nueva inscripción
          </button>
          <button
            onClick={onCerrar}
            className="w-full py-2.5 rounded-lg border border-gray-300 text-gray-600
                       hover:bg-gray-50 font-medium text-sm transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar para cada fila de datos del resultado
function Row({ label, valor, colorValor = "text-gray-800" }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className="text-xs text-gray-500 flex-shrink-0">{label}</span>
      <span className={`text-xs font-medium text-right ${colorValor}`}>{valor}</span>
    </div>
  );
}
