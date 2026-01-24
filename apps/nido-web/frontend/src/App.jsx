import { useState, useEffect, useRef } from 'react'
import './index.css'
import MealsTable from './MealsTable';

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const logEndRef = useRef(null);

  useEffect(() => {
    // Determine WebSocket URL
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Use window.location.host to automatically adapt to port/domain
    // Using current host means we connect to /nido_api/ws on the same origin (handled by Nginx)
    // Or if running locally on port 3001, we might need to point to 8000?
    // In dev: window.location.host is localhost:3001. 
    // If we use /nido_api/ws, vite proxy or nginx must handle it. 
    // We didn't configure vite proxy for /nido_api (only nginx).
    // So for local dev without nginx, this might fail unless we point to localhost:8000.

    let wsUrl;
    if (import.meta.env.DEV) {
      // In local development, assuming simple setup
      // If bypassing nginx:
      wsUrl = 'ws://localhost:8008/ws';
      // Note: The Nginx config uses /nido_api/ => 8008/. So /nido_api/ws => 8008/ws.
      // If we access via Nginx (localhost:80/nido/), then relative path works.
      // Let's try to detect if we are on the proxied path.
    } else {
      // Production / Nginx
      wsUrl = `${protocol}//${window.location.host}/nido_api/ws`;
    }

    // Override for flexible testing: prefer relative if served from same origin structure
    // But since local dev on 3001 doesn't have the nido_api proxy unless we configure vite...
    // Let's configure vite proxy later if needed. For now simpler:

    // Better logic:
    // If path starts with /nido, we assume we are behind the proxy structure.
    if (window.location.pathname.startsWith('/nido')) {
      wsUrl = `${protocol}//${window.location.host}/nido_api/ws`;
    } else {
      wsUrl = 'ws://localhost:8008/ws';
    }

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      setMessages(prev => [...prev, { type: 'system', text: 'Connected to Nido Backend' }]);
    };

    ws.onmessage = (event) => {
      console.log('Message received:', event.data);
      setMessages(prev => [...prev, { type: 'rx', text: event.data }]);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
      setIsConnected(false);
      setMessages(prev => [...prev, { type: 'system', text: 'Disconnected' }]);
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
      <h1 className="title">Nido Web</h1>
      <p className="subtitle">Advanced Systems Interface</p>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>System Log</h2>
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.9rem' }}>
            <span className={`status-indicator ${isConnected ? 'status-connected' : 'status-disconnected'}`}></span>
            {isConnected ? 'Online' : 'Offline'}
          </div>
        </div>

        <div className="log-container">
          {messages.length === 0 && <div style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>No activity</div>}
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
            placeholder="Enter command..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isConnected}
          />
          <button onClick={sendMessage} disabled={!isConnected || !inputValue.trim()}>
            Send
          </button>
        </div>
      </div>

      <MealsTable />
    </div>
  )
}

export default App
