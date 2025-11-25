// pages/admin/CreateEmployee.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCog, AlertCircle, CheckCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { adminAPI } from '../../api/axios';
import AdminLayout from '../../layout/AdminLayout';

export default function CreateEmployee() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    contactPerson: '',
    phone: '',
    address: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!formData.businessName.trim()) {
      setError('Business name is required');
      return false;
    }
    if (!formData.contactPerson.trim()) {
      setError('Contact person is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await adminAPI.createEmployee(formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/employees');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create employee');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full min-h-screen bg-gray-50">
        {/* Header with Gradient Background */}
        <div className="p-8 mb-6 bg-white border border-gray-200 shadow-sm b rounded-xl">
          <button
            onClick={() => navigate('/admin/employees')}
            className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            <span>Back to Employees</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg shadow-sm">
              <UserCog className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Employee</h1>
              <p className="text-gray-600">Add a new employee to the system</p>
            </div>
          </div>
        </div>

        {/* Full Screen Form Card */}
        <div className="w-full p-8 bg-white border border-gray-200 shadow-sm rounded-xl">
          {error && (
            <div className="flex items-start gap-3 p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
              <AlertCircle className="flex-shrink-0 text-red-500 mt-0.5" size={20} />
              <p className="font-medium text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-3 p-4 mb-6 border border-green-200 rounded-lg bg-green-50">
              <CheckCircle className="flex-shrink-0 text-green-500 mt-0.5" size={20} />
              <p className="font-medium text-green-700">
                Employee created successfully! Redirecting...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Account Information */}
            <div>
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Account Information</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all"
                    placeholder="employee@example.com"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all"
                      placeholder="Minimum 6 characters"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute text-gray-500 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="pt-8 border-t border-gray-200">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Personal Information</h3>
              <div className="space-y-6">
                {/* Row 1: Business Name and Contact Person */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => updateField('businessName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all"
                      placeholder="Enter business name"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => updateField('contactPerson', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all"
                      placeholder="Enter contact person name"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Row 2: Phone Number only */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all"
                      placeholder="+94 XX XXX XXXX"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Row 3: Address (Full Width) */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Enter full address"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin/employees')}
                disabled={isLoading}
                className="flex-1 px-6 py-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 font-semibold text-white bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}