import React from 'react';
import './styles/NotasDashboardPage.css';

import Header from '../../components/Header/Header';
import Gestion from '../../assets/images/gestion.png';
import Facultad from '../../assets/images/facultad.png';
import Asignaturas from '../../assets/images/asignaturas.png';
import Carreras from '../../assets/images/carreras.png';
import Brigadas from '../../assets/images/brigadas.png';
import Estudiantes from '../../assets/images/students.png';


// Main App Component
function NotasDashboardPage() {
    return (
        // Main container with responsive background gradient and overflow hidden
        <div className="app-container">
            {/* Decorative background circles */}
            <div className="decorative-circle circle-1"></div>
            <div className="decorative-circle circle-2"></div>
            <div className="decorative-circle circle-3"></div>

            <Header />


            {/* Main Content Section */}
            <main className="main-content">
                {/* Management Section */}
                <div className="management-section">
                    <div className="people-icon">
                        {/* Placeholder for management icon */}
                        <img src={Gestion} alt="Gestion" />
                    </div>
                    <h2 className="management-title">
                        Gestión Universitaria
                    </h2>
                </div>

                {/* Menu Grid */}
                <div className="menu-grid">
                    {/* Menu Item: Facultades */}
                    <div className="menu-item">
                        <div className="menu-icon">
                            {/* Placeholder for icon */}
                            <img src={Facultad} alt="Facultades" />
                        </div>
                        <span className="menu-text">Facultades</span>
                    </div>

                    {/* Menu Item: Asignaturas */}
                    <div className="menu-item">
                        <div className="menu-icon">
                            {/* Placeholder for icon */}
                            <img src={Asignaturas} alt="Asignaturas" />
                        </div>
                        <span className="menu-text">Asignaturas</span>
                    </div>

                    {/* Menu Item: Carreras */}
                    <div className="menu-item">
                        <div className="menu-icon">
                            {/* Placeholder for icon */}
                            <img src={Carreras} alt="Carreras" />
                        </div>
                        <span className="menu-text">Carreras</span>
                    </div>

                    {/* Menu Item: Brigadas */}
                    <div className="menu-item">
                        <div className="menu-icon">
                            {/* Placeholder for icon */}
                            <img src={Brigadas} alt="Brigadas" />
                        </div>
                        <span className="menu-text">Brigadas</span>
                    </div>

                    {/* Menu Item: Estudiantes */}
                    <div className="menu-item">
                        <div className="menu-icon">
                            {/* Placeholder for icon */}
                            <img src={Estudiantes} alt="Estudiantes" />
                        </div>
                        <span className="menu-text">Estudiantes</span>
                    </div>
                </div>
            </main>

            {/* University Logo */}
            <div className="university-logo">
                <img src="logo-ult.png" alt="Universidad de las Tunas" />
            </div>
        </div>
    );
}

export default NotasDashboardPage;
