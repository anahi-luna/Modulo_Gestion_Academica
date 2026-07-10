export default function ResumenAsistenciaCards({ resumen }) {
  const items = [
    { titulo: "Clases registradas", valor: resumen.total, color: "text-gray-800" },
    { titulo: "Presentes", valor: resumen.presentes, color: "text-green-600" },
    { titulo: "Tarde", valor: resumen.tardes, color: "text-yellow-600" },
    { titulo: "Ausentes", valor: resumen.ausentes, color: "text-red-600" },
    {
      titulo: "% Asistencia",
      valor: resumen.porcentaje !== null ? `${resumen.porcentaje}%` : "-",
      color: "text-gray-800",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
      {items.map((item) => (
        <div key={item.titulo} className="bg-white rounded-xl shadow p-4">
          <p className="text-xs text-gray-400">{item.titulo}</p>
          <p className={`text-3xl font-bold mt-1 ${item.color}`}>{item.valor}</p>
        </div>
      ))}
    </div>
  );
}