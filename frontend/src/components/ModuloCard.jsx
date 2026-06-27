import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
//Carta reutilizable para el modulo
export default function ModuloCard({
  titulo,
  descripcion,
  cantidad,
  icono,
  color,
  ruta,
}) {
    const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(ruta)}
      className={`relative rounded-xl border-l-4 border-${color}-500 bg-white shadow p-6 hover:shadow-lg transition cursor-pointer`}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-4">
        {icono}
      </div>

      <h3 className="text-xl font-semibold text-gray-800">
        {titulo}
      </h3>

      <p className="mt-2 text-gray-500">
        {descripcion}
      </p>

      <div className="mt-4 inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
        {cantidad}
      </div>

      <ArrowRightIcon className="absolute bottom-5 right-5 h-5 w-5 text-gray-400" />
    </div>
  );
}