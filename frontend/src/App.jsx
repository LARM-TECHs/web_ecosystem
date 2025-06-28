import { Routes, Route } from "react-router-dom"

import LoginPage from "./pages/Login/Login.jsx";
import DashboardPage from "./pages/Home/DashboardPage.jsx"
// import Login from './pages/LoginPage.jsx'
import Chat from './pages/ChatLLM/ChatPage.jsx'
// import ChatNew from './pages/Chat.jsx'



// import GestionUsuario from "./pages/notasEstudiantes/HomeGestion.jsx";
// import HomeEst from "./pages/notasEstudiantes/HomeEst";
// import Notas from "./pages/notasEstudiantes/Notas";
// import FormNotas from "./pages/notasEstudiantes/components/FormNotas";
// import Facultades from "./pages/notasEstudiantes/Facultades";
// import Asignaturas from "./pages/notasEstudiantes/Asignaturas";
// import FormAsignatura from "./pages/notasEstudiantes/components/FormAsignatura";
// import FormFacultad from "./pages/notasEstudiantes/components/FormFacultad";
// import FormCarrera from "./pages/notasEstudiantes/components/FormCarrera";
// import Carreras from "./pages/notasEstudiantes/Carreras";
// import Brigadas from "./pages/notasEstudiantes/Brigadas";
// import FormBrigadas from "./pages/notasEstudiantes/components/FormBrigadas";
// import Estudiantes from "./pages/notasEstudiantes/Estudiantes";
// import FormEstudiantes from "./pages/notasEstudiantes/components/FormEstudiantes";
// import AsigCarrera from "./pages/notasEstudiantes/AsigCarrera";
// import FormAsigCarrera from "./pages/notasEstudiantes/components/FormAsigCarrera";




function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<DashboardPage />} />

      <Route path="/chat" element={<Chat />} />
      

      {/* <Route path="/gestion-usuario" element={<GestionUsuario />} />
      <Route path="/gestion-usuario/facultades" element={<Facultades />} />
      <Route path="/gestion-usuario/facultades/new" element={<FormFacultad />} />
      <Route
        path="/gestion-usuario/facultades/:id/editar"
        element={<FormFacultad />}
      />
      <Route path="/gestion-usuario/asignaturas" element={<Asignaturas />} />
      <Route path="/gestion-usuario/asignaturas/new" element={<FormAsignatura />} />
      <Route
        path="/gestion-usuario/asignaturas/:id/editar"
        element={<FormAsignatura />}
      />
      <Route path="/gestion-usuario/carreras" element={<Carreras />} />
      <Route path="/gestion-usuario/carreras/new" element={<FormCarrera />} />
      <Route path="/gestion-usuario/carreras/:id/editar" element={<FormCarrera />} />
      <Route path="/gestion-usuario/brigadas" element={<Brigadas />} />
      <Route path="/gestion-usuario/brigadas/new" element={<FormBrigadas />} />
      <Route path="/gestion-usuario/brigadas/:id/editar" element={<FormBrigadas />} />
      <Route path="/gestion-usuario/estudiantes" element={<Estudiantes />} />
      <Route path="/gestion-usuario/estudiantes/new" element={<FormEstudiantes />} />
      <Route
        path="/gestion-usuario/estudiantes/:id/editar"
        element={<FormEstudiantes />}
      />
      <Route
        path="/gestion-usuario/estudiantes/notas/:idBrigada/:idEstudiante"
        element={<Notas />}
      />
      <Route
        path="/gestion-usuario/estudiantes/notas/:idBrigada/:idEstudiante/new"
        element={<FormNotas />}
      />
      <Route
        path="/gestion-usuario/estudiantes/notas/:idBrigada/:idEstudiante/:idNota/editar"
        element={<FormNotas />}
      />
      <Route
        path="/gestion-usuario/carreras/asignaturas/:id"
        element={<AsigCarrera />}
      />
      <Route
        path="/gestion-usuario/carreras/asignaturas/:id/new"
        element={<FormAsigCarrera />}
      /> */}

    </Routes>
  )
}


export default App
