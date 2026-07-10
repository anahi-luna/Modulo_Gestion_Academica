export default function EstadoNotaBadge({ estado }) {
  const estilos = {
    Aprobado:    "bg-green-100  text-green-800  border border-green-300",
    Desaprobado: "bg-red-100    text-red-800    border border-red-300",
    Regular:     "bg-yellow-100 text-yellow-800 border border-yellow-300",
  };

  const clase = estilos[estado] || "bg-gray-100 text-gray-600 border border-gray-300";

  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${clase}`}>
      {estado}
    </span>
  );
}