import { Routes, Route } from "react-router-dom"

// import Login from './pages/LoginPage.jsx'
import Chat from './pages/ChatPage.jsx'
// import ChatNew from './pages/Chat.jsx'
import LoginNew from './pages/Login.jsx'


function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Login />} /> */}
      {/* <Route path="/chat" element={<ChatNew />} /> */}
      <Route path="/chat" element={<Chat />} />
      <Route path="/" element={<LoginNew />} />
    </Routes>
  )
}


export default App
