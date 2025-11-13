import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building2, User, Mail, Phone, MapPin, Save, X } from 'lucide-react';

function AccountSettings() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [businessName, setBusinessName] = useState('My Business');
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load business name and form data from localStorage
  useEffect(() => {
    const savedBusinessName = localStorage.getItem('vendor_business_name');
    const savedFormData = localStorage.getItem('vendor_account_data');
    
    if (savedBusinessName) {
      setBusinessName(savedBusinessName);
      setFormData(prev => ({ ...prev, businessName: savedBusinessName }));
    }
    
    if (savedFormData) {
      try {
        const data = JSON.parse(savedFormData);
        setFormData(prev => ({ ...prev, ...data }));
      } catch (error) {
        console.error('Error loading account data:', error);
      }
    }
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Validate password change if new password is provided
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        alert('New password must be at least 6 characters long');
        setIsSaving(false);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        alert('New password and confirm password do not match');
        setIsSaving(false);
        return;
      }
    }

    // Save to localStorage (in a real app, this would be an API call)
    localStorage.setItem('vendor_business_name', formData.businessName);
    localStorage.setItem('vendor_account_data', JSON.stringify({
      businessName: formData.businessName,
      ownerName: formData.ownerName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address
    }));

    setBusinessName(formData.businessName);
    setSaveSuccess(true);
    setIsSaving(false);

    // Clear password fields after save
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));

    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('vendor_business_name');
    localStorage.removeItem('vendor_auth_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a4f] via-[#123c8c] to-[#0f9ed6] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl px-4 md:px-8 py-5 flex flex-col md:flex-row justify-between items-center shadow-xl border-b border-white/20 z-50">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
            <img src="/Logo.png" alt="CIBF Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#0f9ed6] m-0">
              Colombo International Bookfair
            </h1>
            <p className="text-xs md:text-sm text-gray-600 m-0 font-medium">Vendor Portal</p>
          </div>
        </div>
        <div className="flex gap-2 md:gap-3 w-full md:w-auto justify-center md:justify-end items-center">
          <button 
            className="px-6 py-2.5 bg-white/80 backdrop-blur-sm text-slate-700 rounded-xl text-sm font-semibold border border-slate-200 hover:bg-white hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            onClick={() => navigate('/vendor/dashboard')}
          >
            <span>📊</span> Dashboard
          </button>
          <button 
            className="px-6 py-2.5 bg-white/80 backdrop-blur-sm text-slate-700 rounded-xl text-sm font-semibold border border-slate-200 hover:bg-white hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            onClick={() => navigate('/vendor/reservations')}
          >
            <span>📍</span> Reservations
          </button>
          
          {/* Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl hover:bg-white hover:shadow-md transition-all duration-200 transform hover:scale-105"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">
                  {businessName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800 m-0 leading-tight">{businessName}</p>
                <p className="text-xs text-gray-500 m-0 leading-tight">Vendor Account</p>
              </div>
              <span className={`text-gray-600 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-fade-in">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-sky-50 to-cyan-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-xl">
                        {businessName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 m-0 truncate">{businessName}</p>
                      <p className="text-xs text-gray-500 m-0">Vendor Account</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/vendor/settings');
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3"
                  >
                    <span className="text-lg">⚙️</span>
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-3"
                  >
                    <span className="text-lg">🚪</span>
                    <span className="font-semibold">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="relative max-w-4xl mx-auto p-4 md:p-8 z-10 pt-24 md:pt-28">
        {/* Header */}
        <div className="text-center text-white mb-8 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
              <span className="text-4xl">⚙️</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold m-0 mb-3 drop-shadow-2xl">
            Account Settings
          </h2>
          <p className="text-lg md:text-xl bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] bg-clip-text text-transparent font-medium">
            Manage your account information and preferences
          </p>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 bg-green-50 border-2 border-green-500 rounded-xl p-4 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✅</span>
              <span className="text-green-700 font-semibold">Settings saved successfully!</span>
            </div>
            <button
              onClick={() => setSaveSuccess(false)}
              className="text-green-700 hover:text-green-900"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-10 mb-8 shadow-2xl border border-white/30">
          <div className="space-y-6 md:space-y-8">
            {/* Business Information Section */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-600 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Building2 className="text-white" size={20} />
                </div>
                Business Information
              </h3>
              
              <div className="space-y-4 md:space-y-6">
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
                      className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-200 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200 bg-gray-50"
                      placeholder="Enter your business name"
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
                      className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-200 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200 bg-gray-50"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="pt-6 border-t-2 border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-600 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Mail className="text-white" size={20} />
                </div>
                Contact Information
              </h3>
              
              <div className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-200 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200 bg-gray-50"
                        placeholder="your@email.com"
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
                        className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-200 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200 bg-gray-50"
                        placeholder="+94 XX XXX XXXX"
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
                      className="w-full pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-200 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200 bg-gray-50"
                      placeholder="Street address, building name"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="pt-6 border-t-2 border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-600 to-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🔒</span>
                </div>
                Change Password
              </h3>
              <p className="text-sm text-gray-600 mb-4">Leave blank if you don't want to change your password</p>
              
              <div className="space-y-4 md:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={(e) => updateField('currentPassword', e.target.value)}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-200 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200 bg-gray-50 pr-12"
                      placeholder="Enter current password"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={(e) => updateField('newPassword', e.target.value)}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-200 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200 bg-gray-50 pr-12"
                        placeholder="Create new password"
                      />
                      <button
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => updateField('confirmPassword', e.target.value)}
                        className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-200 rounded-xl text-base transition-all duration-200 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200 bg-gray-50 pr-12"
                        placeholder="Confirm new password"
                      />
                      <button
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-end mt-8 pt-6 border-t-2 border-gray-100">
            <button
              className="px-8 py-4 bg-white/90 backdrop-blur-xl text-sky-700 border-2 border-sky-300 rounded-xl text-base font-bold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
              onClick={() => navigate('/vendor/dashboard')}
            >
              <X size={20} />
              Cancel
            </button>
            <button
              className="px-8 py-4 bg-gradient-to-r from-sky-600 to-cyan-500 text-white border-none rounded-xl text-base font-bold cursor-pointer transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin">⏳</span> Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;

