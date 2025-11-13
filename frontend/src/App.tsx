import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/vendor/Dashboard';
import Reservations from './pages/vendor/Reservations';
import MapBuilder from './pages/admin/MapBuilder';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/vendor/dashboard" replace />} />
        <Route path="/vendor/dashboard" element={<Dashboard />} />
        <Route path="/vendor/reservations" element={<Reservations />} />
        <Route path="/admin/map-builder" element={<MapBuilder />} />
      </Routes>
    </div>
  );
}

export default App;

