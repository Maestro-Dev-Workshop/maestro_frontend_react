// src/features/lesson/ChatbotSidebar.jsx
import React, { useEffect, useState } from 'react';
import { getChatHistory, sendChatMessage } from './lessonService';

const ChatbotSidebar = ({ sessionId, metadata = {} }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch chat history on load
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const res = await getChatHistory(sessionId);
                if (res?.messages) setMessages(res.messages);
            } catch (err) {
                console.error('Failed to load chat history');
            }
        };
        fetchChatHistory();
    }, [sessionId]);

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            const response = await sendChatMessage(sessionId, input, metadata);
            const botMessage = { role: 'bot', content: response.message };
            setMessages((prev) => [...prev, botMessage]);
        } catch (err) {
            const errorMessage = { role: 'bot', content: 'Failed to get a response.' };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setInput('');
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '10px' }}>
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            marginBottom: '10px',
                            textAlign: msg.role === 'user' ? 'right' : 'left',
                        }}
                    >
                        <div
                            style={{
                                display: 'inline-block',
                                padding: '10px',
                                borderRadius: '10px',
                                backgroundColor: msg.role === 'user' ? '#d1e7dd' : '#f8d7da',
                                maxWidth: '80%',
                            }}
                        >
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Ask the bot..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{ width: '100%', padding: '10px', marginBottom: '5px' }}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={loading || !input.trim()}
                    style={{ width: '100%', padding: '10px' }}
                >
                    {loading ? 'Sending...' : 'Send'}
                </button>
            </div>
        </div>
    );
};

export default ChatbotSidebar;
