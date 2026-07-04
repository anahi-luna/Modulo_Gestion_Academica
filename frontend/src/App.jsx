
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Inscripciones from "./pages/Inscripciones"
import HomeAdmin from "./pages/HomeAdmin"
import { ADMIN_MOCK, USER_MOCK } from './mocks/usuariosMock';
import { useState } from "react";
import InscripcionesAdmin from './pages/InscripcionesAdmin';
import AsistenciaAdmin from './pages/AsistenciaAdmin';



export default function App() {

  const [usuario, setUsuario] = useState(USER_MOCK)
    
  return (
    //Rutas segun el rol
    <BrowserRouter>

      <>
        <Navbar
          usuario = {usuario}
          setUsuario = {setUsuario}
        />
        
        
        <main>

          <Routes>
              <Route
                path="/"
                element={
                  usuario.rol === "ADMIN"
                  ? <HomeAdmin />
                  : <Inscripciones />
                }
              />

              <Route
                path="/inscripcionesAdmin"
                element={
                  usuario.rol ==="ADMIN"

                    ? <InscripcionesAdmin/>
                    : <Navigate to="/" replace />
                }
              />

              <Route
                path="/AsistenciaAdmin"
                element={
                  usuario.rol ==="ADMIN"

                    ? <AsistenciaAdmin/>
                    : <Navigate to="/" replace />
                }
              />
          </Routes>
        </main>
      </>
        

    </BrowserRouter>  
    

  )
}

