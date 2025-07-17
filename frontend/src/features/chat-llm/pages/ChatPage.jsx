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

    // ————— Char‑by‑char queue + pump —————
    const wordQueueRef = useRef([]);      // cola de caracteres
    const pumpIntervalRef = useRef(null); // intervalo de bombeo

    const startWordPump = () => {
        if (pumpIntervalRef.current) return;
        pumpIntervalRef.current = setInterval(() => {
            if (wordQueueRef.current.length === 0) {
                clearInterval(pumpIntervalRef.current);
                pumpIntervalRef.current = null;
                console.log('La cola está vacía, paro el pump');
                return;
            }
            const nextChar = wordQueueRef.current.shift();
            console.log('🚀 Dispatch char:', JSON.stringify(nextChar), '| Quedan:', wordQueueRef.current.length);

            setMessages(prev =>
                prev.map((msg, i) =>
                    i === prev.length - 1
                        ? { ...msg, text: msg.text + nextChar }
                        : msg
                )
            );
        }, 100); // 100 ms por carácter
    };

    const stopWordPump = () => {
        if (pumpIntervalRef.current) {
            clearInterval(pumpIntervalRef.current);
            pumpIntervalRef.current = null;
        }
        wordQueueRef.current = [];
        console.log('Pump detenido y cola limpiada');
    };
    // —————————————————————————————

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        setLoadingConversations(true);
        setError(null);
        try {
            const data = await getConversations();
            setConversations(data || []);
            return data || [];
        } catch (err) {
            setError(`Error al cargar conversaciones: ${err.message}`);
            return [];
        } finally {
            setLoadingConversations(false);
        }
    };

    useEffect(() => { fetchConversations(); }, []);
    useEffect(() => { scrollToBottom(); }, [messages]);
    useEffect(() => {
        return () => {
            streamControllerRef.current?.abort();
            stopWordPump();
        };
    }, []);

    const handleSelectConversation = async (conversationId) => {
        if (isStreaming) {
            streamControllerRef.current?.abort();
            stopWordPump();
        }
        setIsStreaming(false);
        setSelectedConversationId(conversationId);
        setLoadingMessages(true);
        setError(null);
        try {
            const messagesData = await getConversationMessages(conversationId);
            const formatted = messagesData.map(msg => ({
                text: msg.content,
                sender: msg.role === 'user' ? 'user' : 'assistant'
            }));
            setMessages(formatted);
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
        const isNewChat = !selectedConversationId;

        if (isNewChat) {
            setMessages([userMessage]);
        } else {
            setMessages(prev => [...prev, userMessage]);
        }

        setInput('');
        setIsStreaming(true);
        setError(null);

        // placeholder y reiniciar cola
        setMessages(prev => [...prev, { text: '', sender: 'assistant', streaming: true }]);
        wordQueueRef.current = [];

        const payload = {
            message: userMessage.text,
            conversationId: selectedConversationId,
        };

        streamControllerRef.current = streamChat(payload, {
            onOpen: () => console.log("Stream abierto."),
            onMessage: (data) => {
                if (data.type === 'id') {
                    console.log('Conversación nueva, id:', data.conversationId);
                    setSelectedConversationId(data.conversationId);
                } else if (data.type === 'chunk' && data.content) {
                    console.log('Chunk recibido del LLM:', data.content);
                    // encolar char‑by‑char
                    wordQueueRef.current.push(...data.content.split(''));
                    startWordPump();
                }
            },
            onError: (err) => {
                setError(`Error de stream: ${err.message}`);
                setIsStreaming(false);
                stopWordPump();
            },
            onClose: async () => {
                setIsStreaming(false);
                stopWordPump();
                setMessages(prev => prev.map(msg => ({ ...msg, streaming: false })));
                await fetchConversations();
            }
        });
    };

    const handleNewChat = () => {
        if (isStreaming) {
            streamControllerRef.current?.abort();
            stopWordPump();
        }
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
                    {loadingConversations
                        ? <div className="loading-indicator">Cargando...</div>
                        : conversations.length > 0
                            ? conversations.map(conv => (
                                <button
                                    key={conv.id}
                                    className={`chat-item ${selectedConversationId === conv.id ? 'selected' : ''}`}
                                    onClick={() => handleSelectConversation(conv.id)}
                                >
                                    {conv.title}
                                </button>
                            ))
                            : <div className="no-chats-message">No hay conversaciones.</div>
                    }
                    {error && <div className="chat-list-error-message">{error}</div>}
                </aside>
                <section className="chat-main-content">
                    <div className="chat-messages-container">
                        {loadingMessages
                            ? <div className="loading-indicator">Cargando mensajes...</div>
                            : messages.length > 0
                                ? messages.map((msg, i) => (
                                    <div key={i} className={`message-bubble ${msg.sender}`}>
                                        <div className="message-text">{msg.text}</div>
                                        {msg.streaming && <span className="blinking-cursor"></span>}
                                    </div>
                                ))
                                : <div className="no-messages-placeholder">
                                    Selecciona una conversación o empieza una nueva.
                                </div>
                        }
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chat-input-form" onSubmit={handleSendMessage}>
                        <textarea
                            className="chat-input-textarea"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onInput={e => autoResize(e.target)}
                            placeholder={isStreaming ? "Generando respuesta..." : "Escribe tu mensaje aquí..."}
                            rows={1}
                            disabled={isStreaming || loadingMessages}
                            onKeyDown={e => {
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
