import React from 'react';
import './Header.css'; // Mueve aquí los estilos .header, .header-logo, .leaf-icon, .header-title, .header-icons, .header-icon

const Header = () => (
    <header className="header">
        <div className="header-logo">
            <div className="leaf-icon">
                <img src="logoheader.png" alt="Logo" />
            </div>
        </div>
        <h1 className="header-title">Ecosistema Universitario</h1>
        <nav className='header-nav'>
            <div className="header-icons">
                <div className="header-icon"><img src="home.png" alt="Home" /></div>
                <div className="header-icon"><img src="bell.png" alt="Notifications" /></div>
                <div className="header-icon"><img src="user.png" alt="User" /></div>
            </div>
        </nav>
    </header>
);

export default Header;
