import React from 'react';
import './AppCard.css'; // Mueve aquí los estilos .card, .card-icon, .card-title, .card::before, .card:hover, etc.

const Card = ({ id, title, icon, onClick }) => (
    <div
        className="card"
        onClick={onClick || (() => window.location.hash = `#${id}`)}
    >
        <div className="card-icon">
            <img src={`${icon}`} alt={title} />
        </div>
        <div className="card-title">{title}</div>
    </div>
);

export default Card;