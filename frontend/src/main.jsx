import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './styles/LoginPage.css'
// import './styles/ChatPage.css'
import './styles/globals.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
// import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; // Asegúrate de que este archivo exista y contenga tus estilos globales

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
