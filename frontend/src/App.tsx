import { Routes, Route } from 'react-router-dom';
import Register from './pages/public/Register';
import Login from './pages/public/Login';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeReservations from './pages/employee/Reservations';
import ReserveStalls from './pages/vendor/ReserveStalls';
import MyReservations from './pages/vendor/MyReservations';
import VendorLayout from './layout/VendorLayout';
import VendorProfile from './pages/vendor/Profile';
import EmployeeProfile from './pages/employee/Profile';
import VendorDashboard from './pages/vendor/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminEmployees from './pages/admin/Employees';
import CreateEmployee from './pages/admin/CreateEmployee';
import AdminStalls from './pages/admin/Stalls';
import CreateStall from './pages/admin/CreateStall';
import AdminReservations from './pages/admin/Reservations';
import AdminProfile from './pages/admin/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmployeeStall from './pages/employee/Stall';

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
        <Route path="/employee/stall" element={<EmployeeStall/>} />

        
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/admin/employees" element={<AdminEmployees/>} />
        <Route path="/admin/employees/create" element={<CreateEmployee/>} />
        <Route path="/admin/stalls" element={<AdminStalls/>} />
        <Route path="/admin/stalls/create" element={<CreateStall/>} />
        <Route path="/admin/reservations" element={<AdminReservations/>} />
        <Route path="/admin/profile" element={<AdminProfile/>} />
        
       
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;

