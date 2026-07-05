import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import HomeAlumno from "./pages/HomeAlumno";       // ← NUEVO
import Inscripciones from "./pages/Inscripciones";
import HomeAdmin from "./pages/HomeAdmin";
import InscripcionesAdmin from './pages/InscripcionesAdmin';
import AsistenciaAdmin from './pages/AsistenciaAdmin';
import { ADMIN_MOCK, USER_MOCK } from './mocks/usuariosMock';
import { useState } from "react";

export default function App() {

    const [usuario, setUsuario] = useState(USER_MOCK);

    return (
        <BrowserRouter>
            <>
                <Navbar usuario={usuario} setUsuario={setUsuario} />

                <main>
                    <Routes>

                        {/* Ruta principal: home según rol */}
                        <Route
                            path="/"
                            element={
                                usuario.rol === "ADMIN"
                                    ? <HomeAdmin />
                                    : <HomeAlumno usuario={usuario} />  // ← CAMBIADO
                            }
                        />

                        {/* Vista de inscripción del alumno */}
                        <Route
                            path="/inscripciones"                        // ← NUEVO
                            element={
                                usuario.rol === "ADMIN"
                                    ? <Navigate to="/" replace />
                                    : <Inscripciones />
                            }
                        />

                        <Route
                            path="/inscripcionesAdmin"
                            element={
                                usuario.rol === "ADMIN"
                                    ? <InscripcionesAdmin />
                                    : <Navigate to="/" replace />
                            }
                        />

                        <Route
                            path="/AsistenciaAdmin"
                            element={
                                usuario.rol === "ADMIN"
                                    ? <AsistenciaAdmin />
                                    : <Navigate to="/" replace />
                            }
                        />

                    </Routes>
                </main>
            </>
        </BrowserRouter>
    );
}
