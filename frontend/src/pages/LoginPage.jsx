import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para la redirección
import { login } from '../api/auth.js'; // Importa la función de login
import './styles/LoginPage.css'; // Aquí debes mover todo el CSS del <style> en un archivo .css

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Estado para mostrar mensajes de error
    const [successMessage, setSuccessMessage] = useState(''); // Estado para mostrar mensajes de éxito

    const navigate = useNavigate(); // Hook para la navegación programática

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Limpiar mensajes de error anteriores
        setSuccessMessage(''); // Limpiar mensajes de éxito anteriores

        if (!email || !password) {
            setErrorMessage('Por favor, completa todos los campos.');
            return;
        }

        setLoading(true); // Activar estado de carga

        try {
            // Llama a la función de login de tu API
            const data = await login(email, password);
            setSuccessMessage('¡Login exitoso! Redirigiendo...');
            console.log('Login exitoso:', data);

            // Almacenar el token y la información del usuario
            localStorage.setItem('authToken', data.token);
            // Si necesitas el rol o ID del usuario a nivel global, puedes almacenarlo también
            localStorage.setItem('userRole', data.usuario.rol);
            localStorage.setItem('userId', data.usuario.id_usuario);
            localStorage.setItem('userEmail', data.usuario.correo);

            // Redirigir al usuario basado en su rol o a una página por defecto
            // Implementa tu lógica de redirección aquí
            setTimeout(() => {
                // Ejemplo de redirección: si es admin al dashboard, si es estudiante a su página
                if (data.usuario.rol === 'admin') {
                    navigate('/dashboard/admin'); // O la ruta que definas para administradores
                } else if (data.usuario.rol === 'estudiante') {
                    navigate('/dashboard'); // O la ruta para estudiantes
                } else if (data.usuario.rol === 'staff' || data.usuario.rol === 'staff_comedor' || data.usuario.rol === 'profesor') {
                    // Asumiendo que 'staff_comedor' y 'profesor' son como 'staff' para fines de dashboard
                    navigate('/dashboard/staff'); // O la ruta para staff
                }
                else {
                    navigate('/home'); // Ruta por defecto
                }
            }, 1000); // Pequeño retraso para que el usuario vea el mensaje de éxito

        } catch (error) {
            console.error('Error en el login:', error.message);
            setErrorMessage(error.message); // Muestra el mensaje de error de la API
        } finally {
            setLoading(false); // Desactivar estado de carga
        }
    };

    useEffect(() => {
        const circles = document.querySelectorAll('.circle');
        circles.forEach((circle, index) => {
            setTimeout(() => {
                circle.style.opacity = '1';
            }, index * 200);
        });
    }, []);

    return (
        <div className="body-wrapper">
            <header className="header">
                <div className="header-logo">
                    <div className="leaf-icon">
                        <img src="logoheader.png" alt="Logo" className="logo-image" />
                    </div>
                </div>
                <h1 className="header-title">Ecosistema Universitario</h1>
            </header>

            <main className="main-content">
                <div className="circle circle-1" />
                <div className="circle circle-2" />
                <div className="circle circle-3" />
                <div className="circle circle-4" />
                <div className="circle circle-5" />

                <div className="login-card">
                    <div className="login-header">
                        <div className="login-header-icon">
                            <img src="logo.png" alt="Logo" className="logo-image" />
                        </div>
                        <h2 className="login-title">Bienvenido</h2>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        {successMessage && <p className="success-message">{successMessage}</p>}
                        <div className="form-group">
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <img src="e-mail.png" alt="" />
                                </div>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <img
                                        src="lock.png"
                                        alt=""
                                    />
                                </div>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`login-button ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </button>
                    </form>
                </div>

                <div className="university-logo">
                    <img src="logo-ult.png" alt="Universidad de las Tunas" />
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
