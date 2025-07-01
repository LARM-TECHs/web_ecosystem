import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './styles/DashboardPage.css'; // Mover todo el CSS aquí
import Header from '../components/Header/Header';
import AppCard from './components/AppCard';

const DashboardPage = () => {
    const navigate = useNavigate(); // Inicializa el hook de navegación
    
    useEffect(() => {
        // Animación de círculos
        document.querySelectorAll('.circle').forEach((circle, index) => {
            setTimeout(() => {
                circle.style.opacity = '1';
            }, index * 200);
        });

        // Animaciones de conexión
        document.querySelectorAll('.connection-line').forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'scaleX(1)';
            }, 800 + index * 200);
        });
    }, []);

    const cards = [
        { id: 'gestion', title: 'Gestión U.', icon: 'gestion1.png', path: '/notas-estudiantes' },
        { id: 'biblioteca', title: 'Biblioteca', icon: 'biblioteca.png' },
        { id: 'chat', title: 'Chat IA', icon: 'chatai.png', path: '/chat-llm/chat' },
        { id: 'comedor', title: 'Comedor', icon: 'comedor.png' },
        { id: 'votaciones', title: 'Votaciones', icon: 'votac.png' },
        { id: 'horario', title: 'Horario', icon: 'horario.png' }
    ];

    return (
        <div className="body-wrapper">
            <Header />

            <main className="main-content">
                <div className="circle circle-1" />
                <div className="circle circle-2" />
                <div className="circle circle-3" />

                <div className="cards-container">
                    {/* Connection Lines */}
                    <div className="connection-line line-horizontal-top" />
                    <div className="connection-line line-horizontal-bottom" />
                    <div className="connection-line line-horizontal-topleft" />
                    <div className="connection-line line-horizontal-bottomleft" />

                    {/* Cards */}
                    {cards.map(card => (
                        <AppCard
                            key={card.id}
                            id={card.id}
                            title={card.title}
                            icon={card.icon}
                            path={card.path}      // Pasa la ruta al componente AppCard
                            navigate={navigate}   // Pasa la función navigate al componente AppCard
                        />
                    ))}
                </div>

                <div className="university-logo">
                    <img src="logo-ult.png" alt="Universidad de las Tunas" />
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
