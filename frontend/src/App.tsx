import { Routes, Route } from 'react-router-dom';
import Register from './pages/public/Register';
import Login from './pages/public/Login';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeReservations from './pages/employee/Reservations';
import ReserveStalls from './pages/vendor/ReserveStalls';
import MyReservations from './pages/vendor/MyReservations';
import VendorLayout from './layout/VendorLayout';
import VendorProfile from './pages/vendor/Profile';
import Dashboard from './pages/employee/Dashboard';
import EmployeeProfile from './pages/employee/Profile';
import VendorDashboard from './pages/vendor/Dashboard';

function App() {
  return (
    <div className="App">
      <Routes> 
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
        
        <Route path="/vendor/dashboard" element={<VendorLayout><VendorDashboard/></VendorLayout>}/>
        <Route path="/vendor/reserve-stalls" element={<VendorLayout><ReserveStalls/></VendorLayout>}/>
        <Route path="/vendor/my-reservations" element={<VendorLayout><MyReservations/></VendorLayout>}/>
        <Route path="/vendor/profile" element={<VendorLayout><VendorProfile/></VendorLayout>}/>

        <Route path="/employee/dashboard" element={<EmployeeDashboard/>} />
        <Route path="/employee/reservations" element={<EmployeeReservations/>} />
        <Route path="/employee/profile" element={<EmployeeProfile/>} />
       
      </Routes>
    </div>
  );
}

export default App;

