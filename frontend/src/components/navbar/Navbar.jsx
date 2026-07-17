import { NavLink, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import user from "../../assets/user.png";
import logo from "../../images/Logo.png";
import { usePermissions } from "../../context/PermissionsContext";
import { obtenerUsuarios } from "../../Services/authService";
import { ACCIONES } from "../../config/modulos";

export default function Navbar({ modulo }) {

  // Ya no recibo "usuario"/"setUsuario" por props: los saco directo del
  // contexto de permisos, así cualquier componente que necesite saber
  // quién está logueado lo puede hacer sin tener que pasarlo de padre
  // en padre (esto se llama "prop drilling" y es justo lo que el
  // contexto evita).
  const { usuario, hasPermission, cambiarUsuario } = usePermissions();
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);

  // Traigo la lista de usuarios de prueba que armó mi compañera en el
  // back (admin, director, docente, alumno, etc.) para poder elegir
  // "meterme" como cualquiera de ellos desde el dropdown de perfil.
  // Esto reemplaza el switch fijo Admin/Alumno/Profesor que había antes.
  useEffect(() => {
    async function cargar() {
      try {
        const lista = await obtenerUsuarios();
        setUsuariosDisponibles(lista);
      } catch (error) {
        console.error("No pude cargar la lista de usuarios de prueba", error);
      }
    }
    cargar();
  }, []);

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

  // Antes había un link hardcodeado por rol para cada módulo. Ahora
  // armo la lista de links en base a los permisos de LECTURA de cada
  // módulo: si el usuario puede leer ese módulo, le muestro el link.
  // Esto hace que el mismo array sirva para desktop y para mobile.
  const links = [
    { to: "/inscripcionesAdmin", label: "Inscripciones", permiso: ACCIONES.INSCRIPCIONES_LEER },
    { to: "/inscripciones", label: "Inscribirme", permiso: null, soloSiNoTieneOtroPermiso: ACCIONES.INSCRIPCIONES_LEER },
    { to: "/asistencia", label: "Asistencia", permiso: ACCIONES.ASISTENCIAS_LEER },
    { to: "/GestionEvaluaciones", label: "Evaluaciones", permiso: ACCIONES.EVALUACIONES_LEER },
    { to: "/calificaciones", label: "Calificaciones", permiso: ACCIONES.CALIFICACIONES_LEER },
    { to: "/certificados", label: "Certificados", permiso: ACCIONES.CERTIFICADOS_LEER },
  ];

  // "Inscribirme" es un caso especial: es la vista donde alguien pide
  // ingresar a una comisión. No depende de un permiso del microservicio
  // (cualquier usuario autenticado puede pedir inscribirse), así que la
  // muestro salvo que el usuario YA sea alguien de gestión (tiene el
  // permiso de leer inscripciones administradas).
  function debeMostrarse(link) {
    if (link.soloSiNoTieneOtroPermiso) {
      return !hasPermission(link.soloSiNoTieneOtroPermiso);
    }
    return hasPermission(link.permiso);
  }

  if (!usuario) {
    // Mientras no sé quién es el usuario todavía, muestro una navbar
    // "pelada" (sin links) para no mostrar de más ni tirar error.
    return (
      <nav className="bg-red-800 shadow-md sticky top-0 z-40 h-16" />
    );
  }

  return (
    <Disclosure as="nav" className="bg-red-800 shadow-md sticky top-0 z-40">
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

          <div className="flex flex-1 items-center justify-center lg:items-stretch lg:justify-start">

            {/* Logo + título: ahora es un Link a "/", así que clickeándolo
                desde cualquier vista se vuelve al Home. Antes era solo
                una imagen sin ningún link. */}
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
                <NavLink to="/" className={linkClass} end>Home</NavLink>

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

            <button
              type="button"
              className="relative rounded-full p-1 text-red-200 hover:text-white"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Ver notificaciones</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>

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
                className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75"
              >
                {/* Info del usuario actual + sus roles, para poder ver
                    en la defensa qué permisos está usando cada uno */}
                <div className="px-4 py-2 border-b border-white/10">
                  <p className="text-sm text-white font-medium">{usuario.nombre}</p>
                  <p className="text-xs text-gray-400">{usuario.cargo}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {usuario.roles.map((r) => r.nombre).join(", ")}
                  </p>
                </div>

                {/* Selector de usuario de prueba: reemplaza el switch
                    fijo Admin/Alumno/Profesor. Ahora lista TODOS los
                    usuarios mock que definió el back, para poder probar
                    cualquier combinación de roles/permisos. */}
                {usuariosDisponibles.map((u) => (
                  <MenuItem key={u.id}>
                    <button
                      onClick={() => cambiarUsuario(u.usuario)}
                      className={`block w-full text-left px-4 py-2 text-sm data-focus:bg-white/5 ${
                        usuario.id === u.id ? "text-white font-semibold" : "text-gray-300"
                      }`}
                    >
                      {u.nombre} — {u.cargo}
                    </button>
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>

        </div>
      </div>

      <DisclosurePanel className="lg:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          <NavLink to="/" className={linkClassMobile} end>Home</NavLink>

          {links.filter(debeMostrarse).map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClassMobile} end>
              {link.label}
            </NavLink>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
