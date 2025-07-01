// src/api/auth.js
import axios from 'axios';

// La URL base de tu API Gateway
const API_GATEWAY_URL = 'http://localhost:4000'; // Asegúrate de que esto coincide con el puerto de tu API Gateway

/**
 * Función para realizar la llamada de login a la API Gateway.
 * @param {string} email - El correo electrónico del usuario.
 * @param {string} password - La contraseña del usuario.
 * @returns {Promise<object>} Un objeto con el token JWT y la información del usuario en caso de éxito.
 * @throws {Error} Si la autenticación falla o hay un error de red.
 */
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_GATEWAY_URL}/auth/login`, {
            correo: email, // El backend espera 'correo', no 'email'
            contraseña: password // El backend espera 'contraseña', no 'password'
        });

        // La respuesta exitosa debería contener el token y los datos del usuario
        // Ejemplo de response.data: { token: "...", usuario: { id_usuario: 1, correo: "...", rol: "..." } }
        return response.data;
    } catch (error) {
        // Manejo de errores de la API (ej. 401 Unauthorized, 400 Bad Request)
        if (error.response) {
            // El servidor respondió con un código de estado fuera del rango 2xx
            console.error('Error de login (respuesta del servidor):', error.response.data);
            throw new Error(error.response.data.message || 'Credenciales inválidas.');
        } else if (error.request) {
            // La solicitud fue hecha pero no se recibió respuesta
            console.error('Error de login (sin respuesta del servidor):', error.request);
            throw new Error('No se pudo conectar con el servidor de autenticación. Inténtalo de nuevo más tarde.');
        } else {
            // Algo más causó el error
            console.error('Error de login (Axios):', error.message);
            throw new Error('Ocurrió un error inesperado durante el login.');
        }
    }
};


/**
 * Función para registrar un nuevo usuario en la API Gateway.
 * @param {string} nombre - El nombre del usuario.
 * @param {string} correo - El correo electrónico del usuario.
 * @param {string} contraseña - La contraseña del usuario.
 * @param {string} rol - El rol del usuario (ej. 'estudiante', 'profesor', 'admin').
 * @returns {Promise<object>} Un objeto con la información del usuario registrado en caso de éxito.
 * @throws {Error} Si el registro falla o hay un error de red.
 */
export const register = async (nombre, correo, contraseña, rol) => {
    try {
        const response = await axios.post(`${API_GATEWAY_URL}/auth/register`, {
            // nombre,
            correo,
            contraseña,
            rol
        });
        // La respuesta exitosa debería contener los datos del usuario registrado
        // Ejemplo de response.data: { message: "Usuario registrado exitosamente", usuario: { id_usuario: 1, nombre: "...", correo: "...", rol: "..." } }
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Error de registro (respuesta del servidor):', error.response.data);
            throw new Error(error.response.data.message || 'Error al registrar el usuario.');
        } else if (error.request) {
            console.error('Error de registro (sin respuesta del servidor):', error.request);
            throw new Error('No se pudo conectar con el servidor de autenticación para el registro. Inténtalo de nuevo más tarde.');
        } else {
            console.error('Error de registro (Axios):', error.message);
            throw new Error('Ocurrió un error inesperado durante el registro.');
        }
    }
};


/**
 * Función para cerrar sesión. No es una llamada a la API, sino una limpieza local.
 * Se incluye aquí para completar el contexto del logout en el frontend.
 * @returns {void}
 */
export const logoutUser = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    // Puedes limpiar más datos de sesión si los almacenas
};


// Puedes añadir otras funciones de autenticación aquí, como registro o obtener perfil.
// export const register = async (name, email, password) => { ... };
// export const getProfile = async (token) => { ... };
