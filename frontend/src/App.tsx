import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/vendor/Dashboard';
import Reservations from './pages/vendor/Reservations';
import AccountSettings from './pages/vendor/AccountSettings';
import LoginPage from './pages/public/Login';
import RegisterPage from './pages/public/Register';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/vendor/dashboard" element={<Dashboard />} />
        <Route path="/vendor/reservations" element={<Reservations />} />
        <Route path="/vendor/settings" element={<AccountSettings />} />
      </Routes>
    </div>
  );
}

export default App;

