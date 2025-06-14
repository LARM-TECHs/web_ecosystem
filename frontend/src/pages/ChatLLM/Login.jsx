import React, { useEffect, useState } from 'react';
import { loginUser } from '../../services/api';
import '../../styles/nstyles.css';
import { useNavigate } from 'react-router-dom'; // Necesario para redirigir

const LoginNew = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook para redirigir

    // useEffect(() => {
        // Verificar si el usuario ya está autenticado
    //     const user = localStorage.getItem('user');
    //     if (user) {
    //         navigate('/chat'); // Redirigir al chat si ya está autenticado
    //     }
    // }, [navigate]); // Ejecutar solo una vez al cargar el componente

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const data = await loginUser({ email, password }); // Enviar email y password
            console.log('Respuesta del servidor:', data);

            const userName = data.message ? data.message.split(', ')[1]?.slice(0, -1) : 'Usuario';
            localStorage.setItem('user', JSON.stringify({
                id: data.user_id,
                name: userName,
            }));

            if (data.redirect) {
                navigate(data.redirect); // Usar navigate para redirigir
            } else {
                alert(data.message); // Mostrar mensaje de bienvenida si no hay redirección
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error.message);
            setError(error.message);
        }
    };

    return (
        <section className="login-container">
            <div className="form-contenedor">
                <div className="circle-1"></div>
                <div className="circle-2"></div>
                <div className="circle-3"></div>
                <div className="circle-4"></div>
                <div className="box">
                    <h2>Inicio de Sesión</h2>
                    <form onSubmit={handleLogin}>
                        <div className="input-box">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="datosingreso"
                            />
                        </div>
                        <div className="input-box">
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="datosingreso"
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="btn-ingreso">Ingresar</button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default LoginNew;
