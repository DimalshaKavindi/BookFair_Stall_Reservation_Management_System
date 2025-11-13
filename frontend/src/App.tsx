import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/vendor/Dashboard';
import Reservations from './pages/vendor/Reservations';
import Register from './pages/public/Register';
import Login from './pages/public/Login';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeReservations from './pages/employee/Reservations';

function App() {
  return (
    <div className="App">
      <Routes> 
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/vendor/dashboard" element={<Dashboard />} />
        <Route path="/vendor/reservations" element={<Reservations />} />

        <Route path="/employee/dashboard" element={<EmployeeDashboard/>} />
        <Route path="/employee/reservations" element={<EmployeeReservations/>} />
      </Routes>
    </div>
  );
}

export default App;

