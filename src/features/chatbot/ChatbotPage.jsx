import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getChatHistory, sendMessage } from '../../services/chatbotService.js';

export default function ChatbotPage() {
  const { sessionId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getChatHistory(sessionId);
        setMessages(res.data);
      } catch {
        console.error('Failed to load chat history');
      }
    };
    fetchHistory();
  }, [sessionId]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', message: input, time: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    try {
      const res = await sendMessage(sessionId, input);
      const botMessage = { sender: 'bot', message: res.data.response, time: new Date().toISOString() };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      console.error('Message failed');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xl px-4 py-2 rounded-lg ${
              msg.sender === 'user'
                ? 'bg-blue-500 text-white self-end ml-auto'
                : 'bg-white text-gray-800 self-start mr-auto'
            }`}
          >
            <p>{msg.message}</p>
            <small className="block text-xs text-gray-400 mt-1">
              {new Date(msg.time).toLocaleTimeString()}
            </small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 border p-2 rounded mr-2"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
