import { NavLink } from "react-router-dom";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import user from "../../assets/user.png";
import logo from "../../images/Logo.png";
import { ROLES, ADMIN_MOCK, ALUMNO_MOCK, PROFESOR_MOCK } from "../../mocks/usuariosMock";

export default function Navbar({ usuario, setUsuario, modulo }) {

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors
     ${isActive
       ? "bg-red-600 text-white"
       : "text-red-100 hover:bg-red-700"
     }`;

  // Mismo link de mobile, usado tanto en el menú desplegable como en el
  // desktop, para no repetir la lista de condiciones por rol dos veces.
  const linkClassMobile = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium
     ${isActive
       ? "bg-red-600 text-white"
       : "text-red-100 hover:bg-red-700"
     }`;

  return (
    <Disclosure as="nav" className="bg-red-800 shadow-md sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">

          {/* Botón menú mobile: ahora se ve hasta pantallas lg (antes sm) */}
          <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-red-200 hover:bg-red-700 hover:text-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Abrir menú</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          {/* Logo + título + links */}
          <div className="flex flex-1 items-center justify-center lg:items-stretch lg:justify-start">

            {/* Logo e identidad */}
            <div className="flex shrink-0 items-center gap-3">
              <img
                src={logo}
                alt="Logo Bomberos"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
              />
              <div className="hidden md:block">
                <p className="font-bold text-white text-sm leading-tight">Sistema de Legajos</p>
                <p className="text-red-200 text-xs">Bomberos Voluntarios</p>
              </div>
            </div>

            {/* Links de navegación (desktop, >= lg) */}
            <div className="hidden lg:ml-6 lg:flex lg:items-center">
              <div className="flex space-x-1 xl:space-x-2">
                <NavLink to="/" className={linkClass} end>Home</NavLink>

                {(usuario.rol === ROLES.ALUMNO) && (
                    <NavLink to="/inscripciones" className={linkClass} end>Inscribirme</NavLink>
                )}

                {(usuario.rol === ROLES.ADMIN) && (
                    <NavLink to="/inscripcionesAdmin" className={linkClass} end>Inscripciones</NavLink>
                )}

                {(usuario.rol === ROLES.ADMIN || usuario.rol === ROLES.PROFESOR) && (
                    <NavLink to="/AsistenciaAdmin" className={linkClass} end>Asistencia</NavLink>
                )}

                {(usuario.rol === ROLES.ADMIN || usuario.rol === ROLES.PROFESOR) && (
                    <NavLink to="/CalificacionesAdmin" className={linkClass} end>Calificaciones</NavLink>
                )}

                {(usuario.rol === ROLES.ALUMNO) && (
                    <NavLink to="/calificaciones" className={linkClass} end>Mis calificaciones</NavLink>
                )}

                {(usuario.rol === ROLES.ADMIN) && (
                    <NavLink to="/certificadosAdmin" className={linkClass} end>Certificados</NavLink>
                )}

                {(usuario.rol === ROLES.ALUMNO) && (
                    <NavLink to="/certificados" className={linkClass} end>Mis certificados</NavLink>
                )}
                {/* aca metemos cuando tengamos mas modulos*/}
              </div>
            </div>
          </div>

          {/* Derecha: módulo activo + campana + perfil */}
          <div className="absolute inset-y-0 right-0 flex items-center gap-1 sm:gap-2 pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0">

            {/* Badge módulo activo — se oculta hasta md para no apretar en tablet chica */}
            {modulo && (
              <span className="hidden md:inline text-xs bg-red-900 text-red-100 px-3 py-1 rounded-full font-medium">
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
            <Menu as="div" className="relative ml-1 sm:ml-2">
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
                    onClick={() => setUsuario(ADMIN_MOCK)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5"
                  >
                    Admin
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => setUsuario(ALUMNO_MOCK)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5"
                  >
                    Alumno
                  </button>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={() => setUsuario(PROFESOR_MOCK)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5"
                  >
                    Profesor
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>

        </div>
      </div>

      {/* Menú mobile desplegable (visible hasta lg) */}
      <DisclosurePanel className="lg:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          <NavLink to="/" className={linkClassMobile} end>Home</NavLink>

          {(usuario.rol === ROLES.ALUMNO) && (
              <NavLink to="/inscripciones" className={linkClassMobile} end>Inscribirme</NavLink>
          )}

          {(usuario.rol === ROLES.ADMIN) && (
              <NavLink to="/inscripcionesAdmin" className={linkClassMobile} end>Inscripciones</NavLink>
          )}

          {(usuario.rol === ROLES.ADMIN || usuario.rol === ROLES.PROFESOR) && (
              <NavLink to="/AsistenciaAdmin" className={linkClassMobile} end>Asistencia</NavLink>
          )}

          {(usuario.rol === ROLES.ADMIN || usuario.rol === ROLES.PROFESOR) && (
              <NavLink to="/CalificacionesAdmin" className={linkClassMobile} end>Calificaciones</NavLink>
          )}

          {(usuario.rol === ROLES.ALUMNO) && (
              <NavLink to="/calificaciones" className={linkClassMobile} end>Mis calificaciones</NavLink>
          )}

          {(usuario.rol === ROLES.ADMIN) && (
              <NavLink to="/certificadosAdmin" className={linkClassMobile} end>Certificados</NavLink>
          )}

          {(usuario.rol === ROLES.ALUMNO) && (
              <NavLink to="/certificados" className={linkClassMobile} end>Mis certificados</NavLink>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}