import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/vendor/Dashboard';
import Reservations from './pages/vendor/Reservations';
import MapBuilder from './pages/admin/MapBuilder';
import Register from './pages/public/Register';
import Login from './pages/public/Login';

function App() {
  return (
    <div className="App">
      <Routes> 
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/vendor/dashboard" element={<Dashboard />} />
        <Route path="/vendor/reservations" element={<Reservations />} />
      </Routes>
    </div>
  );
}

export default App;

