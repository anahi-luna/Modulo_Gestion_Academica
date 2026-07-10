import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import RutaProtegida from "./components/rutas/RutaProtegida";
import HomeAlumno from "./pages/HomeAlumno";
import HomeProfesor from "./pages/HomeProfesor";
import Inscripciones from "./pages/Inscripciones";
import HomeAdmin from "./pages/HomeAdmin";
import InscripcionesAdmin from './pages/InscripcionesAdmin';
import AsistenciaAdmin from './pages/AsistenciaAdmin';
import GestionClases from "./pages/GestionClases";
import MisCalificaciones from "./pages/MisCalificaciones";
import GestionCalificaciones from "./pages/GestionCalificaciones";
import MisCertificados from "./pages/MisCertificados";
import GestionCertificados from "./pages/GestionCertificados";
import MiAsistencia from "./pages/MiAsistencia";
import { ROLES, ADMIN_MOCK, ALUMNO_MOCK } from './mocks/usuariosMock';
import { useState } from "react";


export default function App() {

    const [usuario, setUsuario] = useState(ALUMNO_MOCK);

    return (
        <BrowserRouter>
            <>
                <Navbar usuario={usuario} setUsuario={setUsuario} />

                <main>
                    <Routes>

                        {/* Home: cambia según el rol */}
                        <Route
                            path="/"
                            element={
                                usuario.rol === ROLES.ADMIN
                                    ? <HomeAdmin />
                                    : usuario.rol === ROLES.PROFESOR
                                        ? <HomeProfesor usuario={usuario} />
                                        : <HomeAlumno usuario={usuario} />
                            }
                        />

                        {/* Pre-inscripción: sólo alumno */}
                        <Route
                            path="/inscripciones"
                            element={
                                <RutaProtegida usuario={usuario} rolesPermitidos={[ROLES.ALUMNO]}>
                                    <Inscripciones />
                                </RutaProtegida>
                            }
                        />

                        {/* Gestión de inscripciones: admin y administrativo */}
                        <Route
                            path="/inscripcionesAdmin"
                            element={
                                <RutaProtegida usuario={usuario} rolesPermitidos={[ROLES.ADMIN, ROLES.ADMINISTRATIVO]}>
                                    <InscripcionesAdmin />
                                </RutaProtegida>
                            }
                        />

                        {/* Asistencia: admin y profesor */}
                        <Route
                            path="/AsistenciaAdmin"
                            element={
                                <RutaProtegida usuario={usuario} rolesPermitidos={[ROLES.ADMIN, ROLES.PROFESOR]}>
                                    <AsistenciaAdmin />
                                </RutaProtegida>
                            }
                        />

                        {/* Mi asistencia: sólo alumno, solo lectura */}
                        <Route
                            path="/miAsistencia"
                            element={
                                <RutaProtegida usuario={usuario} rolesPermitidos={[ROLES.ALUMNO]}>
                                    <MiAsistencia usuario={usuario} />
                                </RutaProtegida>
                            }
                        />


                        {/* Gestion de clases: admin */}
                        <Route
                            path="/GestionClases"
                            element={
                                <RutaProtegida usuario={usuario} rolesPermitidos={[ROLES.ADMIN]}>
                                    <GestionClases />
                                </RutaProtegida>
                            }
                        />

                        {/* Mis calificaciones: sólo alumno */}
                        <Route
                            path="/calificaciones"
                            element={
                                <RutaProtegida usuario={usuario} rolesPermitidos={[ROLES.ALUMNO]}>
                                    <MisCalificaciones usuario={usuario} />
                                </RutaProtegida>
                            }
                        />

                        {/* Gestión de calificaciones: docente y admin */}
                        <Route
                            path="/calificacionesAdmin"
                            element={
                                <RutaProtegida usuario={usuario} rolesPermitidos={[ROLES.ADMIN, ROLES.PROFESOR]}>
                                    <GestionCalificaciones usuario={usuario} />
                                </RutaProtegida>
                            }
                        />

                        {/* Mis certificados: sólo alumno */}
                        <Route
                            path="/certificados"
                            element={
                                <RutaProtegida usuario={usuario} rolesPermitidos={[ROLES.ALUMNO]}>
                                    <MisCertificados usuario={usuario} />
                                </RutaProtegida>
                            }
                        />

                        {/* Gestión de certificados: sólo admin (autoridad habilitada) */}
                        <Route
                            path="/certificadosAdmin"
                            element={
                                <RutaProtegida usuario={usuario} rolesPermitidos={[ROLES.ADMIN]}>
                                    <GestionCertificados usuario={usuario} />
                                </RutaProtegida>
                            }
                        />

                    </Routes>
                </main>
            </>
        </BrowserRouter>
    );
}