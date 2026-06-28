import { NavLink } from "react-router-dom";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import user from "../../assets/user.png";
import logo from "../../images/Logo.png";
import { adminMock, userMock } from "../../Services/mockUsers";

export default function Navbar({ usuario, setUsuario, modulo }) {

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors
     ${isActive
       ? "bg-red-600 text-white"
       : "text-red-100 hover:bg-red-700"
     }`;

  return (
    <Disclosure as="nav" className="bg-red-800 shadow-md sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">

          {/* Botón menú mobile */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-red-200 hover:bg-red-700 hover:text-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Abrir menú</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          {/* Logo + título + links */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">

            {/* Logo e identidad */}
            <div className="flex shrink-0 items-center gap-3">
              <img
                src={logo}
                alt="Logo Bomberos"
                className="h-12 w-12 object-contain"   
              />
              <div className="hidden sm:block">
                <p className="font-bold text-white text-sm leading-tight">Sistema de Legajos</p>
                <p className="text-red-200 text-xs">Bomberos Voluntarios</p>
              </div>
            </div>

            {/* Links de navegación */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="flex space-x-2">
                <NavLink to="/" className={linkClass} end>Home</NavLink>
                {/* aca metemos cuando tengamos mas modulos*/}
              </div>
            </div>
          </div>

          {/* Derecha: módulo activo + campana + perfil */}
          <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

            {/* Badge módulo activo — viene como prop desde la vista */}
            {modulo && (
              <span className="hidden sm:inline text-xs bg-red-900 text-red-100 px-3 py-1 rounded-full font-medium">
                {modulo}
              </span>
            )}

            {/* Notificaciones */}
            <button
              type="button"
              className="relative rounded-full p-1 text-red-200 hover:text-white"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Ver notificaciones</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>

            {/* Dropdown perfil */}
            <Menu as="div" className="relative ml-2">
              <MenuButton className="relative flex rounded-full">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Menú usuario</span>
                <img
                  alt="Usuario"
                  src={user}
                  className="size-8 rounded-full bg-red-900 outline -outline-offset-1 outline-white/10"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75"
              >
                <MenuItem>
                  <button
                    onClick={() => setUsuario(adminMock)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5"
                  >
                    Admin
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => setUsuario(userMock)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5"
                  >
                    Usuario
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>

        </div>
      </div>

      {/* Menú mobile desplegable */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}