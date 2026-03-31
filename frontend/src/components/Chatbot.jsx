import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your AI assistant for Skill Swap. How can I help you today?", isUser: false }
    ]);
    const [inputStr, setInputStr] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputStr.trim()) return;

        const userMsg = inputStr.trim();
        setMessages(prev => [...prev, { id: Date.now(), text: userMsg, isUser: true }]);
        setInputStr('');
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });
            const data = await response.json();
            
            if (!response.ok || data.error) {
                 throw new Error(data.error || 'Server error');
            }
            
            setMessages(prev => [...prev, { id: Date.now(), text: data.reply, isUser: false }]);
        } catch (error) {
            setMessages(prev => [...prev, { 
                id: Date.now(), 
                text: "I couldn't reach the server right now. But feel free to explore the site!", 
                isUser: false 
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!isOpen && (
                <div className="chat-toggle" onClick={() => setIsOpen(true)}>
                    <MessageSquare size={28} />
                </div>
            )}

            {isOpen && (
                <div className="glass-panel chat-widget">
                    <div className="chat-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '50%' }}>
                                <Bot size={20} color="white" />
                            </div>
                            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>AI Help</span>
                        </div>
                        <X size={24} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setIsOpen(false)} />
                    </div>
                    
                    <div className="chat-messages">
                        {messages.map(msg => (
                            <div key={msg.id} className={`msg-bubble flex-center ${msg.isUser ? 'msg-user' : 'msg-ai'}`} style={{ gap: '8px', 
                                flexDirection: msg.isUser ? 'row-reverse' : 'row',
                                alignSelf: msg.isUser ? 'flex-end' : 'flex-start'
                            }}>
                                <div style={{ minWidth: '24px' }}>
                                    {msg.isUser ? <User size={16} opacity={0.7} /> : <Bot size={16} color="var(--primary)" />}
                                </div>
                                <div style={{ wordBreak: 'break-word' }}>{msg.text}</div>
                            </div>
                        ))}
                        {loading && (
                            <div className="msg-bubble msg-ai flex-center" style={{ gap: '8px', opacity: 0.7, alignSelf: 'flex-start' }}>
                                <Bot size={16} color="var(--primary)" />
                                Typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input" onSubmit={handleSend}>
                        <input 
                            type="text" 
                            placeholder="Type your message..." 
                            value={inputStr}
                            onChange={(e) => setInputStr(e.target.value)}
                        />
                        <button type="submit" className="btn-primary" disabled={!inputStr.trim() || loading}>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;
