// Chip visual para mostrar el estado del certificado.
// Los nombres de los estados vienen desde la base de datos.
// Este componente solamente define cómo se visualiza cada estado.

export default function EstadoCertificadoBadge({ estado }) {
  const estilos = {
    Emitido: "bg-green-100 text-green-800 border border-green-300",
    Revocado: "bg-red-100 text-red-800 border border-red-300",
  };

  const clase = estilos[estado] ?? "bg-gray-100 text-gray-600 border border-gray-300";

  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${clase}`}>
      {estado}
    </span>
  );
}