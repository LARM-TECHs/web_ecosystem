import axios from 'axios';

const API_GATEWAY_URL = 'http://localhost:4000'; // Asegúrate de que esto coincide con tu API Gateway

// Función auxiliar para obtener el token de autenticación
const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- Funciones para Menús (Menus) ---

/**
 * Crea o actualiza un menú diario.
 * @param {object} menuData - Datos del menú (date, breakfast, lunch, dinner).
 * @returns {Promise<object>} El menú creado/actualizado.
 */
export const createOrUpdateMenu = async (menuData) => {
    try {
        const response = await axios.post(`${API_GATEWAY_URL}/comedor/menus`, menuData, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error en createOrUpdateMenu:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error al guardar el menú.');
    }
};

/**
 * Obtiene el menú del día actual.
 * @returns {Promise<object>} El menú del día.
 */
export const getTodayMenu = async () => {
    try {
        const response = await axios.get(`${API_GATEWAY_URL}/comedor/menus/today`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error en getTodayMenu:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error al obtener el menú de hoy.');
    }
};

/**
 * Obtiene todos los menús.
 * @returns {Promise<Array<object>>} Lista de menús.
 */
export const getAllMenus = async () => {
    try {
        const response = await axios.get(`${API_GATEWAY_URL}/comedor/menus`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error en getAllMenus:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error al obtener todos los menús.');
    }
};

/**
 * Elimina un menú por su fecha.
 * @param {string} date - Fecha del menú en formato YYYY-MM-DD.
 * @returns {Promise<void>}
 */
export const deleteMenu = async (date) => {
    try {
        await axios.delete(`${API_GATEWAY_URL}/comedor/menus/${date}`, {
            headers: getAuthHeaders()
        });
    } catch (error) {
        console.error('Error en deleteMenu:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error al eliminar el menú.');
    }
};

// --- Funciones para Estudiantes del Comedor (StudentComedor) ---

/**
 * Registra un estudiante en el sistema del comedor.
 * @param {object} studentData - Datos del estudiante (student_id, name, email, user_id).
 * @returns {Promise<object>} El estudiante registrado.
 */
export const registerStudentComedor = async (studentData) => {
    try {
        const response = await axios.post(`${API_GATEWAY_URL}/comedor/students-comedor`, studentData, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error en registerStudentComedor:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error al registrar estudiante en comedor.');
    }
};

/**
 * Obtiene el perfil del estudiante del comedor del usuario actualmente autenticado.
 * @returns {Promise<object>} El perfil del estudiante del comedor.
 */
export const getMyStudentComedorProfile = async () => {
    try {
        const response = await axios.get(`${API_GATEWAY_URL}/comedor/students-comedor/me`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error en getMyStudentComedorProfile:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error al obtener perfil del estudiante del comedor.');
    }
};

/**
 * Obtiene la lista de todos los estudiantes registrados en el comedor.
 * @returns {Promise<Array<object>>} Lista de estudiantes.
 */
export const getAllStudentsComedor = async () => {
    try {
        const response = await axios.get(`${API_GATEWAY_URL}/comedor/students-comedor`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error en getAllStudentsComedor:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error al obtener la lista de estudiantes del comedor.');
    }
};


// --- Funciones para Códigos QR (QRCode) ---

/**
 * Genera o recupera un código QR para un estudiante para el menú del día actual.
 * Requiere el ID interno del estudiante del comedor.
 * @param {string} studentComedorId - El ID interno del estudiante del comedor (no el student_id externo).
 * @returns {Promise<object>} Objeto con qrCode (Data URL) y metadatos.
 */
export const generateStudentQR = async (studentComedorId) => {
    try {
        const response = await axios.get(`${API_GATEWAY_URL}/comedor/qrcodes/students/${studentComedorId}/qr`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error en generateStudentQR:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error al generar el código QR. Verifica tu ID de estudiante.');
    }
};

/**
 * Permite al personal del comedor validar un código QR.
 * @param {string} qrData - La cadena de datos incrustada en el código QR.
 * @returns {Promise<object>} Resultado de la validación (válido/inválido) y detalles.
 */
export const validateQrCode = async (qrData) => {
    try {
        const response = await axios.post(`${API_GATEWAY_URL}/comedor/staff-comedor/validate-qr`, { qrData }, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error en validateQrCode:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error al validar el código QR.');
    }
};

/**
 * Obtiene el historial de uso de códigos QR.
 * @param {object} filters - Objeto con filtros opcionales (date, studentComedorId, used).
 * @returns {Promise<Array<object>>} Lista de registros de QR.
 */
export const getQrHistory = async (filters = {}) => {
    try {
        const params = new URLSearchParams(filters).toString();
        const response = await axios.get(`${API_GATEWAY_URL}/comedor/staff-comedor/qr-history?${params}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error en getQrHistory:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Error al obtener el historial de QR.');
    }
};

// Puedes añadir funciones para gestionar el Staff si es necesario
// export const registerStaffComedor = async (staffData) => { ... };
// export const getAllStaffComedor = async () => { ... };
