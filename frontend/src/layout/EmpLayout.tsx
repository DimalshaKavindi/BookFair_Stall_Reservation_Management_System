// frontend/src/components/EmpLayout.tsx
import {
  LogOut,
  Menu,
  X
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface EmpLayoutProps {
  children: ReactNode;
}

export default function EmpLayout({ children }: EmpLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  

  // useEffect(() => {
  //   // Check if logged in
  //   const token = localStorage.getItem("employeeToken");
  //   const email = localStorage.getItem("employeeEmail");
    
  //   if (!token) {
  //     navigate("/employee/login");
  //   } else {
  //     setUserEmail(email || "");
  //   }
  // }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("employeeToken");
    sessionStorage.removeItem("employeeEmail");
    navigate("/employee/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: "/employee/dashboard",
      label: "Dashboard",
      
    },
    {
      path: "/employee/reservations",
      label: "Reservations",
     
    },
     {
      path: "/employee/profile",
      label: "Profile",
     
    }
   
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1e2875] to-[#3245a5] border-b border-[#4dd9e8]/20 sticky top-0 z-50 shadow-lg">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
               <img
                src="/Logo.png"
                alt="CIBF"
                className="object-contain w-[65px] h-[65px] md:w-[65px] md:h-[65px] p-1 md:p-2"
              />
              <div>
                <h1 className="text-xl font-bold text-white">
                   Colombo International Book Fair
                </h1>
                <p className="text-xs text-[#4dd9e8] hidden sm:block">
                  Organizer Portal
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="items-center hidden gap-1 md:flex">
              {navItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
                      active
                        ? " text-white shadow-md bg-white/10"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
               <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] hover:from-[#3bc5d4] hover:to-[#1e9fb0] rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </nav>

           

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 transition-colors rounded-lg md:hidden hover:bg-white/10"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="py-4 border-t md:hidden border-white/10">
             

              {/* Navigation Links */}
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
                      className={`px-4 py-2.5 text-sm font-medium rounded-lg text-left transition-all flex items-center gap-2 ${
                        active
                          ? "bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] text-white shadow-md"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`}
                    >
                     
                      {item.label}
                    </button>
                  );
                })}
                
                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="mt-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] hover:from-[#3bc5d4] hover:to-[#1e9fb0] rounded-lg transition-all flex items-center gap-2 border-t border-white/10 pt-4 shadow-md hover:shadow-lg"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-4 bg-white border-t border-gray-200">
        <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            
            <p className="text-xs text-gray-500">
              Stall Reservation Management System v1.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}