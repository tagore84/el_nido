import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DeviceView from './DeviceView';
import './index.css'

function App() {
  return (
    <BrowserRouter basename="/nido">
      <Routes>
        <Route path="/:deviceId" element={<DeviceView />} />
        <Route path="/" element={<DeviceView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
