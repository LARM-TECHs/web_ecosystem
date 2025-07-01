import React, { useState, useEffect } from 'react';
import './styles/RegisterPage.css'; // Importa el CSS para el registro
import logoHeaderIcon from '../assets/images/icon.png'; // Importa el logo del header

// Define the SVG icons as constants for reusability
const EmailIcon = () => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#287e30'>
        <path d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' />
    </svg>
);

const PasswordIcon = () => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#287e30'>
        <path d='M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z' />
    </svg>
);

const EyeOpenIcon = () => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#666'>
        <path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' />
    </svg>
);

const EyeClosedIcon = () => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#666'>
        <path d='M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z' />
    </svg>
);

const UserIcon = () => (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#287e30'>
        <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
    </svg>
);

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState(''); // For custom messages instead of alert

    // Handle password visibility toggle
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages

        // Basic validation
        if (!email || !password || !role) {
            setMessage('Por favor, completa todos los campos');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Por favor, ingresa un email válido');
            return;
        }

        setIsLoading(true);

        
    };

    // Handle register link click
    const handleRegisterClick = (e) => {
        e.preventDefault();
        setMessage('Funcionalidad de registro en desarrollo...');
        // window.location.href = 'register.html';
    };

    // Effect for circle animations on load
    useEffect(() => {
        const circles = document.querySelectorAll('.circle');
        circles.forEach((circle, index) => {
            setTimeout(() => {
                circle.style.opacity = '1';
            }, index * 200);
        });
    }, []); // Run once on component mount

    return (
        <div className="container">
            {/* Header */}
            <header className="header">
                <div className="header-logo">
                    <div className="leaf-icon">
                        <img src="logoheader.png" alt="Logo" className="logo-image" />
                    </div>
                </div>
                <h1 className="header-title">Ecosistema Universitario</h1>
            </header>

            {/* Main Content */}
            <main className="main-content">
                {/* Animated Circles */}
                <div className="circle circle-1"></div>
                <div className="circle circle-2"></div>
                <div className="circle circle-3"></div>
                <div className="circle circle-4"></div>
                <div className="circle circle-5"></div>

                {/* Login Card */}
                <div className="login-card">
                    <div className="login-header">
                        <div className="login-header-icon">
                            {/* Placeholder for icon image */}
                            <img src={logoHeaderIcon} alt="Icon" />
                        </div>
                        <h2 className="login-title">Bienvenido</h2>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div className="form-group">
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <EmailIcon />
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

                        {/* Password Input */}
                        <div className="form-group">
                            <div className="input-wrapper">
                                <div className="input-icon">
                                    <PasswordIcon />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                                </button>
                            </div>
                        </div>

                        {/* Role Select */}
                        <div className="form-group">
                            <div className="input-wrapper">
                                <div className="input-icon role-icon">
                                    <UserIcon />
                                </div>
                                <select
                                    className="form-select"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Selecciona tu rol</option>
                                    <option value="admin">Admin</option>
                                    <option value="estudiante">Estudiante</option>
                                    <option value="profesor">Profesor</option>
                                </select>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className={`login-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? '' : 'Ingresar'}
                        </button>

                        {/* Message Display */}
                        {message && (
                            <p className="message">{message}</p>
                        )}

                        {/* Register Link */}
                        <div className="register-link">
                            <a href="#" onClick={handleRegisterClick}>
                                ¿No tienes una cuenta? Crear una.
                            </a>
                        </div>
                    </form>
                </div>

                {/* University Logo */}
                <div className="university-logo">
                    <img src="logo-ult.png" alt="Universidad de las Tunas" />
                </div>
            </main>
        </div>
    );
};

export default RegisterPage;
