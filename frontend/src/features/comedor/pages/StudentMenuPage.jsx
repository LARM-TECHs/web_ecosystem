import { useEffect, useState } from "react";
import { apiService } from "../api/apiService";

function StudentMenu() {
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTodayMenu();
    }, []);

    const fetchTodayMenu = async () => {
        try {
            setLoading(true);
            const data = await apiService.getTodayMenu();
            setMenu(data);
        } catch (err) {
            setError('Error cargando el menú');
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Cargando menú...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    return (
        <div>
            <h2>Menú del Día</h2>
            {menu && (
                <div style={{
                    border: '1px solid #ddd',
                    padding: '20px',
                    borderRadius: '5px'
                }}>
                    <p><strong>Fecha:</strong> {menu.date}</p>
                    <div style={{ marginTop: '20px' }}>
                        <div style={{ marginBottom: '15px' }}>
                            <h3>🍳 Desayuno</h3>
                            <p style={{ marginLeft: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '3px' }}>
                                {menu.breakfast || 'No disponible'}
                            </p>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <h3>🍽️ Almuerzo</h3>
                            <p style={{ marginLeft: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '3px' }}>
                                {menu.lunch || 'No disponible'}
                            </p>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <h3>🌙 Cena</h3>
                            <p style={{ marginLeft: '20px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '3px' }}>
                                {menu.dinner || 'No disponible'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default StudentMenu;