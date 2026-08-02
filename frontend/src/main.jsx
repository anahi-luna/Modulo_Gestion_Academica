import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'  
import { AuthProvider } from './auth/context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  //<StrictMode>
    <BrowserRouter basename="/inscripciones">
      <AuthProvider>
        <App /> 
      </AuthProvider>
    </BrowserRouter>
 // </StrictMode>,
)
