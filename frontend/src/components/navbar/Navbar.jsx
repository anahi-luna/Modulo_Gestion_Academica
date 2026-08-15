import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  AcademicCapIcon,
  ClipboardDocumentListIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
  BookOpenIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightStartOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import logo from "../../images/logo.jpeg";
import useAuth from "../../auth/hooks/useAuth";
import { LOGIN_ROUTE, PORTAL_URL } from "../../auth/config";
import { MODULOS } from "../../config/modulos";
import NavDropdown from "./DropDown";
import NavDropdownMobile from "./NavDropdownMobile";

// Componente de barra de navegación (navbar) que muestra el logo, el título del sistema, los links a los módulos
// disponibles según los permisos del usuario, y un menú de usuario con opciones de notificaciones y cerrar sesión.
//
// El diseño (colores, tipografía, formato del logo, estilo de los links y del menú mobile) está alineado
// con el navbar del microservicio de planes. Los links, permisos y rutas son los propios de inscripciones
// y no se modificaron.
export default function Navbar({ modulo }) {
  // useAuth devuelve el usuario logueado, sus roles y funciones para verificar permisos y cerrar sesión.
  const { user, hasPermission, hasRole, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await logout();
    window.location.href = LOGIN_ROUTE;
  }

  function closeMenus() {
    setMobileOpen(false);
  }

  // El objeto user de este microservicio solo trae id, id_legajo y
  // email (no nombre/apellido, ver auth_routes.py). Se arma igual con
  // una cadena de fallback para que, si en algún momento el backend
  // empieza a mandar nombre/apellido, se muestre solo con este cambio.
  const nombreUsuario =
    user?.nombre && user?.apellido
      ? `${user.nombre} ${user.apellido}`
      : user?.persona?.nombre && user?.persona?.apellido
      ? `${user.persona.nombre} ${user.persona.apellido}`
      : user?.nombre ||
        user?.persona?.nombre ||
        user?.email ||
        user?.persona?.email ||
        "Usuario";

  const linkClass =
    "px-3.5 py-1.5 rounded-full text-sm font-medium hover:bg-white/15 flex items-center gap-2 cursor-pointer transition-colors";

  const linkClassMobile =
    "flex items-center gap-4 rounded-2xl bg-white border border-slate-200 px-4 py-4 font-bold text-slate-700 shadow-sm cursor-pointer";

  // Lista de links a los módulos del sistema, con la ruta, el label, el ícono y el/los permiso(s) requerido(s) para mostrarlos.
  // "permisoAlumno" es el equivalente "_propio" del permiso general: en las páginas unificadas
  // (donde adentro se resuelve si es personal o alumno) el link se muestra si el usuario tiene
  // cualquiera de los dos, para no ocultarle el acceso a un alumno que solo tiene el permiso propio.
 const modulosVisibles = MODULOS.map((modulo) =>({
    ...modulo,
    opciones: modulo.opciones.filter((opcion) =>
        hasPermission(opcion.permiso)
    ),

 })).filter((modulo) => modulo.opciones.length > 0);

  if (!user) {
    // Mientras no sé quién es el usuario todavía (se está restaurando
    // la sesión desde sessionStorage), muestro una navbar "pelada" (sin
    // links) para no mostrar de más ni tirar error.
    return (
      <header className="bg-gradient-to-b from-red-700 to-red-900 shadow-md sticky top-0 z-40 h-[72px]" />
    );
  }

  // Si el usuario es un alumno, le muestro el link "Mi plan" en la navbar, que lo lleva a su plan de estudios.
  const esAlumno =  [
      "inscripcion.inscripciones.crear",
      "inscripcion.inscripciones.leer_propio",
      "inscripcion.asistencias.leer_propio",
      "inscripcion.clases.leer_propio",
      "inscripcion.evaluaciones.leer_propio",
      "inscripcion.calificaciones.leer_propio",
      "inscripcion.resultado_academico.leer_propio",
      "inscripcion.resultado_plan.leer_propio",
      "inscripcion.certificados.leer_propio",
    ]
    console.log(
  hasPermission("inscripcion.calificaciones.leer_propio")
);
  return (
    <header className="bg-gradient-to-b from-red-700 to-red-900 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 text-left shrink-0">
        
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white/10 border border-white/25 flex items-center justify-center overflow-hidden shadow-sm">
            <img
              src={logo}
              alt="Logo Bomberos"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="hidden md:block">
            <h1 className="text-base font-bold leading-tight">
              Sistema de Legajos
            </h1>
            <p className="text-xs text-white/80">Bomberos Voluntarios</p>
          </div>
        </Link>

        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center cursor-pointer"
          aria-label="Abrir menú"
        >
          <Bars3Icon className="size-[22px]" />
        </button>

        <div className="hidden lg:flex items-center gap-2 shrink-0">
          <Menu as="div" className="relative">
            <MenuButton className="relative flex items-center justify-center rounded-full cursor-pointer">
              <span className="sr-only">Menú usuario</span>
              <UserCircleIcon className="size-9 text-white/90" />
            </MenuButton>

            <MenuItems
              transition
              className="absolute right-0 z-50 mt-3 w-56 origin-top-right rounded-xl bg-white text-slate-800 border border-slate-200 shadow-xl p-2 transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75"
            >
              <p className="px-3 py-2 text-sm font-semibold border-b border-slate-100 truncate">
                {nombreUsuario}
              </p>
            </MenuItems>
          </Menu>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold border border-white/25 hover:bg-white/15 cursor-pointer"
          >
            <ArrowRightStartOnRectangleIcon className="size-[17px]" />
            Cerrar Sesión
          </button>
        </div>
      </div>

      <nav className="hidden lg:block border-t border-white/10 bg-black/10">
        <div className="max-w-7xl mx-auto px-5 py-2 flex flex-wrap items-center gap-1.5">
          <a
            onClick={() => (window.location.href = PORTAL_URL)}
            className={linkClass}
          >
            <HomeIcon className="size-[16px]" />
            Portal inicio
          </a>

          {esAlumno && (
            <NavLink
              to="/mi-plan"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? "bg-white text-red-800 hover:bg-white" : ""}`
              }
              end
            >
              <AcademicCapIcon className="size-[16px]" />
              Mi plan
            </NavLink>
          )}

          {modulosVisibles.map((modulo)=> {
            if(modulo.opciones.length === 1) {
              const Icon = modulo.icon;
              const opcion = modulo.opciones[0];

              return(
                <NavLink
                  key={modulo.id}
                  to={opcion.ruta}
                  className={({ isActive }) =>
                    `${linkClass} ${isActive ? "bg-white text-red-800 hover:bg-white" : ""}`
                  }
                  end
                >
                  <Icon className="size-[16px]"/>
                  {modulo.titulo}
                </NavLink>
              )
            }

            return(
              <NavDropdown
                key={modulo.id}
                titulo={modulo.titulo}
                icon={modulo.icon}
                opciones={modulo.opciones}
              />
            )
          })}

          {modulo && (
            <span className="ml-auto text-xs bg-white/15 text-white px-3 py-1 rounded-full font-medium">
              {modulo}
            </span>
          )}
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 bg-slate-50 text-slate-800 z-[100] p-5 lg:hidden overflow-y-auto">
          <button
            onClick={closeMenus}
            className="fixed top-4 right-4 w-11 h-11 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center text-red-700 cursor-pointer"
            aria-label="Cerrar menú"
          >
            <XMarkIcon className="size-[22px]" />
          </button>

          <p className="text-sm font-semibold text-slate-700 mb-1 truncate pr-14">
            {nombreUsuario}
          </p>
          <p className="text-xs font-bold uppercase text-slate-500 mb-4">
            Menú principal
          </p>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => {
                closeMenus();
                window.location.href = PORTAL_URL;
              }}
              className={`${linkClassMobile} w-full text-left`}
            >
              <span className="w-10 h-10 text-red-700 flex items-center justify-center rounded-xl bg-red-50">
                <HomeIcon className="size-5" />
              </span>
              Portal inicio
            </button>

            {esAlumno && (
              <NavLink
                to="/mi-plan"
                className={linkClassMobile}
                end
                onClick={closeMenus}
              >
                <span className="w-10 h-10 text-red-700 flex items-center justify-center rounded-xl bg-red-50">
                  <AcademicCapIcon className="size-5" />
                </span>
                Mi plan
              </NavLink>
            )}

            {modulosVisibles.map((modulo)=> {
              if(modulo.opciones.length === 1) {
                const Icon = modulo.icon;
                const opcion = modulo.opciones[0];

                return(
                  <NavLink
                    key={modulo.id}
                    to={opcion.ruta}
                    className={linkClassMobile}
                    end
                    onClick={closeMenus}
                  >
                    <Icon className="size-[17px]"/>
                    {modulo.titulo}
                  </NavLink>
                )
              }

              return(
                <NavDropdownMobile
                  key={modulo.id}
                  titulo={modulo.titulo}
                  icon={modulo.icon}
                  opciones={modulo.opciones}
                  onClose={closeMenus}
                />
              )
            })}

            <button
              type="button"
              onClick={() => {
                closeMenus();
                handleLogout();
              }}
              className={`${linkClassMobile} w-full text-left`}
            >
              <span className="w-10 h-10 text-red-700 flex items-center justify-center rounded-xl bg-red-50">
                <ArrowRightStartOnRectangleIcon className="size-5" />
              </span>
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
}