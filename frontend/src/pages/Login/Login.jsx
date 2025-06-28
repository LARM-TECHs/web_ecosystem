import React, { useState, useEffect } from 'react';
import './Login.css'; // Aquí debes mover todo el CSS del <style> en un archivo .css

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert('Por favor, completa todos los campos');
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            console.log('Login attempt:', { email, password });
            alert('Login exitoso! (Demo)');
            // window.location.href = 'dashboard.html';
        }, 2000);
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
                            Ingresar
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
