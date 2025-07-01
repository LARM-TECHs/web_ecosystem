import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx";
import ChatPage from './features/chat-llm/pages/ChatPage.jsx'


// Importa las páginas de la característica Comedor
import ComedorDashboardPage from './features/comedor/pages/ComedorDashboardPage.jsx';
// import MenuManagementPage from './features/comedor/pages/MenuManagementPage.jsx';
// import MenuDisplayPage from './features/comedor/pages/MenuDisplayPage.jsx'; // Para que los estudiantes vean el menú
// import QrCodeGenerationPage from './features/comedor/pages/QrCodeGenerationPage.jsx';
// import QrValidationPage from './features/comedor/pages/QrValidationPage.jsx';



import NotasDashboardPage from "./features/notas-estudiantes/NotasDashboardPage.jsx";
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
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Ruta para el Chat LLM */}
      <Route path="/chat-llm/chat" element={<ChatPage />} />

      <Route path="/comedor/dashboard" element={<ComedorDashboardPage />} />


      {/* Rutas para el Microservicio de Comedor 
      <Route path="/comedor" element={
        <ProtectedRoute allowedRoles={['admin', 'estudiante', 'staff', 'staff_comedor']}>
          <ComedorDashboardPage />
        </ProtectedRoute>
      } />
       */}
      {/* Rutas específicas para Estudiantes del Comedor 
      <Route path="/comedor/student/menu" element={
        <ProtectedRoute allowedRoles={['admin', 'estudiante', 'staff_comedor']}>
          <MenuDisplayPage />
        </ProtectedRoute>
      } />
      <Route path="/comedor/student/qr-generator" element={
        <ProtectedRoute allowedRoles={['admin', 'estudiante']}>
          <QrCodeGenerationPage />
        </ProtectedRoute>
      } />
       */}

      {/* Rutas específicas para Personal del Comedor 
      <Route path="/comedor/staff/menu-management" element={
        <ProtectedRoute allowedRoles={['admin', 'staff_comedor']}>
          <MenuManagementPage />
        </ProtectedRoute>
      } />
      <Route path="/comedor/staff/qr-validation" element={
        <ProtectedRoute allowedRoles={['admin', 'staff_comedor']}>
          <QrValidationPage />
        </ProtectedRoute>
      } />
       */}

      <Route path="/notas-estudiantes" element={<NotasDashboardPage />} />
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
