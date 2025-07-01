// src/components/AppCard.jsx
import React from 'react';
import './AppCard.css'; // Asegúrate de crear este archivo para los estilos de la tarjeta

/**
 * Componente AppCard reutilizable para el Dashboard.
 * Representa una tarjeta de aplicación con un título y un ícono, y es navegable.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.id - ID único de la tarjeta (usado como key).
 * @param {string} props.title - Título que se muestra en la tarjeta.
 * @param {string} props.icon - Ruta de la imagen del ícono.
 * @param {string} props.path - Ruta a la que se navegará al hacer clic en la tarjeta.
 * @param {function} props.navigate - Función `navigate` de react-router-dom para la redirección.
 */
const AppCard = ({ id, title, icon, path, navigate }) => {

    const handleClick = () => {
        if (navigate && path) {
            navigate(path); // Redirige a la ruta especificada
        } else {
            console.warn(`AppCard: No se puede navegar. navigate o path no definidos para la tarjeta ${id}.`);
        }
    };

    return (
        // La clase 'card' se usa para los estilos generales y animaciones de hover/click en CSS.
        <div className="card" onClick={handleClick} role="button" tabIndex="0">
            <div className="card-icon">
                {/* Asumiendo que 'icon' es una importación directa de imagen o una URL */}
                <img src={icon} alt={`${title} Icon`} />
            </div>
            <h3 className="card-title">{title}</h3>
        </div>
    );
};

export default AppCard;
