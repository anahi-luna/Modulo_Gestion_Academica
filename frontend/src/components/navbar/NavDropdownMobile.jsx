import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function NavDropdownMobile({
    titulo,
    icon: Icon,
    opciones,
    onClose,
}) {
    const [abierto, setAbierto] = useState(false);

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow">
            <button
                onClick={() => setAbierto(!abierto)}
                className="w-full flex items-center justify-between px-4 py-4"
            >
                <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-700">
                        {Icon && <Icon className="size-5" />}
                    </span>

                    <span className="font-semibold text-slate-800">
                        {titulo}
                    </span>
                </div>

                <ChevronDownIcon
                    className={`size-5 transition-transform ${
                        abierto ? "rotate-180" : ""
                    }`}
                />
            </button>

            {abierto && (
                <div className="border-t border-slate-100">
                    {opciones.map((opcion) => (
                        <NavLink
                            key={opcion.ruta}
                            to={opcion.ruta}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `block px-6 py-3 text-sm ${
                                    isActive
                                        ? "bg-red-50 text-red-700 font-medium"
                                        : "text-slate-700 hover:bg-gray-50"
                                }`
                            }
                        >
                            {opcion.titulo}
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );
}