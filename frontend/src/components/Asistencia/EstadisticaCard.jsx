export default function EstadisticaCard({ titulo, cantidad }) {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-3 sm:p-5">
      <p className="text-gray-500 text-xs sm:text-sm">{titulo}</p>
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-1 sm:mt-2">{cantidad}</h2>
    </div>
  );
}