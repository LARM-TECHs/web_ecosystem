const API_URL = 'http://localhost:5000'; // Ajusta la URL si es necesario

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData; // Lanzar el error recibido
        }

        return await response.json(); // Retornar la respuesta en formato JSON
    } catch (error) {
        throw error; // Lanzar el error
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData; // Lanzar el error recibido
        }

        return await response.json(); // Retornar la respuesta en formato JSON
    } catch (error) {
        throw error; // Lanzar el error
    }
};

export const sendMessage = async (messageData) => {
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData; // Lanzar el error recibido
        }

        return await response.json(); // Retornar la respuesta en formato JSON
    } catch (error) {
        throw error; // Lanzar el error
    }
};

export const getChatHistory = async () => {
    try {
        const response = await fetch(`${API_URL}/chat/history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData; // Lanzar el error recibido
        }

        return await response.json(); // Retornar la respuesta en formato JSON
    } catch (error) {
        throw error; // Lanzar el error
    }
};
