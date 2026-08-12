import './App.css'
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import ProtectedRoute from './auth/routes/ProtectedRoute';
import MiPlan from "./pages/MiPlan";
import ResultadoPlan from "./pages/ResultadoPlan";
import HomeAdmin from './pages/HomeAdmin';
import HomeAlumno from './pages/HomeAlumno';
import HomeRouter from './routes/HomeRouter';
import Inscripciones from "./pages/Inscripciones";
import InscripcionesAdmin from './pages/InscripcionesAdmin';
import Asistencia from './pages/GestionAsistencia';
import GestionClases from "./pages/GestionClases";
import Calificaciones from "./pages/GestionCalificaciones";
import GestionEvaluaciones from "./pages/GestionEvaluaciones";
import Certificados from "./pages/GestionCertificados";
import MisClases from './pages/MisClases';
import GestionAsistencia from './pages/GestionAsistencia';
import MiAsistencia from './pages/MiAsistencia';
import GestionCalificaciones from './pages/GestionCalificaciones';
import MisCalificaciones from './pages/MisCalificaciones';
import MisEvaluaciones from './pages/MisEvaluaciones';
import GestionCertificados from './pages/GestionCertificados';
import MisCertificados from './pages/MisCertificados';

// La app principal, que arma el navbar y el router con todas las páginas. 
export default function App() {

    return (
        <>
            <Navbar />

            <main>
                <Routes>

                        {/* Homes */}
                        <Route path="/" element={
                                <ProtectedRoute>
                                    <HomeRouter />
                                </ProtectedRoute>
                                
                            } />

                        <Route
                            path='/inicio-admin'
                            element={
                                <ProtectedRoute permissions={["inscripcion.inscripciones.leer"]}>
                                    <HomeAdmin/>
                                </ProtectedRoute>
                            }

                        />

                        <Route
                            path='/inicio-alumno'
                            element={
                                <ProtectedRoute permissions={["inscripcion.inscripciones.crear"]}>
                                    <HomeAlumno/>
                                </ProtectedRoute>
                            }

                        />

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

                        {/* Asistencia para alumno y administracion */}
                        <Route
                            path="/gestion-asistencia"
                            element={
                                <ProtectedRoute permissions={["inscripcion.asistencias.leer"]}>
                                    <GestionAsistencia />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/mi-asistencia"
                            element={
                                <ProtectedRoute permissions={["inscripcion.asistencias.leer_propio"]}>
                                    <MiAsistencia />
                                </ProtectedRoute>
                            }
                        />

                        {/* Gestión de clases y vista para alumno*/}
                        <Route
                            path="/gestion-clases"
                            element={
                                <ProtectedRoute permissions={["inscripcion.clases.leer"]}>
                                    <GestionClases />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/mis-clases"
                            element={
                                <ProtectedRoute permissions={["inscripcion.clases.leer_propio"]}>
                                    <MisClases />
                                </ProtectedRoute>
                            }
                        />



                        {/* Gestionar calificaciones y vista alumno */}
                        <Route
                            path="/gestion-calificaciones"
                            element={
                                <ProtectedRoute permissions={["inscripcion.calificaciones.leer"]}>
                                    <GestionCalificaciones />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/mis-calificaciones"
                            element={
                                <ProtectedRoute permissions={["inscripcion.calificaciones.leer_propio"]}>
                                    <MisCalificaciones />
                                </ProtectedRoute>
                            }
                        />

                        {/* Gestión de evaluaciones y vista alumno*/}
                        <Route
                            path="/GestionEvaluaciones"
                            element={
                                <ProtectedRoute permissions={["inscripcion.evaluaciones.leer"]}>
                                    <GestionEvaluaciones />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/mis-evaluaciones"
                            element={
                                <ProtectedRoute permissions={["inscripcion.evaluaciones.leer_propio"]}>
                                    <MisEvaluaciones />
                                </ProtectedRoute>
                            }
                        />

                        {/* Gestión certificados y vista alumno*/}
                        <Route
                            path="/gestion-certificados"
                            element={
                                <ProtectedRoute permissions={["inscripcion.certificados.leer"]}>
                                    <GestionCertificados />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/mis-certificados"
                            element={
                                <ProtectedRoute permissions={["inscripcion.certificados.leer_propio"]}>
                                    <MisCertificados />
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
