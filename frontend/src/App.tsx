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
import ProtectedRoute from './components/ProtectedRoute';
import EmployeeStall from './pages/employee/Stall';

function App() {
  return (
    <div className="App">
      <Routes> 
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
        
        <Route path="/vendor/dashboard" element={<ProtectedRoute requiredRole="VENDOR"><VendorLayout><VendorDashboard /></VendorLayout></ProtectedRoute>}/>
        <Route path="/vendor/reserve-stalls" element={<ProtectedRoute requiredRole="VENDOR"><VendorLayout><ReserveStalls/></VendorLayout></ProtectedRoute>}/>
        <Route path="/vendor/my-reservations" element={<ProtectedRoute requiredRole="VENDOR"><VendorLayout><MyReservations/></VendorLayout></ProtectedRoute>}/>
        <Route path="/vendor/profile" element={<ProtectedRoute requiredRole="VENDOR"><VendorLayout><VendorProfile/></VendorLayout></ProtectedRoute>}/>


        <Route path="/employee/dashboard" element={<ProtectedRoute requiredRole="EMPLOYEE"><EmployeeDashboard /></ProtectedRoute>} />
        <Route path="/employee/reservations" element={<ProtectedRoute requiredRole="EMPLOYEE"><EmployeeReservations/></ProtectedRoute>} />
        <Route path="/employee/profile" element={<ProtectedRoute requiredRole="EMPLOYEE"><EmployeeProfile/></ProtectedRoute>} />
        <Route path="/employee/stall" element={<ProtectedRoute requiredRole="EMPLOYEE"><EmployeeStall/></ProtectedRoute>} />
        
        <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboard/></ProtectedRoute>} />
        <Route path="/admin/employees" element={<ProtectedRoute requiredRole="ADMIN"><AdminEmployees/></ProtectedRoute>} />
        <Route path="/admin/employees/create" element={<ProtectedRoute requiredRole="ADMIN"><CreateEmployee/></ProtectedRoute>} />
        <Route path="/admin/stalls" element={<ProtectedRoute requiredRole="ADMIN"><AdminStalls/></ProtectedRoute>} />
        <Route path="/admin/stalls/create" element={<ProtectedRoute requiredRole="ADMIN"><CreateStall/></ProtectedRoute>} />
        <Route path="/admin/reservations" element={<ProtectedRoute requiredRole="ADMIN"><AdminReservations/></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute requiredRole="ADMIN"><AdminProfile/></ProtectedRoute>} />
        
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;

