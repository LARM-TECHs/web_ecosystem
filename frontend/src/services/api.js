const API_URL = 'http://localhost:3000'; // Ajusta la URL si es necesario

export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include credentials in the request
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
            credentials: 'include', // Include credentials in the request
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


// export const loginUser = async (email, password) => {
//     const response = await fetch(`${API_URL}/login?next=/chat`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//         credentials: 'include', // Asegúrate de incluir las credenciales
//     });

//     const data = await response.json();

//     if (response.ok) {
//         // Redirige al usuario a la URL proporcionada en la respuesta
//         window.location.href = data.redirect;
//     } else {
//         alert(data.message); // Muestra un mensaje de error
//     }
// };


export const sendMessage = async (messageData) => {
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include credentials in the request
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

// Obtener la lista de chats
export const getChatList = async () => {
    try {
        const response = await fetch(`${API_URL}/chats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include credentials in the request
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching chat list:', error);
        throw error;
    }
};

// Obtener el historial de un chat específico
export const getChatHistory = async (chatId) => {
    try {
        const response = await fetch(`${API_URL}/chats/${chatId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include credentials in the request
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching chat history for chat ID ${chatId}:`, error);
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'GET', // Usualmente se usa POST para cerrar sesión
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Incluir credenciales en la solicitud
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
