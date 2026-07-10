// Dropdown de navegación reutilizable, mismo patrón visual que usan
// el grupo de diego: botón con label + flecha, panel blanco
// con ítems (ícono + título + descripción chica), resaltado al pasar
// el mouse o si la ruta está activa.

import { NavLink } from "react-router-dom";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function NavDropdown({ label, icono: LabelIcon, items }) {
  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-red-100 hover:bg-red-800 hover:text-white transition-colors">
        {LabelIcon && <LabelIcon className="size-4" />}
        {label}
        <ChevronDownIcon className="size-4" />
      </MenuButton>

      <MenuItems
        transition
        className="absolute left-0 z-50 mt-2 w-72 origin-top-left rounded-xl bg-white shadow-lg ring-1 ring-black/5 py-2 transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75"
      >
        {items.map((item) => (
          <MenuItem key={item.to}>
            {({ focus }) => (
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-start gap-3 px-4 py-2.5 mx-1 rounded-lg
                   ${isActive ? "bg-red-50" : focus ? "bg-gray-50" : ""}`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icono
                      className={`size-5 mt-0.5 shrink-0 ${isActive ? "text-red-700" : "text-gray-400"}`}
                    />
                    <span>
                      <span className={`block text-sm font-medium ${isActive ? "text-red-700" : "text-gray-800"}`}>
                        {item.titulo}
                      </span>
                      <span className="block text-xs text-gray-400">{item.descripcion}</span>
                    </span>
                  </>
                )}
              </NavLink>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}