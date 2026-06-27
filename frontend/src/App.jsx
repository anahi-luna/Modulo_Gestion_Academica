
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar"
import Inscripciones from "./pages/Inscripciones"
import HomeAdmin from "./pages/HomeAdmin"
import { adminMock, userMock } from './Services/mockUsers';
import { useState } from "react";
import { Navigate } from "react-router-dom";



export default function App() {

  const [usuario, setUsuario] = useState(userMock)
    
  return (

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
          </Routes>
        </main>
      </>
        

    </BrowserRouter>  
    

  )
}

