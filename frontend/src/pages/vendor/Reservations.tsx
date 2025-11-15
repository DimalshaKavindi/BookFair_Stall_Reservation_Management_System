import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const MAP_STORAGE_KEY = 'exhibition_map_data';

interface Hall {
  id: string;
  name: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  rows: number;
  cols: number;
  color: string;
}

interface StallData {
  id: string;
  name: string;
  hallId: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  positionX: number;
  positionY: number;
  row?: number;
  col?: number;
  isAvailable: boolean;
}

interface Stall {
  id: string;
  name: string;
  hall: string;
  number: string;
  size: 'small' | 'medium' | 'large';
  reserved: boolean;
  reservedBy?: string;
  x?: number;
  y?: number;
  row?: number;
  col?: number;
}

interface SelectedStall extends Stall {
  selected: boolean;
}

function Reservations() {
  const navigate = useNavigate();
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedStalls, setSelectedStalls] = useState<SelectedStall[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHall, setSelectedHall] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [businessName, setBusinessName] = useState('My Business');
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Load business name from localStorage
  useEffect(() => {
    const savedBusinessName = localStorage.getItem('vendor_business_name');
    if (savedBusinessName) {
      setBusinessName(savedBusinessName);
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

  const handleLogout = () => {
    localStorage.removeItem('vendor_business_name');
    localStorage.removeItem('vendor_auth_token');
    navigate('/');
  };

  // Load map data from localStorage (created by MapBuilder)
  useEffect(() => {
    const loadMapData = () => {
      try {
        const savedData = localStorage.getItem(MAP_STORAGE_KEY);
        if (savedData) {
          const data = JSON.parse(savedData);
          const loadedHalls: Hall[] = data.halls || [];
          const loadedStalls: StallData[] = data.stalls || [];
          
          setHalls(loadedHalls);
          
          // Transform stalls to match the display format
          const transformedStalls: Stall[] = loadedStalls.map((stall) => {
            const hall = loadedHalls.find(h => h.id === stall.hallId);
            if (!hall) return null as any;
            
            // Calculate absolute position on map
            const absoluteX = hall.positionX + (stall.positionX / 100) * hall.width;
            const absoluteY = hall.positionY + (stall.positionY / 100) * hall.height;
            
            // Extract hall name and stall number
            const hallName = hall.name;
            const stallNumber = stall.name.replace(hallName, '');
            
            return {
              id: stall.id,
              name: stall.name,
              hall: hallName,
              number: stallNumber,
              size: stall.size.toLowerCase() as 'small' | 'medium' | 'large',
              reserved: !stall.isAvailable,
              x: absoluteX,
              y: absoluteY,
              row: stall.row,
              col: stall.col
            };
          }).filter(Boolean);
          
          setStalls(transformedStalls);
        } else {
          // Fallback: Show message if no map data exists
          console.warn('No map data found. Please create a map using the Map Builder.');
        }
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    };
    
    loadMapData();
  }, []);

  const handleStallClick = (stall: Stall) => {
    if (stall.reserved) return;

    const isSelected = selectedStalls.find(s => s.id === stall.id);
    
    if (isSelected) {
      setSelectedStalls(selectedStalls.filter(s => s.id !== stall.id));
    } else {
      if (selectedStalls.length >= 3) {
        alert('You can reserve a maximum of 3 stalls per business.');
        return;
      }
      setSelectedStalls([...selectedStalls, { ...stall, selected: true }]);
    }
  };

  const handleConfirmReservation = async () => {
    if (selectedStalls.length === 0) return;

    setIsLoading(true);
    
    setTimeout(() => {
      const updatedStalls = stalls.map(stall => {
        const selected = selectedStalls.find(s => s.id === stall.id);
        if (selected) {
          return { ...stall, reserved: true, reservedBy: 'Current User' };
        }
        return stall;
      });
      
      setStalls(updatedStalls);
      setSelectedStalls([]);
      setShowConfirmModal(false);
      setIsLoading(false);
      
      alert('Reservation confirmed! A confirmation email with QR code will be sent to your registered email address.');
      navigate('/vendor/dashboard');
    }, 1500);
  };

  const getStallClasses = (stall: Stall) => {
    const isSelected = selectedStalls.find(s => s.id === stall.id);
    
    if (stall.reserved) {
      return 'aspect-square min-w-[70px] md:min-w-[90px] border-2 border-gray-400 rounded-xl flex flex-col items-center justify-center cursor-not-allowed transition-all duration-200 p-2 bg-gradient-to-br from-gray-300 to-gray-400 opacity-60 relative overflow-hidden';
    }
    
    if (isSelected) {
      return 'aspect-square min-w-[70px] md:min-w-[90px] border-4 border-sky-600 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 p-2 bg-gradient-to-br from-sky-500 to-cyan-400 text-white scale-110 shadow-2xl ring-4 ring-sky-300 relative overflow-hidden z-10';
    }
    
    const sizeStyles = {
      small: 'bg-gradient-to-br from-green-300 to-emerald-400 border-green-500',
      medium: 'bg-gradient-to-br from-orange-300 to-amber-400 border-orange-500',
      large: 'bg-gradient-to-br from-red-300 to-rose-400 border-red-500'
    };
    
    return `aspect-square min-w-[70px] md:min-w-[90px] border-2 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 p-2 hover:scale-110 hover:shadow-xl hover:z-10 ${sizeStyles[stall.size]}`;
  };

  const getStallSizeLabel = (size: string) => {
    return size.charAt(0).toUpperCase() + size.slice(1);
  };

  const getStallIcon = (size: string) => {
    const icons = {
      small: '🟢',
      medium: '🟠',
      large: '🔴'
    };
    return icons[size as keyof typeof icons];
  };

  const filteredStalls = selectedHall === 'all' 
    ? stalls 
    : stalls.filter(stall => stall.hall === selectedHall);

  const stallsByHall = halls.reduce((acc, hall) => {
    acc[hall.name] = filteredStalls.filter(s => s.hall === hall.name);
    return acc;
  }, {} as { [key: string]: Stall[] });

  const getHallColorStyle = (hallName: string) => {
    const hall = halls.find(h => h.name === hallName);
    return hall?.color || '#0f9ed6';
  };

  const hallLayouts = halls.reduce((acc, hall) => {
    acc[hall.name] = {
      x: hall.positionX,
      y: hall.positionY,
      width: hall.width,
      height: hall.height,
      rows: hall.rows,
      cols: hall.cols
    };
    return acc;
  }, {} as { [key: string]: { x: number; y: number; width: number; height: number; rows: number; cols: number } });

  // Statistics
  const totalStalls = stalls.length;
  const availableStalls = stalls.filter(s => !s.reserved).length;
  const reservedStalls = stalls.filter(s => s.reserved).length;
  const selectedHallStalls = selectedHall === 'all' 
    ? stalls 
    : stalls.filter(s => s.hall === selectedHall);
  const availableInSelectedHall = selectedHallStalls.filter(s => !s.reserved).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a4f] via-[#123c8c] to-[#0f9ed6] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
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
        <div className="flex gap-2 md:gap-3 w-full md:w-auto justify-center md:justify-end mt-4 md:mt-0 items-center">
          <button 
            className="px-6 py-2.5 bg-white/80 backdrop-blur-sm text-slate-700 rounded-xl text-sm font-semibold border border-slate-200 hover:bg-white hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            onClick={() => navigate('/vendor/dashboard')}
          >
            <span>📊</span> Dashboard
          </button>
          <button 
            className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
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

      <div className="relative max-w-7xl mx-auto p-4 md:p-8 z-10 pt-24 md:pt-28">
        {/* Professional Header Section */}
        <div className="text-center text-white mb-8 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto shadow-2xl border-2 border-white/30">
              <span className="text-5xl">🗺️</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold m-0 mb-3 drop-shadow-2xl tracking-tight">
            Sirimavo Bandaranayake Exhibition Center
          </h2>
          <p className="text-lg md:text-xl bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] bg-clip-text text-transparent font-medium mb-4">
            Interactive Stall Reservation System
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Live Availability</span>
            </div>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              <span className="text-lg">🎯</span>
              <span className="text-sm font-semibold">Maximum 3 stalls per business</span>
            </div>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              <span className="text-lg">⚡</span>
              <span className="text-sm font-semibold">Real-time Updates</span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-wide">Total Stalls</p>
                <p className="text-3xl font-bold text-[#0f9ed6]">{totalStalls}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏪</span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-wide">Available</p>
                <p className="text-3xl font-bold text-green-600">{availableStalls}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">✅</span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" style={{ width: `${(availableStalls / totalStalls) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-wide">Reserved</p>
                <p className="text-3xl font-bold text-gray-600">{reservedStalls}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🔒</span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full" style={{ width: `${(reservedStalls / totalStalls) * 100}%` }}></div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-gray-500 text-sm font-semibold mb-1 uppercase tracking-wide">Selected</p>
                <p className="text-3xl font-bold text-[#0f9ed6]">{selectedStalls.length}/3</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📋</span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full" style={{ width: `${(selectedStalls.length / 3) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl mb-6 shadow-2xl border border-white/30">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by stall name (e.g., A01, B15)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-5 py-3 pl-12 border-2 border-gray-200 rounded-xl text-base transition-all duration-200 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200 bg-gray-50"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-xl">🔍</span>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('map')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${
                  viewMode === 'map'
                    ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>🗺️</span> Map View
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>📋</span> Grid View
              </button>
            </div>
          </div>
        </div>

        {/* Hall Filter */}
        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl mb-6 shadow-2xl border border-white/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-lg flex items-center justify-center text-white text-sm">🏛️</span>
              Filter by Hall
            </h3>
            <span className="text-sm text-gray-500">
              {selectedHall === 'all' ? `${halls.length} halls` : `Hall ${selectedHall}`}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedHall('all')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 ${
                selectedHall === 'all'
                  ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Halls
            </button>
            {halls.map((hall) => {
              const hallStalls = stalls.filter(s => s.hall === hall.name);
              const availableCount = hallStalls.filter(s => !s.reserved).length;
              const hallColor = getHallColorStyle(hall.name);
              return (
                <button
                  key={hall.id}
                  onClick={() => setSelectedHall(hall.name)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${
                    selectedHall === hall.name
                      ? 'text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={selectedHall === hall.name ? { backgroundColor: hallColor } : {}}
                >
                  <span className="font-bold">Hall {hall.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedHall === hall.name ? 'bg-white/30' : 'bg-gray-200'
                  }`}>
                    {availableCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl mb-6 shadow-2xl border border-white/30">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-lg flex items-center justify-center text-white text-sm">🔍</span>
            Legend & Guide
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-12 h-12 rounded-xl border-2 border-green-500 bg-gradient-to-br from-green-300 to-emerald-400 shadow-md"></div>
              <span className="text-sm font-semibold text-gray-700">Small Stall</span>
              <span className="text-xs text-gray-500">Compact space</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-12 h-12 rounded-xl border-2 border-orange-500 bg-gradient-to-br from-orange-300 to-amber-400 shadow-md"></div>
              <span className="text-sm font-semibold text-gray-700">Medium Stall</span>
              <span className="text-xs text-gray-500">Standard size</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-12 h-12 rounded-xl border-2 border-red-500 bg-gradient-to-br from-red-300 to-rose-400 shadow-md"></div>
              <span className="text-sm font-semibold text-gray-700">Large Stall</span>
              <span className="text-xs text-gray-500">Spacious area</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-12 h-12 rounded-xl border-4 border-sky-600 bg-gradient-to-br from-sky-500 to-cyan-400 shadow-lg ring-2 ring-sky-300"></div>
              <span className="text-sm font-semibold text-gray-700">Selected</span>
              <span className="text-xs text-gray-500">Your choice</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-12 h-12 rounded-xl border-2 border-gray-400 bg-gradient-to-br from-gray-300 to-gray-400 opacity-60"></div>
              <span className="text-sm font-semibold text-gray-700">Reserved</span>
              <span className="text-xs text-gray-500">Unavailable</span>
            </div>
          </div>
        </div>

        {/* Map or Grid View */}
        {viewMode === 'map' ? (
          <div className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl mb-6 shadow-2xl border border-white/30 overflow-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-lg flex items-center justify-center text-white text-sm">🗺️</span>
                Exhibition Floor Plan
              </h3>
              <div className="text-sm text-gray-600">
                {availableInSelectedHall} stalls available in {selectedHall === 'all' ? 'all halls' : `Hall ${selectedHall}`}
              </div>
            </div>
            <div className="relative w-full bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50 rounded-2xl border-2 border-gray-200" style={{ minHeight: '700px', aspectRatio: '16/9' }}>
              {/* Hall Backgrounds */}
              {halls.map((hall) => {
                const layout = hallLayouts[hall.name];
                if (!layout) return null;
                const hallStalls = stalls.filter(s => s.hall === hall.name);
                const isFiltered = selectedHall !== 'all' && selectedHall !== hall.name;
                const hallColor = getHallColorStyle(hall.name);
                
                return (
                  <div
                    key={hall.id}
                    className={`absolute rounded-2xl border-2 border-dashed backdrop-blur-sm transition-all duration-300 ${
                      isFiltered ? 'opacity-20' : 'opacity-50'
                    }`}
                    style={{
                      left: `${layout.x}%`,
                      top: `${layout.y}%`,
                      width: `${layout.width}%`,
                      height: `${layout.height}%`,
                      background: `linear-gradient(135deg, ${hallColor}30, ${hallColor}15)`,
                      borderColor: selectedHall === hall.name || selectedHall === 'all' ? `${hallColor}CC` : 'rgba(156, 163, 175, 0.3)'
                    }}
                  >
                    <div className="absolute -top-8 left-2 flex items-center gap-2 z-30">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border-2 border-white"
                        style={{ backgroundColor: hallColor }}
                      >
                        <span className="text-white font-bold text-base">{hall.name}</span>
                      </div>
                      <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-gray-200">
                        <span className="text-xs font-bold text-gray-700">Hall {hall.name}</span>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          {hallStalls.filter(s => !s.reserved).length} available
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Stalls positioned on map */}
              {filteredStalls
                .filter(stall => !searchQuery || stall.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((stall) => {
                if (!stall.x || !stall.y) return null;
                const isSelected = selectedStalls.find(s => s.id === stall.id);
                const stallSize = stall.size === 'small' ? 'w-7 h-7 md:w-9 md:h-9' : stall.size === 'medium' ? 'w-8 h-8 md:w-11 md:h-11' : 'w-9 h-9 md:w-13 md:h-13';
                
                return (
                  <div
                    key={stall.id}
                    className={`absolute border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 text-[9px] md:text-xs font-bold z-20 ${stallSize} ${
                      stall.reserved
                        ? 'border-gray-400 bg-gradient-to-br from-gray-300 to-gray-400 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'border-4 border-sky-600 bg-gradient-to-br from-sky-500 to-cyan-400 text-white scale-125 shadow-2xl ring-2 ring-sky-300'
                        : stall.size === 'small'
                        ? 'bg-gradient-to-br from-green-300 to-emerald-400 border-green-500 hover:scale-125 hover:shadow-lg hover:z-30'
                        : stall.size === 'medium'
                        ? 'bg-gradient-to-br from-orange-300 to-amber-400 border-orange-500 hover:scale-125 hover:shadow-lg hover:z-30'
                        : 'bg-gradient-to-br from-red-300 to-rose-400 border-red-500 hover:scale-125 hover:shadow-lg hover:z-30'
                    }`}
                    style={{
                      left: `${stall.x}%`,
                      top: `${stall.y}%`,
                    }}
                    onClick={() => handleStallClick(stall)}
                    title={`Stall ${stall.name} - ${getStallSizeLabel(stall.size)} - Hall ${stall.hall}`}
                  >
                    {stall.reserved ? (
                      <span className="text-[10px]">🔒</span>
                    ) : isSelected ? (
                      <span className="text-[10px] md:text-xs">{stall.name}</span>
                    ) : (
                      <span className="text-[10px] md:text-xs">{stall.name}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : selectedHall === 'all' ? (
          <div className="space-y-6">
            {halls.map((hall) => {
              const hallStalls = stallsByHall[hall.name] || [];
              if (hallStalls.length === 0) return null;
              
              return (
                <div key={hall.id} className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-white/30">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: getHallColorStyle(hall.name) }}
                      >
                        <span className="text-2xl font-bold text-white">{hall.name}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 m-0">Hall {hall.name}</h3>
                        <p className="text-sm text-gray-600 m-0">
                          {hallStalls.filter(s => !s.reserved).length} available • {hallStalls.length} total stalls
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setSelectedHall(hall.name); setViewMode('grid'); }}
                      className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
                    {hallStalls
                      .filter(stall => !searchQuery || stall.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .slice(0, 20)
                      .map((stall) => (
                      <div
                        key={stall.id}
                        className={getStallClasses(stall)}
                        onClick={() => handleStallClick(stall)}
                        title={`Stall ${stall.name} - ${getStallSizeLabel(stall.size)}`}
                      >
                        {stall.reserved && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl opacity-50">🔒</span>
                          </div>
                        )}
                        {selectedStalls.find(s => s.id === stall.id) && (
                          <div className="absolute top-1 right-1 bg-sky-600 rounded-full w-5 h-5 flex items-center justify-center">
                            <span className="text-xs text-white">✓</span>
                          </div>
                        )}
                        <span className="font-bold text-sm z-10">{stall.name}</span>
                        <span className="text-xs font-semibold mt-0.5 z-10 flex items-center gap-1">
                          {getStallIcon(stall.size)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {hallStalls.length > 20 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => { setSelectedHall(hall.name); setViewMode('grid'); }}
                        className="text-sky-600 font-semibold hover:text-sky-700 flex items-center justify-center gap-2"
                      >
                        View all {hallStalls.length} stalls in Hall {hall.name} →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-white/30 overflow-x-auto">
            <div className="flex items-center gap-4 mb-6">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: getHallColorStyle(selectedHall) }}
              >
                <span className="text-2xl font-bold text-white">{selectedHall}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 m-0">Hall {selectedHall}</h3>
                <p className="text-sm text-gray-600 m-0">
                  {filteredStalls.filter(s => !s.reserved).length} available stalls out of {filteredStalls.length} total
                </p>
              </div>
              <button
                onClick={() => setSelectedHall('all')}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all"
              >
                ← Back to All Halls
              </button>
            </div>
            <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3 min-w-fit mx-auto">
              {filteredStalls
                .filter(stall => !searchQuery || stall.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((stall) => (
                <div
                  key={stall.id}
                  className={getStallClasses(stall)}
                  onClick={() => handleStallClick(stall)}
                  title={`Stall ${stall.name} - ${getStallSizeLabel(stall.size)}`}
                >
                  {stall.reserved && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl opacity-50">🔒</span>
                    </div>
                  )}
                  {selectedStalls.find(s => s.id === stall.id) && (
                    <div className="absolute top-1 right-1 bg-sky-600 rounded-full w-5 h-5 flex items-center justify-center">
                      <span className="text-xs text-white">✓</span>
                    </div>
                  )}
                  <span className="font-bold text-sm z-10">{stall.name}</span>
                  <span className="text-xs font-semibold mt-0.5 z-10 flex items-center gap-1">
                    {getStallIcon(stall.size)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Stalls Summary - Enhanced */}
        <div className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl mb-6 shadow-2xl border border-white/30 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📋</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 m-0">Selected Stalls</h3>
                <p className="text-sm text-gray-600 m-0">Review your selections before confirming</p>
              </div>
            </div>
            <div className={`px-5 py-2.5 rounded-xl text-lg font-bold ${
              selectedStalls.length === 0 
                ? 'bg-gray-200 text-gray-600' 
                : selectedStalls.length >= 3
                ? 'bg-red-100 text-red-600'
                : 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg'
            }`}>
              {selectedStalls.length}/3
            </div>
          </div>
          {selectedStalls.length === 0 ? (
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">👆</span>
              </div>
              <p className="text-gray-400 font-semibold text-lg mb-2">No stalls selected yet</p>
              <p className="text-gray-400 text-sm">Click on available stalls above to select them</p>
              <p className="text-gray-400 text-xs mt-2">You can select up to 3 stalls for your business</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedStalls.map((stall, index) => (
                <div 
                  key={stall.id} 
                  className="group p-6 bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50 rounded-2xl border-2 border-sky-200 hover:border-sky-400 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: getHallColorStyle(stall.hall) }}
                        >
                          <span className="text-white font-bold text-xl">{stall.hall}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-xl text-gray-800">Stall {stall.name}</span>
                            <span className="px-2 py-0.5 bg-white rounded-md text-xs font-semibold text-gray-600 border border-gray-200">
                              #{index + 1}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span>Hall {stall.hall}</span>
                            <span>•</span>
                            <span className="px-2 py-1 bg-white rounded-md text-xs font-semibold border border-gray-200">
                              {getStallSizeLabel(stall.size)}
                            </span>
                            <span>•</span>
                            <span className="text-2xl">{getStallIcon(stall.size)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="px-5 py-2.5 bg-red-500 text-white border-none rounded-xl cursor-pointer text-sm font-semibold transition-all duration-200 hover:bg-red-600 hover:scale-105 shadow-md flex items-center gap-2"
                      onClick={() => handleStallClick(stall)}
                    >
                      <span>🗑️</span> Remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                <p className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-lg">💡</span>
                  <span>
                    <strong>Tip:</strong> You can select up to 3 stalls. Once confirmed, you'll receive a confirmation email with QR codes for each reserved stall.
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <button
            className="px-8 py-4 bg-white/90 backdrop-blur-xl text-sky-700 border-2 border-sky-300 rounded-xl text-base font-bold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            onClick={() => navigate('/vendor/dashboard')}
          >
            <span>←</span> Back to Dashboard
          </button>
          <button
            className="px-8 py-4 bg-gradient-to-r from-sky-600 to-cyan-500 text-white border-none rounded-xl text-base font-bold cursor-pointer transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            onClick={() => setShowConfirmModal(true)}
            disabled={selectedStalls.length === 0}
          >
            <span>✨</span> Confirm Reservation
          </button>
        </div>
      </div>

      {/* Enhanced Confirmation Modal */}
      {showConfirmModal && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] backdrop-blur-sm animate-fade-in"
          onClick={() => setShowConfirmModal(false)}
        >
          <div 
            className="bg-white p-8 rounded-3xl max-w-2xl w-[90%] shadow-2xl border border-gray-200 transform animate-scale-in max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-4xl">✅</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 m-0 mb-2">Confirm Your Reservation</h3>
              <p className="text-gray-600">Please review your selected stalls before confirming</p>
            </div>
            
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              {selectedStalls.map((stall, index) => (
                <div key={stall.id} className="p-5 bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl border-2 border-sky-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md"
                      style={{ backgroundColor: getHallColorStyle(stall.hall) }}
                    >
                      <span className="text-white font-bold text-lg">{stall.hall}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <strong className="text-gray-800 text-lg">Stall {stall.name}</strong>
                        <span className="px-2 py-0.5 bg-white rounded-md text-xs font-semibold text-gray-600">
                          Selection #{index + 1}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <span>Hall {stall.hall}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 bg-white rounded-md text-xs font-semibold border border-gray-200">
                          {getStallSizeLabel(stall.size)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-3xl">{getStallIcon(stall.size)}</span>
                </div>
              ))}
            </div>
            
            <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-l-4 border-blue-500 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl text-white">📧</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">What happens next?</h4>
                  <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                    <li>A confirmation email will be sent to your registered email address</li>
                    <li>Each reserved stall will have a unique <strong>QR code</strong></li>
                    <li>The QR code acts as your pass to enter the exhibition premises</li>
                    <li>You can download and print the QR codes from the email</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-end">
              <button
                className="px-6 py-3 bg-gray-100 text-gray-700 border-2 border-gray-300 rounded-xl text-base font-semibold cursor-pointer transition-all duration-200 hover:bg-gray-200 disabled:opacity-50"
                onClick={() => setShowConfirmModal(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="px-8 py-3 bg-gradient-to-r from-sky-600 to-cyan-500 text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={handleConfirmReservation}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⏳</span> Processing...
                  </>
                ) : (
                  <>
                    <span>✓</span> Confirm Reservation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Reservations;
