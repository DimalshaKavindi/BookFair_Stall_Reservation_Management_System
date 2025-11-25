import { useState } from 'react';
import { Eye, EyeOff, Building2, User, Mail, Phone, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI} from '../../api/axios';
import type { ApiError } from '../../types/Error';
import { showToastError } from '../../utils/toast/errToast';
import { showToastSuccess } from '../../utils/toast/successToast';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });

    const updateField = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
        if (error) setError(null);
    };

    const validateForm = (): boolean => {
        if (!formData.businessName.trim()) {
            setError('Business name is required');
            return false;
        }
        if (!formData.ownerName.trim()) {
            setError('Owner/Contact person name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email address is required');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Phone number is required');
            return false;
        }
        if (!formData.address.trim()) {
            setError('Business address is required');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        if (!passwordRegex.test(formData.password)) {
            setError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)');
            return false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (!formData.agreeTerms) {
            setError('You must agree to the Terms and Conditions');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!validateForm()) {
            return;
        }
        setIsLoading(true);

        try {
            const registrationData = {
                email: formData.email.trim(),
                password: formData.password,
                businessName: formData.businessName.trim(),
                contactPerson: formData.ownerName.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim(),
            };

            await authAPI.registerVendor(registrationData);
            setSuccess(true);
            setError(null);
            showToastSuccess('Registration successful! Welcome to Colombo International Book Fair!');
            
            setTimeout(() => {
                navigate('/');
            }, 2000);
            
        } catch (err: any) {
            const apiError = err as ApiError;
            const errorMessage = apiError.message || 'Registration failed. Please try again.';
            setError(errorMessage);
            setSuccess(false);
            showToastError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0e1a4f] via-[#123c8c] to-[#0f9ed6] p-4 py-6 md:py-8">
            <div className="w-full max-w-2xl">
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
                    <h3 className="text-xl md:text-2xl font-bold text-[#1e2875] mb-1 md:mb-2 text-center">Create Your Account</h3>
                    <p className="text-gray-600 text-center text-sm md:text-base mb-4 md:mb-6">Register as a Vendor or Publisher</p>

                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Name *
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={formData.businessName}
                                    onChange={(e) => updateField('businessName', e.target.value)}
                                    className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all text-sm md:text-base"
                                    placeholder="Enter your business name"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Owner/Contact Person Name *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={formData.ownerName}
                                    onChange={(e) => updateField('ownerName', e.target.value)}
                                    className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all text-sm md:text-base"
                                    placeholder="Enter your full name"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all text-sm md:text-base"
                                        placeholder="your@email.com"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => updateField('phone', e.target.value)}
                                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all text-sm md:text-base"
                                        placeholder="+94 XX XXX XXXX"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Address *
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => updateField('address', e.target.value)}
                                    className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all text-sm md:text-base"
                                    placeholder="Street address, building name"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => updateField('password', e.target.value)}
                                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all pr-10 md:pr-12 text-sm md:text-base"
                                        placeholder="Create password"
                                        disabled={isLoading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                                        className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all pr-10 md:pr-12 text-sm md:text-base"
                                        placeholder="Confirm password"
                                        disabled={isLoading}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                checked={formData.agreeTerms}
                                onChange={(e) => updateField('agreeTerms', e.target.checked)}
                                className="w-3 h-3 md:w-4 md:h-4 mt-1 text-[#2ab7c9] border-gray-300 rounded focus:ring-[#2ab7c9]"
                                disabled={isLoading}
                            />
                            <label className="ml-2 text-xs md:text-sm text-gray-600">
                                I agree to the{' '}
                                <button type="button" className="text-[#2ab7c9] hover:text-[#1e2875] font-medium">
                                    Terms and Conditions
                                </button>{' '}
                                and{' '}
                                <button type="button" className="text-[#2ab7c9] hover:text-[#1e2875] font-medium">
                                    Privacy Policy
                                </button>
                            </label>
                        </div>

                        {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
                            <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-green-700">Registration successful! Redirecting to login...</p>
                        </div>
                    )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] text-white py-2 md:py-3 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 mt-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-4 md:mt-6 text-center text-xs md:text-sm text-gray-600">
                        Already have an account?{' '}
                        <button 
                            onClick={() => navigate('/')}
                            className="text-[#2ab7c9] hover:text-[#1e2875] font-semibold"
                            disabled={isLoading}
                        >
                            Sign in here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}