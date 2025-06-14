import { Routes, Route } from "react-router-dom"

// import Login from './pages/LoginPage.jsx'
import Chat from './pages/ChatLLM/ChatPage.jsx'
// import ChatNew from './pages/Chat.jsx'
import LoginNew from './pages/ChatLLM/Login.jsx'
import Administrador from './pages/GestionUsuario/Administrador.jsx'


function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Login />} /> */}
      {/* <Route path="/chat" element={<ChatNew />} /> */}
      <Route path="/gestionUsuario" element={< Administrador/>} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/" element={<LoginNew />} />
    </Routes>
  )
}


export default App
