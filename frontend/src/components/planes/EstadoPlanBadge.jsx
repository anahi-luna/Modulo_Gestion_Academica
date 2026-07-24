// Chip de color según el estado del plan. Mismo patrón visual que
// EstadoBadge.jsx (inscripciones) y EstadoCertificadoBadge.jsx.

export default function EstadoPlanBadge({ estado }) {
  const estilos = {
    Finalizado: "bg-green-100 text-green-800 border border-green-300",
    "En curso": "bg-blue-100 text-blue-800 border border-blue-300",
    Incompleto: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    Abandonado: "bg-red-100 text-red-800 border border-red-300",
  };

  const clase = estilos[estado] || "bg-gray-100 text-gray-600 border border-gray-300";

  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${clase}`}>
      {estado}
    </span>
  );
}