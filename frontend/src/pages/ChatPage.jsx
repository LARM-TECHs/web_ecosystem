import React, { useState, useEffect } from 'react';
import { sendMessage, /*getChatHistory, /*getChatList*/ logoutUser } from '../services/api';

import logo from '../assets/logo256x256.png'
import '../styles/ChatPage.css'

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [chatList, setChatList] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);

    useEffect(() => {
        // Fetch chat list when the component mounts
        const fetchChatList = async () => {
            try {
                const response = await getChatList();
                setChatList(response.chats);
            } catch (error) {
                console.error('Error fetching chat list:', error);
            }
        };

        fetchChatList();
    }, []);

    const fetchChatHistory = async (chatId) => {
        try {
            const response = await getChatHistory(chatId);
            setMessages(response.history.map(chat => ({
                text: chat.message,
                sender: 'user'
            })).concat(response.history.map(chat => ({
                text: chat.response,
                sender: 'bot'
            }))));
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim()) {
            const newMessage = { text: input, sender: 'user' };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setInput('');

            // Enviar el mensaje como un objeto con la clave 'message'
            const response = await sendMessage({ message: input });
            const botMessage = { text: response.choices[0].message.content, sender: 'bot' };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        }
    };

    const handleNewChat = () => {
        setMessages([]);
        setSelectedChatId(null);
    };

    const handleSelectChat = (chatId) => {
        setSelectedChatId(chatId);
        fetchChatHistory(chatId);
    };

    const handleLogout = async () => {
        try {
            await logoutUser(); // Llama a la función de logout
            localStorage.removeItem('user'); // Elimina los datos del usuario de localStorage
            // Redirigir a la página de login o mostrar un mensaje de éxito
            window.location.href = '/'; // Ajusta la URL según tu aplicación
        } catch (error) {
            console.error('Error al cerrar sesión:', error.message);
        }
    };

    const autoResize = (textarea) => {
        textarea.style.height = 'auto'; // Resetea la altura
        textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta la altura según el contenido
      };

    return (
        <>
            <div className='rootLayout'>
                <header>
                    <div className='logo'>
                        <img src='/icon.png' alt="Logo" />
                        <span>ULT CHAT</span>
                    </div>
                    <div className='user-profile'>
                        User
                        <button onClick={handleLogout} className="logout-button">Cerrar sesión</button> {/* Botón de logout */}
                    </div>
                </header>
            </div>

            <div className="chat-wrapper">
                <div className="chat-list">
                <button className='new-chat' onClick={handleNewChat}>Nuevo Chat</button> {/* Botón en la parte superior */}
                    <span className='title'>Chats recientes</span>
                    {chatList.map((chat) => (
                        <button key={chat.id} onClick={() => handleSelectChat(chat.id)}>
                            Chat {chat.id}
                        </button>
                    ))}
                </div>

                <div className="chat-container">
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.sender}`}> {/* className={msg.sender} */}
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    <div className="input-container">
                        <form onSubmit={handleSendMessage}>
                            <textarea
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onInput={(e) => autoResize(e.target)}
                                placeholder="Escribe algo..."
                                rows={1}
                            />
                            <button type="submit">
                                {/* Send */}
                                <img src="/arrow.png" alt="Enviar" />
                            </button>
                        </form>
                    </div>
                    
                </div>
                
            </div>
        </>
    );
};

export default Chat;