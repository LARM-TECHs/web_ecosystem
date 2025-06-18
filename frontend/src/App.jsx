import { Routes, Route } from "react-router-dom"

// import Login from './pages/LoginPage.jsx'
import Chat from './pages/ChatLLM/ChatPage.jsx'
// import ChatNew from './pages/Chat.jsx'
import LoginNew from './pages/ChatLLM/Login.jsx'


import Home from "./pages/notasEstudiantes/Home";
import HomeEst from "./pages/notasEstudiantes/HomeEst";
import Notas from "./pages/notasEstudiantes/Notas";
import FormNotas from "./components/notasEstudiantes/FormNotas";
import Facultades from "./pages/notasEstudiantes/Facultades";
import Asignaturas from "./pages/notasEstudiantes/Asignaturas";
import FormAsignatura from "./components/notasEstudiantes/FormAsignatura";
import FormFacultad from "./components/notasEstudiantes/FormFacultad";
import FormCarrera from "./components/notasEstudiantes/FormCarrera";
import Carreras from "./pages/notasEstudiantes/Carreras";
import Brigadas from "./pages/notasEstudiantes/Brigadas";
import FormBrigadas from "./components/notasEstudiantes/FormBrigadas";
import Estudiantes from "./pages/notasEstudiantes/Estudiantes";
import FormEstudiantes from "./components/notasEstudiantes/FormEstudiantes";
import AsigCarrera from "./pages/notasEstudiantes/AsigCarrera";
import FormAsigCarrera from "./components/notasEstudiantes/FormAsigCarrera";




function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<Login />} /> */}
      {/* <Route path="/chat" element={<ChatNew />} /> */}
      <Route path="/chat" element={<Chat />} />
      <Route path="/" element={<LoginNew />} />
      
      <Route path="/home" element={<Home />} />
          <Route path="/home/facultades" element={<Facultades />} />
          <Route path="/home/facultades/new" element={<FormFacultad />} />
          <Route
            path="/home/facultades/:id/editar"
            element={<FormFacultad />}
          />
          <Route path="/home/asignaturas" element={<Asignaturas />} />
          <Route path="/home/asignaturas/new" element={<FormAsignatura />} />
          <Route
            path="/home/asignaturas/:id/editar"
            element={<FormAsignatura />}
          />
          <Route path="/home/carreras" element={<Carreras />} />
          <Route path="/home/carreras/new" element={<FormCarrera />} />
          <Route path="/home/carreras/:id/editar" element={<FormCarrera />} />
          <Route path="/home/brigadas" element={<Brigadas />} />
          <Route path="/home/brigadas/new" element={<FormBrigadas />} />
          <Route path="/home/brigadas/:id/editar" element={<FormBrigadas />} /> 
          <Route path="/home/estudiantes" element={<Estudiantes />} />
          <Route path="/home/estudiantes/new" element={<FormEstudiantes />} />
          <Route
            path="/home/estudiantes/:id/editar"
            element={<FormEstudiantes />}
          />
          <Route
            path="/home/estudiantes/notas/:idBrigada/:idEstudiante"
            element={<Notas />}
          />
          <Route
            path="/home/estudiantes/notas/:idBrigada/:idEstudiante/new"
            element={<FormNotas />}
          />
          <Route
            path="/home/estudiantes/notas/:idBrigada/:idEstudiante/:idNota/editar"
            element={<FormNotas />}
          />
          <Route
            path="/home/carreras/asignaturas/:id"
            element={<AsigCarrera />}
          />
          <Route
            path="/home/carreras/asignaturas/:id/new"
            element={<FormAsigCarrera />}
          />

    </Routes>
  )
}


export default App
