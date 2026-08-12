import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function NavDropdown({
    titulo,
    icon: Icon,
    opciones,
}) {

    const [abierto, setAbierto] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function cerrar(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setAbierto(false);
            }
        }

        document.addEventListener("mousedown", cerrar);

        return () =>
            document.removeEventListener("mousedown", cerrar);
    }, []);

    return (
        <div className="relative" ref={ref}>

            <button
                onClick={() => setAbierto((v) => !v)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
                {Icon && <Icon className="size-[17px]" />}

                <span>{titulo}</span>

                <ChevronDownIcon
                    className={`size-4 transition-transform ${
                        abierto ? "rotate-180" : ""
                    }`}
                />
            </button>

            {abierto && (
                <div className="absolute left-0 mt-2 w-60 rounded-xl bg-white border border-gray-200 shadow-xl overflow-hidden z-50">

                    {opciones.map((opcion) => (

                        <NavLink
                            key={opcion.ruta}
                            to={opcion.ruta}
                            onClick={() => setAbierto(false)}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 text-sm transition-colors ${
                                    isActive
                                        ? "bg-red-50 text-red-700 font-medium"
                                        : "text-gray-700 hover:bg-gray-100"
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