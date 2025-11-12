import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [userType, setUserType] = useState<'vendor' | 'employee'>('vendor');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e2875] via-[#3245a5] to-[#505ec4] p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-6 md:mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#4dd9e8] to-[#2ab7c9] rounded-full mb-3 md:mb-4 shadow-lg">
                        <div className="relative flex items-center justify-center w-full h-12 md:h-16 p-1 md:p-2 rounded-md">
                            <img
                                src="/Logo.png"
                                alt="CIBF"
                                className="object-contain w-[60px] h-[60px] md:w-[100px] md:h-[100px] p-1 md:p-2"
                            />
                        </div>
                    </div>
                    <h1 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">COLOMBO INTERNATIONAL</h1>
                    <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] bg-clip-text text-transparent">BOOK FAIR</h2>
                </div>

                <div className="bg-white rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-bold text-[#1e2875] mb-4 md:mb-6 text-center">Welcome Back</h3>

                    <div className="flex gap-1 md:gap-2 mb-4 md:mb-6 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setUserType('vendor')}
                            className={`flex-1 py-2 px-3 md:px-4 rounded-md text-sm md:text-base font-medium transition-all ${
                                userType === 'vendor'
                                ? 'bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Vendor/Publisher
                        </button>
                        <button
                            onClick={() => setUserType('employee')}
                            className={`flex-1 py-2 px-3 md:px-4 rounded-md text-sm md:text-base font-medium transition-all ${
                                userType === 'employee'
                                ? 'bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Employee
                        </button>
                    </div>

                    <div className="space-y-4 md:space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all text-sm md:text-base"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all pr-10 md:pr-12 text-sm md:text-base"
                                    placeholder="Enter your password"
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                    className="w-3 h-3 md:w-4 md:h-4 text-[#2ab7c9] border-gray-300 rounded focus:ring-[#2ab7c9]"
                                />
                                <span className="ml-2 text-gray-600">Remember me</span>
                            </label>
                            <button className="text-[#2ab7c9] hover:text-[#1e2875] font-medium">
                                Forgot password?
                            </button>
                        </div>
                        <button
                            className="w-full bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] text-white py-2 md:py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm md:text-base"
                        >
                            Sign In
                        </button>
                    </div>
                    <div className="mt-4 md:mt-6 text-center text-xs md:text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button onClick={() => navigate('/register')}
                        className="text-[#2ab7c9] hover:text-[#1e2875] font-semibold">
                        Register here
                        </button>
                    </div>
                </div>
                <p className="text-center text-white text-xs md:text-sm mt-4 md:mt-6 opacity-80">
                    © 2024 Sri Lanka Book Publishers' Association
                </p>
            </div>
        </div>
    );
}