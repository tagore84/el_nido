import { useState, useEffect, useRef } from 'react'
import './index.css'
import MealsTable from './MealsTable';
import CalendarView from './CalendarView';

import logo from '../assets/logo.png';

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const logEndRef = useRef(null);

  useEffect(() => {
    // Determine WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

    let wsUrl;
    if (import.meta.env.DEV) {
      wsUrl = 'ws://localhost:8008/ws';
    } else {
      wsUrl = `${protocol}//${window.location.host}/nido_api/ws`;
    }

    // Override for flexible testing:
    if (window.location.pathname.startsWith('/nido')) {
      wsUrl = `${protocol}//${window.location.host}/nido_api/ws`;
    }

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      setMessages(prev => [...prev, { type: 'system', text: 'Conectado al Backend de Nido' }]);
    };

    ws.onmessage = (event) => {
      console.log('Message received:', event.data);
      setMessages(prev => [...prev, { type: 'rx', text: event.data }]);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
      setMessages(prev => [...prev, { type: 'system', text: 'Desconectado' }]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (socket && inputValue.trim()) {
      socket.send(inputValue);
      setMessages(prev => [...prev, { type: 'tx', text: inputValue }]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        <img src={logo} alt="Nido Logo" style={{ width: '120px', height: 'auto', marginBottom: '1rem' }} />
        <h1 className="title" style={{ margin: 0 }}>Nido Web</h1>
        <p className="subtitle" style={{ margin: 0 }}>Lau, Alberto y Coco</p>
      </div>

      <CalendarView />

      <MealsTable />

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Registro del Sistema</h2>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
            <span className={`status-indicator ${isConnected ? 'status-connected' : 'status-disconnected'}`}></span>
            {isConnected ? 'Conectado' : 'Desconectado'}
          </div>
        </div>

        <div className="log-container">
          {messages.length === 0 && <div style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>Sin actividad</div>}
          {messages.map((msg, index) => (
            <div key={index} className="log-entry" style={{
              borderLeftColor: msg.type === 'tx' ? '#818cf8' : (msg.type === 'system' ? '#64748b' : '#38bdf8'),
              opacity: msg.type === 'system' ? 0.7 : 1
            }}>
              {msg.text}
            </div>
          ))}
          <div ref={logEndRef} />
        </div>

        <div className="input-group">
          <input
            type="text"
            placeholder="Introduce un comando..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isConnected}
          />
          <button onClick={sendMessage} disabled={!isConnected || !inputValue.trim()}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
