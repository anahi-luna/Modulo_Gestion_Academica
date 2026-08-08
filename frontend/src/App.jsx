import './App.css'
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import ProtectedRoute from './auth/routes/ProtectedRoute';
import MiPlan from "./pages/MiPlan";
import ResultadoPlan from "./pages/ResultadoPlan";
import Home from "./pages/Home";
import Inscripciones from "./pages/Inscripciones";
import InscripcionesAdmin from './pages/InscripcionesAdmin';
import Asistencia from './pages/Asistencia';
import GestionClases from "./pages/GestionClases";
import Calificaciones from "./pages/Calificaciones";
import GestionEvaluaciones from "./pages/GestionEvaluaciones";
import Certificados from "./pages/Certificados";

// La app principal, que arma el navbar y el router con todas las páginas. 
export default function App() {

    return (
        <>
            <Navbar />

            <main>
                <Routes>

                        {/* Home: uno solo para todos, arma las cards de
                            módulos según los permisos del usuario */}
                        <Route path="/" element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                                
                            } />

                        {/* Pedir una inscripción: no depende de un permiso
                            del microservicio, cualquiera autenticado
                            puede solicitarla */}
                        <Route path="/inscripciones" element={
                                <ProtectedRoute>
                                    <Inscripciones />
                                </ProtectedRoute>
                                
                            
                            } />

                        {/* Gestión de inscripciones: requiere poder leerlas
                            como personal de gestión */}
                        <Route
                            path="/inscripcionesAdmin"
                            element={
                                <ProtectedRoute permissions={["inscripcion.inscripciones.leer"]}>
                                    <InscripcionesAdmin />
                                </ProtectedRoute>
                            }
                        />

                        {/* Asistencia: unificada, adentro se gatea con
                            permiso de crear/actualizar si puede editar.
                            Acepta el permiso general (personal) o el
                            propio (alumno viendo su propia asistencia) */}
                        <Route
                            path="/asistencia"
                            element={
                                <ProtectedRoute permissions={["inscripcion.asistencias.leer", "inscripcion.asistencias.leer_propio"]}>
                                    <Asistencia />
                                </ProtectedRoute>
                            }
                        />

                        {/* Gestión de clases: sigue siendo una sola vista,
                            ahora protegida por permiso en vez de por rol.
                            Acepta el permiso general o el propio (alumno
                            viendo las clases de sus comisiones) */}
                        <Route
                            path="/GestionClases"
                            element={
                                <ProtectedRoute permissions={["inscripcion.clases.leer", "inscripcion.clases.leer_propio"]}>
                                    <GestionClases />
                                </ProtectedRoute>
                            }
                        />

                        {/* Calificaciones: unificada (staff vs alumno se
                            resuelve adentro de la página). Acepta el
                            permiso general o el propio (alumno viendo
                            sus propias notas) */}
                        <Route
                            path="/calificaciones"
                            element={
                                <ProtectedRoute permissions={["inscripcion.calificaciones.leer", "inscripcion.calificaciones.leer_propio"]}>
                                    <Calificaciones />
                                </ProtectedRoute>
                            }
                        />

                        {/* Gestión de evaluaciones. Acepta el permiso
                            general o el propio (alumno viendo las
                            evaluaciones de sus comisiones) */}
                        <Route
                            path="/GestionEvaluaciones"
                            element={
                                <ProtectedRoute permissions={["inscripcion.evaluaciones.leer", "inscripcion.evaluaciones.leer_propio"]}>
                                    <GestionEvaluaciones />
                                </ProtectedRoute>
                            }
                        />

                        {/* Certificados: unificada (staff vs alumno se
                            resuelve adentro de la página). Acepta el
                            permiso general o el propio (alumno viendo
                            sus propios certificados) */}
                        <Route
                            path="/certificados"
                            element={
                                <ProtectedRoute permissions={["inscripcion.certificados.leer", "inscripcion.certificados.leer_propio"]}>
                                    <Certificados />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/mi-plan" element={<MiPlan />} />
                        <Route
                            path="/resultado-plan"
                            element={
                                <ProtectedRoute permissions={["inscripcion.resultado_plan.leer"]}>
                                    <ResultadoPlan />
                                </ProtectedRoute>
                            }
                        />

                    </Routes>
            </main>
        </>
    );
}
