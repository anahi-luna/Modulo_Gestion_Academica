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


                        {/* Gestion de clases: admin */}
                        <Route
                            path="/GestionClases"
                            element={
                                <RutaProtegida usuario={usuario} rolesPermitidos={[ROLES.ADMIN]}>
                                    <GestionClases />
                                </RutaProtegida>
                            }
                        />

                    </Routes>
                </main>
            </>
        </BrowserRouter>
    );
}