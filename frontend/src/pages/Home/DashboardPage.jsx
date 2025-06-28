import React, { useEffect } from 'react';
import './DashboardPage.css'; // Mover todo el CSS aquí
import Header from '../../components/Header/Header';
import Card from './components/AppCard';

const DashboardPage = () => {
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

        // Hover y click en cards
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
            card.addEventListener('click', () => {
                card.style.transform = 'translateY(-2px) scale(0.98)';
                setTimeout(() => card.style.transform = 'translateY(-8px) scale(1.02)', 150);
            });
        });
    }, []);

    const cards = [
        { id: 'gestion', title: 'Gestión U.', icon: 'gestion1.png' },
        { id: 'biblioteca', title: 'Biblioteca', icon: 'biblioteca.png' },
        { id: 'chat', title: 'Chat IA', icon: 'chatai.png' },
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
                        <Card
                            key={card.id}
                            id={card.id}
                            title={card.title}
                            icon={card.icon}
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
