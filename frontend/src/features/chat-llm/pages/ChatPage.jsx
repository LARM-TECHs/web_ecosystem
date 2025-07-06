import React, { useState, useEffect, useRef } from 'react';
import { getConversations, getConversationMessages, streamChat } from '../../../api/chatLlm.js';
import Header from '../../../components/Header/Header.jsx';
import './ChatPage.css';
import sendArrowIcon from '../../../assets/icons/arrow.png';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);
    const streamControllerRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Cargar lista de conversaciones inicial
    const fetchConversations = async () => {
        setLoadingConversations(true);
        setError(null);
        try {
            const data = await getConversations();
            setConversations(data || []);
        } catch (err) {
            setError(`Error al cargar conversaciones: ${err.message}`);
        } finally {
            setLoadingConversations(false);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    // Scroll al final cuando los mensajes cambian
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Limpiar el stream si el componente se desmonta
    useEffect(() => {
        return () => {
            streamControllerRef.current?.abort();
        };
    }, []);

    const handleSelectConversation = async (conversationId) => {
        if (isStreaming) streamControllerRef.current?.abort();
        setIsStreaming(false);

        setSelectedConversationId(conversationId);
        setLoadingMessages(true);
        setError(null);
        try {
            const messagesData = await getConversationMessages(conversationId);
            // Mapear el formato de la BD al formato del estado de la UI
            const formattedMessages = messagesData.map(msg => ({
                text: msg.content,
                sender: msg.role
            }));
            setMessages(formattedMessages);
        } catch (err) {
            setError(`Error al cargar mensajes: ${err.message}`);
            setMessages([]);
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isStreaming) return;

        const userMessage = { text: input.trim(), sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsStreaming(true);
        setError(null);

        // Añadir un placeholder para la respuesta del bot
        setMessages(prev => [...prev, { text: '', sender: 'assistant', streaming: true }]);

        const payload = {
            message: userMessage.text,
            conversationId: selectedConversationId
        };

        streamControllerRef.current = streamChat(payload, {
            onOpen: () => console.log("Conexión de stream abierta."),
            onMessage: (data) => {
                if (data.type === 'id') {
                    setSelectedConversationId(data.conversationId);
                } else if (data.type === 'chunk' && data.content) {
                    setMessages(prev => {
                        const lastMsg = prev[prev.length - 1];
                        if (lastMsg?.sender === 'assistant') {
                            lastMsg.text += data.content;
                            return [...prev.slice(0, -1), lastMsg];
                        }
                        return prev;
                    });
                }
            },
            onError: (err) => {
                setError(`Error de stream: ${err.message}`);
                setIsStreaming(false);
            },
            onClose: () => {
                setIsStreaming(false);
                // Marcar el mensaje como completo
                setMessages(prev => prev.map(msg => ({ ...msg, streaming: false })));
                // Actualizar la lista de conversaciones para reflejar el nuevo título o fecha
                fetchConversations();
            }
        });
    };

    const handleNewChat = () => {
        if (isStreaming) streamControllerRef.current?.abort();
        setIsStreaming(false);
        setSelectedConversationId(null);
        setMessages([]);
        setError(null);
        setInput('');
    };

    const autoResize = (textarea) => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    return (
        <div className='chat-page-layout'>
            <Header />
            <div className="chat-wrapper">
                <aside className="chat-list-sidebar">
                    <button className='new-chat-button' onClick={handleNewChat}>+ Nueva Conversación</button>
                    <div className="chat-list-title">Conversaciones</div>
                    {loadingConversations ? <div className="loading-indicator">Cargando...</div> :
                        conversations.length > 0 ? (
                            conversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    className={`chat-item ${selectedConversationId === conv.id ? 'selected' : ''}`}
                                    onClick={() => handleSelectConversation(conv.id)}
                                >
                                    {conv.title}
                                </button>
                            ))
                        ) : (
                            <div className="no-chats-message">No hay conversaciones.</div>
                        )}
                    {error && <div className="chat-list-error-message">{error}</div>}
                </aside>

                <section className="chat-main-content">
                    <div className="chat-messages-container">
                        {loadingMessages ? <div className="loading-indicator">Cargando mensajes...</div> :
                            messages.length > 0 ? (
                                messages.map((msg, index) => (
                                    <div key={index} className={`message-bubble ${msg.sender}`}>
                                        <div className="message-text">{msg.text}</div>
                                        {msg.streaming && <span className="blinking-cursor"></span>}
                                    </div>
                                ))
                            ) : (
                                <div className="no-messages-placeholder">
                                    Selecciona una conversación o empieza una nueva.
                                </div>
                            )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input-form" onSubmit={handleSendMessage}>
                        <textarea
                            className="chat-input-textarea"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onInput={(e) => autoResize(e.target)}
                            placeholder={isStreaming ? "Generando respuesta..." : "Escribe tu mensaje aquí..."}
                            rows={1}
                            disabled={isStreaming || loadingMessages}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                        />
                        <button type="submit" className="send-button" disabled={isStreaming || loadingMessages}>
                            {isStreaming ? <span className="spinner"></span> : <img src={sendArrowIcon} alt="Enviar" />}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default ChatPage;
