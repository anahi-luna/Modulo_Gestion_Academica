
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Inscripciones from "./pages/Inscripciones"
import HomeAdmin from "./pages/HomeAdmin"
import { adminMock, userMock } from './Services/mockUsers';
import { useState } from "react";
import InscripcionesAdmin from './pages/InscripcionesAdmin';



export default function App() {

  const [usuario, setUsuario] = useState(userMock)
    
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
          </Routes>
        </main>
      </>
        

    </BrowserRouter>  
    

  )
}

