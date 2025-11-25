import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/axios';
import type { ApiError } from '../../types/Error';
import { showToastError } from '../../utils/toast/errToast';
import { showToastSuccess } from '../../utils/toast/successToast';

export default function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [userType, setUserType] = useState<'vendor' | 'employee' | 'admin'>('vendor');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success] = useState(false);
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const updateField = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
        if (error) setError(null);
    };

    const validateForm = (): boolean => {
        if (!formData.email.trim()) {
            setError('Email address is required');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        try {
            await authAPI.login(formData.email.trim(), formData.password, userType);
            showToastSuccess(`Login successful! Welcome back!`);
            
            setTimeout(() => {
                if (userType === 'vendor') {
                    navigate('/vendor/dashboard');
                } else if (userType === 'employee') {
                    navigate('/employee/dashboard');
                } else {
                    navigate('/admin/dashboard');
                }
            }, 1000);
            
        } catch (err: any) {
            const apiError = err as ApiError;
            const errorMessage = apiError.message || 'Login failed. Please try again.';
            showToastError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0e1a4f] via-[#123c8c] to-[#0f9ed6] p-4">
            <div className="w-full max-w-md">
                <div className="mb-6 text-center md:mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#4dd9e8] to-[#2ab7c9] rounded-full mb-3 md:mb-4 shadow-lg">
                        <div className="relative flex items-center justify-center w-full h-12 p-1 rounded-md md:h-16 md:p-2">
                            <img
                                src="/Logo.png"
                                alt="CIBF"
                                className="object-contain w-[60px] h-[60px] md:w-[100px] md:h-[100px] p-1 md:p-2"
                            />
                        </div>
                    </div>
                    <h1 className="mb-1 text-xl font-bold text-white md:text-3xl md:mb-2">COLOMBO INTERNATIONAL</h1>
                    <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] bg-clip-text text-transparent">BOOK FAIR</h2>
                </div>

                <div className="p-6 bg-white shadow-xl rounded-xl md:rounded-2xl md:shadow-2xl md:p-8">
                    <h3 className="text-xl md:text-2xl font-bold text-[#1e2875] mb-4 md:mb-6 text-center">Welcome Back</h3>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-start gap-2 p-3 mb-4 border border-red-200 rounded-lg md:p-4 bg-red-50 md:gap-3">
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                            <p className="text-sm font-medium text-red-700 md:text-base">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="flex items-start gap-2 p-3 mb-4 border border-green-200 rounded-lg md:p-4 bg-green-50 md:gap-3">
                            <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                            <p className="text-sm font-medium text-green-700 md:text-base">Login successful! Redirecting...</p>
                        </div>
                    )}

                    {/* User Type Tabs */}
                    <div className="flex gap-1 p-1 mb-4 bg-gray-100 rounded-lg md:mb-6">
                        <button
                            type="button"
                            onClick={() => setUserType('vendor')}
                            disabled={isLoading}
                            className={`flex-1 py-2 px-2 md:px-3 rounded-md text-xs md:text-sm font-medium transition-all ${
                                userType === 'vendor'
                                ? 'bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Vendor
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType('employee')}
                            disabled={isLoading}
                            className={`flex-1 py-2 px-2 md:px-3 rounded-md text-xs md:text-sm font-medium transition-all ${
                                userType === 'employee'
                                ? 'bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Employee
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType('admin')}
                            disabled={isLoading}
                            className={`flex-1 py-2 px-2 md:px-3 rounded-md text-xs md:text-sm font-medium transition-all ${
                                userType === 'admin'
                                ? 'bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Admin
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all text-sm md:text-base"
                                placeholder="Enter your email"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => updateField('password', e.target.value)}
                                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all pr-10 md:pr-12 text-sm md:text-base"
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute text-gray-500 -translate-y-1/2 right-2 md:right-3 top-1/2 hover:text-gray-700"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff size={18} className="md:w-5" /> : <Eye size={18} className="md:w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs md:text-sm">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={(e) => updateField('rememberMe', e.target.checked)}
                                    className="w-3 h-3 md:w-4 md:h-4 text-[#2ab7c9] border-gray-300 rounded focus:ring-[#2ab7c9]"
                                    disabled={isLoading}
                                />
                                <span className="ml-2 text-gray-600">Remember me</span>
                            </label>
                            <button 
                                type="button"
                                className="text-[#2ab7c9] hover:text-[#1e2875] font-medium"
                                disabled={isLoading}
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] text-white py-2 md:py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    {userType === 'vendor' && (
                        <div className="mt-4 text-xs text-center text-gray-600 md:mt-6 md:text-sm">
                            Don't have an account?{' '}
                            <button 
                                onClick={() => navigate('/register')}
                                className="text-[#2ab7c9] hover:text-[#1e2875] font-semibold"
                                disabled={isLoading}
                            >
                                Register here
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}