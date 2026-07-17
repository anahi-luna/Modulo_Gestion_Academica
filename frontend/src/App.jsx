import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import RutaProtegida from "./components/rutas/RutaProtegida";
import { PermissionsProvider } from "./context/PermissionsContext";
import { ACCIONES } from "./config/modulos";

import Home from "./pages/Home";
import Inscripciones from "./pages/Inscripciones";
import InscripcionesAdmin from './pages/InscripcionesAdmin';
import Asistencia from './pages/Asistencia';
import GestionClases from "./pages/GestionClases";
import Calificaciones from "./pages/Calificaciones";
import GestionEvaluaciones from "./pages/GestionEvaluaciones";
import Certificados from "./pages/Certificados";

// Antes esta app tenía un Home distinto por rol (HomeAdmin/HomeProfesor/
// HomeAlumno) y un montón de rutas separadas para "la vista del admin"
// y "la vista del alumno" de un mismo módulo (por ejemplo
// CalificacionesAdmin vs MisCalificaciones). Ahora hay UNA sola ruta y
// UNA sola página por módulo (Home, Asistencia, Calificaciones,
// Certificados): la página de adentro decide qué mostrar según los
// PERMISOS del usuario logueado, no según un rol fijo.
//
// El usuario ya no se guarda acá con useState: lo maneja el
// PermissionsProvider, que le pregunta al back "quién sos y qué podés
// hacer" (GET /api/auth/me) y se lo pasa a toda la app a través de un
// contexto (usePermissions()). Así ni el Navbar ni las páginas
// necesitan recibir "usuario" por props.
//
// Inscripciones sí sigue teniendo 2 páginas (Inscripciones.jsx para
// pedir una inscripción e InscripcionesAdmin.jsx para gestionarlas):
// son dos flujos de UI genuinamente distintos, no la misma tabla con
// botones ocultos, así que no las unifiqué. Lo que sí cambié es que
// ahora se protegen por PERMISO (micro2.inscripciones.leer/actualizar)
// en vez de por rol hardcodeado.
export default function App() {

    return (
        <BrowserRouter>
            <PermissionsProvider>
                <Navbar />

                <main>
                    <Routes>

                        {/* Home: uno solo para todos, arma las cards de
                            módulos según los permisos del usuario */}
                        <Route path="/" element={<Home />} />

                        {/* Pedir una inscripción: no depende de un permiso
                            del microservicio, cualquiera autenticado
                            puede solicitarla */}
                        <Route path="/inscripciones" element={<Inscripciones />} />

                        {/* Gestión de inscripciones: requiere poder leerlas
                            como personal de gestión */}
                        <Route
                            path="/inscripcionesAdmin"
                            element={
                                <RutaProtegida permisoRequerido={ACCIONES.INSCRIPCIONES_LEER}>
                                    <InscripcionesAdmin />
                                </RutaProtegida>
                            }
                        />

                        {/* Asistencia: unificada, adentro se gatea con
                            permiso de crear/actualizar si puede editar */}
                        <Route
                            path="/asistencia"
                            element={
                                <RutaProtegida permisoRequerido={ACCIONES.ASISTENCIAS_LEER}>
                                    <Asistencia />
                                </RutaProtegida>
                            }
                        />

                        {/* Gestión de clases: sigue siendo una sola vista,
                            ahora protegida por permiso en vez de por rol */}
                        <Route
                            path="/GestionClases"
                            element={
                                <RutaProtegida permisoRequerido={ACCIONES.CLASES_LEER}>
                                    <GestionClases />
                                </RutaProtegida>
                            }
                        />

                        {/* Calificaciones: unificada (staff vs alumno se
                            resuelve adentro de la página) */}
                        <Route
                            path="/calificaciones"
                            element={
                                <RutaProtegida permisoRequerido={ACCIONES.CALIFICACIONES_LEER}>
                                    <Calificaciones />
                                </RutaProtegida>
                            }
                        />

                        {/* Gestión de evaluaciones */}
                        <Route
                            path="/GestionEvaluaciones"
                            element={
                                <RutaProtegida permisoRequerido={ACCIONES.EVALUACIONES_LEER}>
                                    <GestionEvaluaciones />
                                </RutaProtegida>
                            }
                        />

                        {/* Certificados: unificada (staff vs alumno se
                            resuelve adentro de la página) */}
                        <Route
                            path="/certificados"
                            element={
                                <RutaProtegida permisoRequerido={ACCIONES.CERTIFICADOS_LEER}>
                                    <Certificados />
                                </RutaProtegida>
                            }
                        />

                    </Routes>
                </main>
            </PermissionsProvider>
        </BrowserRouter>
    );
}
