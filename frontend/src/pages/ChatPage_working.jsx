import React, { useState, useEffect } from 'react';
import { sendMessage, /*getChatHistory, /*getChatList*/ } from '../services/api';

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

    return (
        <div className="chat-container">
            <div className="chat-list">
                {chatList.map((chat) => (
                    <button key={chat.id} onClick={() => handleSelectChat(chat.id)}>
                        Chat {chat.id}
                    </button>
                ))}
            </div>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
            <button onClick={handleNewChat}>New Chat</button>
        </div>
    );
};

export default Chat;