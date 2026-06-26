
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/navbar"
import Inscripciones from "../pages/Inscripciones"


export default function App() {


    
  return (

    <BrowserRouter>

      <>
        <Navbar/>
        
        
        <main>

          <Routes>
              <Route path="/"     element={<Inscripciones/>}></Route>
          </Routes>
        </main>
      </>
        

    </BrowserRouter>  
    

  )
}

