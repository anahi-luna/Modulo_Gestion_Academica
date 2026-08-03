import { NavLink, Link, useNavigate } from "react-router-dom";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline'
import userAvatar from "../../assets/user.png";
import logo from "../../images/logo.jpeg";
import useAuth from "../../auth/hooks/useAuth";
import { LOGIN_ROUTE, PORTAL_URL } from "../../auth/config";

// Componente de barra de navegación (navbar) que muestra el logo, el título del sistema, los links a los módulos
// disponibles según los permisos del usuario, y un menú de usuario con opciones de notificaciones y cerrar sesión.
export default function Navbar({ modulo }) {
  // useAuth devuelve el usuario logueado, sus roles y funciones para verificar permisos y cerrar sesión.
  const { user, roles, hasPermission, hasRole, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    window.location.href = LOGIN_ROUTE;
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors
     ${isActive
       ? "bg-red-600 text-white"
       : "text-red-100 hover:bg-red-700"
     }`;

  const linkClassMobile = ({ isActive }) =>
    `block px-3 py-2 rounded-md text-base font-medium
     ${isActive
       ? "bg-red-600 text-white"
       : "text-red-100 hover:bg-red-700"
     }`;


// Lista de links a los módulos del sistema, con la ruta, el label y el permiso requerido para mostrarlos.
  const links = [
    { to: "/inscripcionesAdmin", label: "Inscripciones", permiso: "inscripcion.inscripciones.leer" },
    { to: "/inscripciones", label: "Inscribirme", permiso: "inscripcion.inscripciones.crear" },
    { to: "/asistencia", label: "Asistencia", permiso: "inscripcion.asistencias.leer" },
    { to: "/GestionClases", label: "Clases", permiso: "inscripcion.clases.leer"},
    { to: "/GestionEvaluaciones", label: "Evaluaciones", permiso: "inscripcion.evaluaciones.leer" },
    { to: "/calificaciones", label: "Calificaciones", permiso: "inscripcion.calificaciones.leer" },
    { to: "/certificados", label: "Certificados", permiso: "inscripcion.certificados.leer" },
    { to: "/resultado-plan", label: "Resultado del plan", permiso: "inscripcion.resultado_plan.leer" },
  ];

  function debeMostrarse(link) {
    return hasPermission(link.permiso);
  }

  if (!user) {
    // Mientras no sé quién es el usuario todavía (se está restaurando
    // la sesión desde sessionStorage), muestro una navbar "pelada" (sin
    // links) para no mostrar de más ni tirar error.
    return (
      <nav className="bg-red-800 shadow-md sticky top-0 z-40 h-16" />
    );
  }
  // Si el usuario es un alumno, le muestro el link "Mi plan" en la navbar, que lo lleva a su plan de estudios.
  const esAlumno = hasRole("Alumno");

  return (
    <Disclosure as="nav" className="bg-red-800 shadow-md sticky top-0 z-40">
      {({ open }) => (
        <>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">

          <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-red-200 hover:bg-red-700 hover:text-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Abrir menú</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>

          <div className="flex flex-1 items-center justify-center px-10 lg:px-0 lg:items-stretch lg:justify-start">
            <Link to="/" className="flex shrink-0 items-center gap-3">
              <img
                src={logo}
                alt="Logo Bomberos"
                className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
              />
              <div className="hidden md:block">
                <p className="font-bold text-white text-sm leading-tight">Sistema de Legajos</p>
                <p className="text-red-200 text-xs">Bomberos Voluntarios</p>
              </div>
            </Link>

            <div className="hidden lg:ml-6 lg:flex lg:items-center">
              <div className="flex space-x-1 xl:space-x-2">
                <a

                  type="button"
                  onClick={() => window.location.href = PORTAL_URL}
                  className={linkClass({ isActive: false })}
                >
                  Inicio
                </a>

                {esAlumno && (
                  <NavLink to="/mi-plan" className={linkClass} end>Mi plan</NavLink>
                )}

                {links.filter(debeMostrarse).map((link) => (
                  <NavLink key={link.to} to={link.to} className={linkClass} end>
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center gap-1 sm:gap-2 pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0">

            {modulo && (
              <span className="hidden md:inline text-xs bg-red-900 text-red-100 px-3 py-1 rounded-full font-medium">
                {modulo}
              </span>
            )}

            <Menu as="div" className="relative ml-1 sm:ml-2">
              <MenuButton className="relative flex rounded-full">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Menú usuario</span>
                <img
                  alt="Usuario"
                  src={userAvatar}
                  className="size-8 rounded-full bg-red-900 outline -outline-offset-1 outline-white/10"
                />
              </MenuButton>

              <MenuItems
                transition
                className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75"
              >
                
                <MenuItem>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 text-left px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5"
                  >
                    <ArrowRightStartOnRectangleIcon className="size-4" />
                    Cerrar sesión
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>

        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 top-16 bg-black/50 z-30 lg:hidden"
          aria-hidden="true"
        />
      )}

      <DisclosurePanel className="lg:hidden relative z-40 bg-red-800">
        {({ close }) => (
          <div className="space-y-1 px-2 pt-2 pb-3">
            <NavLink to="/" className={linkClassMobile} end onClick={() => close()}>Home</NavLink>

            {esAlumno && (
              <NavLink to="/mi-plan" className={linkClassMobile} end onClick={() => close()}>Mi plan</NavLink>
            )}

            {links.filter(debeMostrarse).map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClassMobile} end onClick={() => close()}>
                {link.label}
              </NavLink>
            ))}
          </div>
        )}
      </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}