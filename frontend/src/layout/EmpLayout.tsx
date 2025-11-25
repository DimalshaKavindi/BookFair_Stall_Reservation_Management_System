import {
  LogOut,
  Menu,
  X,
  
  User,
  ChevronDown
} from "lucide-react";
import { type ReactNode, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { userAPI } from "../api/axios";
import type { UserProfile } from "../types/UserType";

interface EmpLayoutProps {
  children: ReactNode;
}

export default function EmpLayout({ children }: EmpLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await userAPI.getProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("userRole");
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = userProfile?.businessName || userProfile?.contactPerson || 'User';

  const navItems = [
    {
      path: "/employee/dashboard",
      label: "Dashboard",
      
    },
      {
      path: "/employee/stall",
      label: "Stalls",
      
    },
    {
      path: "/employee/reservations",
      label: "Reservations",
      
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-[#1e2875] to-[#3245a5] border-b border-[#4dd9e8]/20 sticky top-0 z-50 shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center gap-3">
              <img
                src="/Logo.png"
                alt="CIBF"
                className="object-contain w-[40px] h-[40px] md:w-[65px] md:h-[65px] p-1 md:p-2"
              />
              <div>
                <h1 className="text-base font-bold text-white md:text-xl lg:text-2xl">
                  Colombo International Book Fair
                </h1>
                <p className="text-xs text-[#4dd9e8] hidden sm:block">
                  Organizer Portal
                </p>
              </div>
            </div>
            <nav className="items-center hidden gap-1 md:flex">
              {navItems.map((item) => {
               
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                      active
                        ? "text-white shadow-md bg-white/20 border border-white/30"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    
                    {item.label}
                  </button>
                );
              })}

              <div className="relative ml-3" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
                >
                  <div className="w-6 h-6 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#4dd9e8] to-[#2ab7c9] flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {loading ? (
                      <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                    ) : (
                      getInitials(displayName)
                    )}
                  </div>
                  <span className="text-white text-sm font-medium max-w-[120px] truncate hidden lg:block">
                    {loading ? 'Loading...' : displayName}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/70 transition-transform ${
                      profileDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 z-50 w-56 py-2 mt-2 duration-200 bg-white border border-gray-100 shadow-lg rounded-xl animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {displayName}
                      </p>
                      {userProfile?.email && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {userProfile.email}
                        </p>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/employee/profile');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        My Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="relative"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#4dd9e8] to-[#2ab7c9] flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {loading ? (
                    <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                  ) : (
                    getInitials(displayName)
                  )}
                </div>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 transition-colors rounded-lg hover:bg-white/10"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>

          {profileDropdownOpen && (
            <div className="absolute z-50 w-56 py-2 bg-white border border-gray-100 shadow-lg md:hidden right-4 top-16 rounded-xl">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {displayName}
                </p>
                {userProfile?.email && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {userProfile.email}
                  </p>
                )}
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    navigate('/employee/profile');
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  My Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}

          {mobileMenuOpen && (
            <div className="py-4 border-t md:hidden border-white/10">
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => {
                 
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-2.5 text-sm font-medium rounded-lg text-left transition-all flex items-center gap-3 ${
                        active
                          ? "bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] text-white shadow-md"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                     
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}