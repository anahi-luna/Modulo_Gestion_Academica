export default function EstadoAsistenciaBadge({ estado }) {
  const estilos = {
    Presente:  "bg-green-100  text-green-800  border border-green-300",
    Tarde:     "bg-yellow-100 text-yellow-800 border border-yellow-300",
    Ausente:   "bg-red-100    text-red-800    border border-red-300",
    Pendiente: "bg-gray-100   text-gray-500   border border-gray-200",
  };

  const clase = estilos[estado] || "bg-gray-100 text-gray-600 border border-gray-300";

  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${clase}`}>
      {estado}
    </span>
  );
}