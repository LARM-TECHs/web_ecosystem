import React from "react";
import './Header.css'; // Asegúrate de tener un archivo CSS para estilos
import logo_icon from '../../assets/logo_icon.svg'
import home_icon from '../../assets/home_icon.svg'
import bell_icon from '../../assets/bell_icon.svg'
import person_icon from '../../assets/person_icon.svg'



const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <img src={logo_icon} alt="Logo" className="logo-img" />
            </div>
            <nav className="nav">
                <ul>
                    <li>
                        <a href="#inicio">
                            <img src={home_icon} alt="" />
                        </a>
                    </li>
                </ul>

                <h1>Ecosistema Universitario</h1>

                <ul className="user-icons nav-icons">
                    <li>
                        <a href="#about">
                            <img src={bell_icon} alt="" />
                        </a>
                    </li>
                    <li>
                        <a href="#contact">
                            <img src={ person_icon } alt="" />
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;