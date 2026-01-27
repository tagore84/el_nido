import { useRef, useEffect, useState } from 'react';

function ChatInterface({ messages, onSendMessage, isConnected }) {
    const [inputValue, setInputValue] = useState("");
    const logEndRef = useRef(null);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (inputValue.trim()) {
            onSendMessage(inputValue);
            setInputValue("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    // Helper to format messages for display
    // We expect messages to have { type: 'rx' | 'tx' | 'system', text: string }
    const formatMessage = (msg) => {
        // Simple HTML parsing for basic formatting (bold, newlines) if needed
        // For now, text is enough.
        return msg.text;
    };

    return (
        <div className="card chat-card">
            <div className="chat-header">
                <h2 className="chat-title">Chat con Nido</h2>
                <div className={`status-badge ${isConnected ? 'connected' : 'disconnected'}`}>
                    <span className="status-dot"></span>
                    {isConnected ? 'En línea' : 'Desconectado'}
                </div>
            </div>

            <div className="chat-log">
                {messages.length === 0 && (
                    <div className="empty-state">
                        <p>👋 ¡Hola! ¿En qué puedo ayudarte hoy?</p>
                        <div className="empty-hints">
                            <p className="hint-item">🛒 "Añade huevos y leche a la lista"</p>
                            <p className="hint-item">🍽️ "He comido ensalada césar"</p>
                            <p className="hint-item">👨‍🍳 "Ideas para cenar con pollo"</p>
                            <p className="hint-item">📅 "Reunión mañana a las 10"</p>
                        </div>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.type}`}>
                        <div className="message-content">
                            {formatMessage(msg)}
                        </div>
                    </div>
                ))}
                <div ref={logEndRef} />
            </div>

            <div className="chat-input-area">
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Escribe un mensaje..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={!isConnected}
                />
                <button
                    className="chat-send-btn"
                    onClick={handleSend}
                    disabled={!isConnected || !inputValue.trim()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="send-icon">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default ChatInterface;
