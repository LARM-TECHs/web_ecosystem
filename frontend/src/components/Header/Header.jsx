// src/components/Header/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Para la navegación (logout)
import { logoutUser } from '../../api/auth'; // Importa la función de logout desde tu API
import './Header.css'; // Asegúrate de que esta ruta sea correcta

// Importa las imágenes por defecto que serán FIJAS
import defaultAppLogo from '../../assets/images/logoheader.png'; // Logo de la aplicación en el header
import defaultHomeIcon from '../../assets/icons/home.png';           // Icono de Home fijo
import defaultBellIcon from '../../assets/icons/bell.png';           // Icono de Notificaciones fijo

// Importa la imagen de perfil por defecto (configurable via prop)
import defaultUserIcon from '../../assets/icons/user.png';           // Icono de Usuario por defecto

const Header = ({
    // 'title' es una prop configurable, con un valor por defecto
    title = 'Ecosistema Universitario',
    // 'profileImage' es una prop configurable para la imagen del usuario, con un valor por defecto
    profileImage = defaultUserIcon
}) => {
    const navigate = useNavigate();
    // Obtener información del usuario del localStorage
    const userName = localStorage.getItem('userEmail') || 'Usuario';
    const userRole = localStorage.getItem('userRole') || 'Rol';

    const handleLogout = () => {
        logoutUser(); // Llama a la función de logout que limpia localStorage
        navigate('/login'); // Redirige a la página de login
    };

    return (
        <header className="app-header"> {/* Clase CSS principal del header */}
            <div className="header-left-section"> {/* Contenedor para logo y título */}
                <div className="header-logo-container"> {/* Contenedor para la imagen del logo fijo */}
                    <img src={defaultAppLogo} alt="Logo de la aplicación" className="logo-image" />
                </div>
                <h1 className="header-title">{title}</h1> {/* Título configurable */}
            </div>

            <nav className='header-nav'>
                <div className="header-icons"> {/* Contenedor para los íconos de navegación */}
                    {/* El ícono de Home (fijo) */}
                    <div className="header-icon" onClick={() => navigate('/dashboard')} title="Inicio">
                        <img src={defaultHomeIcon} alt="Icono de Inicio" />
                    </div>
                    {/* El ícono de Notificaciones (fijo) */}
                    <div className="header-icon" title="Notificaciones">
                        <img src={defaultBellIcon} alt="Icono de Notificaciones" />
                    </div>
                    {/* El ícono de usuario (imagen configurable), que contendrá el nombre y el botón de logout */}
                    <div className="header-icon user-profile-toggle" title="Perfil de Usuario">
                        <img src={profileImage} alt="Icono de Usuario" /> {/* Imagen de perfil configurable */}
                        <div className="user-profile-dropdown"> {/* Menú desplegable para perfil/logout */}
                            <span className="user-name-display">{userName} ({userRole})</span>
                            <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
