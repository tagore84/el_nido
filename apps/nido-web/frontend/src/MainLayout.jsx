import { useState, useEffect, useRef } from 'react'
import './index.css'
import MealsTable from './MealsTable';
import CalendarView from './CalendarView';

import logo from '../assets/logo.png';
import ChatInterface from './components/ChatInterface';

function MainLayout({ deviceConfig }) {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const isVisible = (componentName) => {
        if (!deviceConfig?.visibleComponents) return true;
        return deviceConfig.visibleComponents.includes(componentName);
    };

    useEffect(() => {
        if (deviceConfig?.theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }, [deviceConfig]);


    useEffect(() => {
        // Determine WebSocket URL relative to current host
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // Use relative path which works with Nginx proxying
        // In dev, Vite proxy needs to handle WS too, or we use explicit port if proxy fails WS
        // For now, let's assume /nido_api/ws is correct path if proxied
        const wsUrl = `${protocol}//${window.location.host}/nido_api/ws`;

        // If we are strictly in dev without proxy working for WS (common issue), fallback to direct
        // But we are trying to fix "synology" deployment, so relative is safer.

        // To support Vite HMR proxying WS:
        // If we use /nido_api/ws, vite proxy needs ws: true. Let's check vite config.
        // If we didn't enable ws: true in proxy, we might need to.
        // Let's stick to relative for now.

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
            setMessages(prev => [...prev, { type: 'system', text: 'Conectado al Backend de Nido' }]);
        };

        ws.onmessage = (event) => {
            console.log('Message received:', event.data);
            let text = event.data;
            if (text === "Connected to Nido Brain") {
                text = "Conectado al Cerebro Nido";
            }
            setMessages(prev => [...prev, { type: 'rx', text }]);
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

    return (
        <div className={`container ${deviceConfig?.theme === 'dark' ? 'dark-theme' : ''}`}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                <img src={logo} alt="Nido Logo" style={{ width: '120px', height: 'auto', marginBottom: '1rem' }} />
                <h1 className="title" style={{ margin: 0 }}>Nido Web</h1>
                <p className="subtitle" style={{ margin: 0 }}>
                    {deviceConfig?.label ? deviceConfig.label : 'Lau, Alberto y Coco'}
                </p>
            </div>

            {isVisible('calendar') && <CalendarView deviceConfig={deviceConfig} />}

            {isVisible('meals') && <MealsTable deviceConfig={deviceConfig} />}

            {isVisible('system_register') && (
                <ChatInterface
                    messages={messages}
                    onSendMessage={(text) => {
                        if (socket) {
                            socket.send(text);
                            setMessages(prev => [...prev, { type: 'tx', text }]);
                        }
                    }}
                    isConnected={isConnected}
                />
            )}
        </div>
    )
}

export default MainLayout
