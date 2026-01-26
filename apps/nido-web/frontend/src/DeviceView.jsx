import { useParams, Navigate } from 'react-router-dom';
import MainLayout from './MainLayout';
import devices from './config/devices.json';

function DeviceView() {
    const { deviceId } = useParams();

    // If no deviceId is provided (root path) or it's not found in config,
    // we might want to fallback to a default or show an error/selector.
    // For now, let's assume if it's not found, we use a generic default.

    const config = devices[deviceId];

    if (!deviceId) {
        // Logic for root path '/'
        // Maybe we want to persist the last used device or just show a default?
        // Let's just show a default "Web" view.
        return <MainLayout deviceConfig={{ label: "Web Generica", theme: "light" }} />;
    }

    if (!config) {
        // If device ID provided but not found
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Dispositivo no encontrado</h1>
                <p>El identificador "{deviceId}" no está registrado.</p>
                <a href="/">Ir al inicio</a>
            </div>
        );
    }

    return <MainLayout deviceConfig={config} />;
}

export default DeviceView;
