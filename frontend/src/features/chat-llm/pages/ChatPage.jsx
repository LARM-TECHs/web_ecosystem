// src/features/chat-llm/pages/ChatPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Para la redirección al logout
import { getChatList, getChatHistory, sendMessage } from '../../../api/chatLlm.js'; // Importa las funciones API
import Header from '../../../components/Header/Header.jsx'; // Ruta actualizada al Header global
import './ChatPage.css'; // Asegúrate de que esta ruta sea correcta para tu CSS de ChatPage

// Importa las imágenes directamente
// import appLogo from '../../../assets/images/logo256x256.png'; // Ruta ajustada
// import headerLogo from '../../../assets/images/logoheader.png'; // Si usas el mismo logo en el header
import sendArrowIcon from '../../../assets/icons/arrow.png'; // Asumiendo que 'arrow.png' es el icono de enviar
// import defaultUserIcon from '../../../assets/icons/user.png'; // Icono de usuario por defecto si no hay foto

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [chatList, setChatList] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [loadingChats, setLoadingChats] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [error, setError] = useState(null); // Para mostrar errores al usuario
    const messagesEndRef = useRef(null); // Para scroll automático al final de los mensajes

    const navigate = useNavigate(); // Hook para navegación

    // Obtener información del usuario del localStorage
    const userName = localStorage.getItem('userEmail') || 'Usuario'; // Usar email o un nombre por defecto
    const userRole = localStorage.getItem('userRole'); // Obtener el rol del usuario

    // Función para desplazarse al final de los mensajes
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Efecto para cargar la lista de chats al montar el componente
    useEffect(() => {
        const fetchChats = async () => {
            setLoadingChats(true);
            setError(null);
            try {
                const data = await getChatList();
                setChatList(data.chats || []);
                // Si hay chats y no hay uno seleccionado, seleccionar el primero
                if (data.chats && data.chats.length > 0 && !selectedChatId) {
                    setSelectedChatId(data.chats[0].id);
                    await fetchChatHistory(data.chats[0].id);
                }
            } catch (err) {
                setError(`Error al cargar los chats: ${err.message}`);
                console.error(err);
            } finally {
                setLoadingChats(false);
            }
        };

        fetchChats();
    }, []); // Se ejecuta solo una vez al montar el componente

    // Efecto para cargar el historial de chat cuando cambia el chat seleccionado
    const fetchChatHistory = async (chatId) => {
        setLoadingHistory(true);
        setError(null);
        try {
            // const data = await getChatHistory(chatId);
            // // Mapear la historia a un formato de mensajes de UI
            // const formattedMessages = data.history.flatMap(entry => [
            //     { text: entry.message, sender: 'user' },
            //     { text: entry.response, sender: 'bot' }
            // ]);
            const { message, response } = await getChatHistory(chatId);
            // Ponemos siempre primero el mensaje del usuario y luego la respuesta del bot
            const formattedMessages = [
                { text: message, sender: 'user' },
                { text: response, sender: 'bot' }
            ];
            setMessages(formattedMessages);
        } catch (err) {
            setError(`Error al cargar el historial del chat: ${err.message}`);
            console.error(err);
        } finally {
            setLoadingHistory(false);
            scrollToBottom(); // Desplazarse al final después de cargar
        }
    };

    // Efecto para desplazar al final cuando los mensajes cambian
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { text: input.trim(), sender: 'user' };
        // Añadir el mensaje del usuario inmediatamente
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInput(''); // Limpiar el input

        setSendingMessage(true);
        setError(null);

        try {
            // La API de ChatLLM espera un objeto con la clave 'message'
            // const response = await sendMessage({ message: userMessage.text, chatId: selectedChatId });
            // // Asumiendo que la respuesta del LLM viene en response.answer (ajustar según tu backend)
            // const botMessageText = response.answer || 'No se recibió respuesta.';
            // const botMessage = { text: botMessageText, sender: 'bot' };
            // Enviamos el mensaje y recibimos la respuesta del backend
            const data = await sendMessage({ message: userMessage.text, chatId: selectedChatId });

            // Extraemos el contenido del primer choice
            const choice = data.choices && data.choices[0];
            const botMessageText = choice?.message?.content
                ?? 'No se recibió respuesta del LLM.';
            const botMessage = { text: botMessageText, sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, botMessage]);

            // Actualizar la lista de chats si es un nuevo chat o el primero
            if (!selectedChatId) {
                // Si el backend devuelve el ID del nuevo chat, úsalo
                setSelectedChatId(response.chatId || null);
                // Vuelve a cargar la lista de chats para incluir el nuevo si es necesario
                const updatedChatList = await getChatList();
                setChatList(updatedChatList.chats || []);
            }
        } catch (err) {
            setError(`Error al enviar mensaje: ${err.message}`);
            console.error(err);
            // Si hay un error, puedes añadir un mensaje de bot que indique el error
            setMessages((prevMessages) => [...prevMessages, { text: `Error: ${err.message}`, sender: 'bot error' }]);
        } finally {
            setSendingMessage(false);
            scrollToBottom();
        }
    };

    const handleNewChat = () => {
        setMessages([]);
        setSelectedChatId(null);
        setError(null); // Limpiar errores al iniciar nuevo chat
        // Opcional: Podrías llamar a una API para "crear" un nuevo chat vacío aquí si tu backend lo requiere
    };

    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);
        fetchChatHistory(chatId);
    };

    // Función para auto-redimensionar el textarea
    const autoResize = (textarea) => {
        textarea.style.height = 'auto'; // Resetea la altura
        textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta la altura según el contenido
    };

    return (
        <div className='chat-page-layout'> {/* Cambiado de rootLayout para mayor especificidad */}
            {/* Componente Header */}
            <Header />

            <div className="chat-wrapper">
                <aside className="chat-list-sidebar">
                    <button className='new-chat-button' onClick={handleNewChat}>+ Nuevo Chat</button>
                    <div className="chat-list-title">Chats Recientes</div>
                    {loadingChats ? (
                        <div className="loading-indicator">Cargando chats...</div>
                    ) : (
                        chatList.length > 0 ? (
                            chatList.map((chat) => (
                                <button
                                    key={chat.id}
                                    className={`chat-item ${selectedChatId === chat.id ? 'selected' : ''}`}
                                    onClick={() => handleSelectChat(chat.id)}
                                >
                                    Chat {chat.id} {/* Podrías mostrar el primer mensaje o un título */}
                                </button>
                            ))
                        ) : (
                            <div className="no-chats-message">No hay chats aún. ¡Empieza uno nuevo!</div>
                        )
                    )}
                    {error && <div className="chat-list-error-message">{error}</div>}
                </aside>

                <section className="chat-main-content">
                    <div className="chat-messages-container">
                        {loadingHistory ? (
                            <div className="loading-indicator">Cargando historial...</div>
                        ) : (
                            messages.length > 0 ? (
                                messages.map((msg, index) => (
                                    <div key={index} className={`message-bubble ${msg.sender}`}>
                                        <div className="message-text">{msg.text}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-messages-placeholder">
                                    ¡Bienvenido al Chat LLM! Escribe tu primer mensaje.
                                </div>
                            )
                        )}
                        <div ref={messagesEndRef} /> {/* Elemento para scroll automático */}
                    </div>

                    <form className="chat-input-form" onSubmit={handleSendMessage}>
                        <textarea
                            className="chat-input-textarea"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onInput={(e) => autoResize(e.target)}
                            placeholder={sendingMessage ? "Enviando..." : "Escribe tu mensaje aquí..."}
                            rows={1}
                            disabled={sendingMessage}
                        />
                        <button type="submit" className="send-button" disabled={sendingMessage}>
                            {sendingMessage ? (
                                <span className="spinner"></span> // Un spinner CSS simple
                            ) : (
                                <img src={sendArrowIcon} alt="Enviar" />
                            )}
                        </button>
                    </form>
                </section>
            </div>

            {/* Este div de 'user-profile' y el botón de logout estaban en el Header,
                pero los hemos movido al Header globalmente para mejor organización.
                Si quieres un profile específico para esta página, lo añadirías aquí. */}
            {/* <div className='user-profile'>
                <span>{userName} ({userRole})</span>
                <button onClick={handleLogout} className="logout-button">Cerrar sesión</button>
            </div> */}
        </div>
    );
};

export default ChatPage;
