
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCog, Plus, Loader2, AlertCircle } from 'lucide-react';
import { adminAPI } from '../../api/axios';
import AdminLayout from '../../layout/AdminLayout';
import EmployeeTable from '../../components/EmployeeTable';

interface Employee {
  id: number;
  email: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  address: string;
  createdAt: string;
}

export default function AdminEmployees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getEmployees();
      setEmployees(response.employees || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#4dd9e8] animate-spin" />
            <p className="text-gray-600">Loading employees...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-3 p-6 border border-red-200 rounded-xl bg-red-50">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-medium text-red-700">{error}</p>
              <button
                onClick={loadEmployees}
                className="mt-2 text-sm text-red-600 underline hover:text-red-700"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl">
      
        <div className="p-6 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <UserCog className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Employees Management</h1>
                <p className="text-gray-600">Manage system employees</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/employees/create')}
              className="flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] rounded-lg hover:shadow-lg transition-all font-medium"
            >
              <Plus size={20} />
              Add Employee
            </button>
          </div>
        </div>


  
        {employees.length === 0 ? (
          <div className="p-12 text-center bg-white border border-gray-100 shadow-sm rounded-xl">
            <UserCog className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No Employees Yet</h3>
            <p className="mb-4 text-gray-600">Get started by adding your first employee</p>
            <button
              onClick={() => navigate('/admin/employees/create')}
              className="px-6 py-3 text-white bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] rounded-lg hover:shadow-lg transition-all font-medium"
            >
              Add First Employee
            </button>
          </div>
        ) : (
          <EmployeeTable employees={employees} />
        )}
      </div>
    </AdminLayout>
  );
}