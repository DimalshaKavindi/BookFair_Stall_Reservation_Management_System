import { useState, useEffect } from 'react';
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
  // Map data is loaded from local storage at runtime

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
    
    // Simulate API call
    setTimeout(() => {
      // Update stalls to reserved
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
        <div className="flex gap-2 md:gap-3 w-full md:w-auto justify-center md:justify-end mt-4 md:mt-0">
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
        </div>
      </nav>

      <div className="relative max-w-7xl mx-auto p-4 md:p-8 z-10 pt-24 md:pt-28">
        {/* Header */}
        <div className="text-center text-white mb-8 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
              <span className="text-4xl">🗺️</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold m-0 mb-3 drop-shadow-2xl">
            Sirimavo Bandaranayake Exhibition Center
          </h2>
          <p className="text-lg md:text-xl opacity-95 font-medium">
            Select up to 3 stalls for your business
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full">
            <span className="text-2xl">🎯</span>
            <span className="text-sm font-semibold">Maximum 3 stalls per business</span>
          </div>
        </div>

        {/* Hall Filter */}
        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl mb-6 shadow-2xl border border-white/30">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🏛️</span> Select Hall
          </h3>
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
                      ? `bg-gradient-to-r from-[${hall.color}] to-[${hall.color}] text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={selectedHall === hall.name ? { backgroundColor: hallColor } : {}}
                >
                  <span className="font-bold">Hall {hall.name}</span>
                  <span className="text-xs opacity-75">({availableCount} available)</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl mb-6 shadow-2xl border border-white/30 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>👁️</span> View Mode
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('map')}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>🗺️</span> Map View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>📋</span> Grid View
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl mb-6 shadow-2xl border border-white/30">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🔍</span> Legend
          </h3>
          <div className="flex flex-wrap gap-6 justify-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border-2 border-green-500 bg-gradient-to-br from-green-300 to-emerald-400 shadow-md"></div>
              <span className="text-gray-700 font-medium">Small Stall</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border-2 border-orange-500 bg-gradient-to-br from-orange-300 to-amber-400 shadow-md"></div>
              <span className="text-gray-700 font-medium">Medium Stall</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border-2 border-red-500 bg-gradient-to-br from-red-300 to-rose-400 shadow-md"></div>
              <span className="text-gray-700 font-medium">Large Stall</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border-4 border-sky-600 bg-gradient-to-br from-sky-500 to-cyan-400 shadow-lg ring-2 ring-sky-300"></div>
              <span className="text-gray-700 font-medium">Selected</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border-2 border-gray-400 bg-gradient-to-br from-gray-300 to-gray-400 opacity-60"></div>
              <span className="text-gray-700 font-medium">Reserved</span>
            </div>
          </div>
        </div>

        {/* Map or Grid View */}
        {viewMode === 'map' ? (
          <div className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl mb-6 shadow-2xl border border-white/30 overflow-auto">
            <div className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl" style={{ minHeight: '700px', aspectRatio: '16/9' }}>
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
                      isFiltered ? 'opacity-20' : 'opacity-40'
                    }`}
                    style={{
                      left: `${layout.x}%`,
                      top: `${layout.y}%`,
                      width: `${layout.width}%`,
                      height: `${layout.height}%`,
                      background: `linear-gradient(135deg, ${hallColor}40, ${hallColor}20)`,
                      borderColor: selectedHall === hall.name || selectedHall === 'all' ? `${hallColor}CC` : 'rgba(156, 163, 175, 0.3)'
                    }}
                  >
                    <div className="absolute -top-7 left-2 flex items-center gap-2 z-30">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border-2 border-white"
                        style={{ backgroundColor: hallColor }}
                      >
                        <span className="text-white font-bold text-sm">{hall.name}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-700 bg-white/95 px-3 py-1 rounded-lg shadow-md">
                        Hall {hall.name} ({hallStalls.filter(s => !s.reserved).length} available)
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Stalls positioned on map */}
              {filteredStalls.map((stall) => {
                if (!stall.x || !stall.y) return null;
                const isSelected = selectedStalls.find(s => s.id === stall.id);
                const stallSize = stall.size === 'small' ? 'w-6 h-6 md:w-8 md:h-8' : stall.size === 'medium' ? 'w-7 h-7 md:w-10 md:h-10' : 'w-8 h-8 md:w-12 md:h-12';
                
                return (
                  <div
                    key={stall.id}
                    className={`absolute border-2 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 text-[8px] md:text-xs font-bold z-20 ${stallSize} ${
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
                    title={`Stall ${stall.name} - ${getStallSizeLabel(stall.size)}`}
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
              const hallColor = getHallColorStyle(hall.name);
              
              return (
                <div key={hall.id} className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-white/30">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: hallColor }}
                      >
                        <span className="text-2xl font-bold text-white">{hall.name}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 m-0">Hall {hall.name}</h3>
                        <p className="text-sm text-gray-600 m-0">
                          {hallStalls.filter(s => !s.reserved).length} available stalls
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedHall(hall.name)}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
                    {hallStalls.slice(0, 20).map((stall) => (
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
                          <div className="absolute top-1 right-1">
                            <span className="text-xs">✓</span>
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
                        onClick={() => setSelectedHall(hall.name)}
                        className="text-sky-600 font-semibold hover:text-sky-700"
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
              <div>
                <h3 className="text-2xl font-bold text-gray-800 m-0">Hall {selectedHall}</h3>
                <p className="text-sm text-gray-600 m-0">
                  {filteredStalls.filter(s => !s.reserved).length} available stalls
                </p>
              </div>
              <button
                onClick={() => setSelectedHall('all')}
                className="ml-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all"
              >
                ← Back to All Halls
              </button>
            </div>
            <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3 min-w-fit mx-auto">
              {filteredStalls.map((stall) => (
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
                    <div className="absolute top-1 right-1">
                      <span className="text-xs">✓</span>
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

        {/* Selected Stalls Summary */}
        <div className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl mb-6 shadow-2xl border border-white/30 mt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span>📋</span> Selected Stalls
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                selectedStalls.length === 0 
                  ? 'bg-gray-200 text-gray-600' 
                  : selectedStalls.length >= 3
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gradient-to-r from-sky-600 to-cyan-500 text-white'
              }`}>
                {selectedStalls.length}/3
              </span>
            </h3>
          </div>
          {selectedStalls.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
              <span className="text-5xl mb-4 block">👆</span>
              <p className="text-gray-400 font-medium text-lg">No stalls selected yet</p>
              <p className="text-gray-400 text-sm mt-1">Click on available stalls above to select them</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedStalls.map((stall, index) => (
                <div 
                  key={stall.id} 
                  className="group p-5 bg-gradient-to-br from-sky-50 to-cyan-50 rounded-2xl border-2 border-sky-200 hover:border-sky-400 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: getHallColorStyle(stall.hall) }}
                      >
                        <span className="text-white font-bold">{stall.hall}</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-lg">Stall {stall.name}</div>
                        <div className="text-xs text-gray-500">Hall {stall.hall} • #{index + 1}</div>
                      </div>
                    </div>
                    <span className="text-2xl">{getStallIcon(stall.size)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-white rounded-lg text-xs font-semibold text-gray-700 border border-gray-200">
                      {getStallSizeLabel(stall.size)}
                    </span>
                    <button
                      className="px-4 py-2 bg-red-500 text-white border-none rounded-lg cursor-pointer text-sm font-semibold transition-all duration-200 hover:bg-red-600 hover:scale-110 shadow-md"
                      onClick={() => handleStallClick(stall)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] backdrop-blur-sm animate-fade-in"
          onClick={() => setShowConfirmModal(false)}
        >
          <div 
            className="bg-white p-8 rounded-3xl max-w-lg w-[90%] shadow-2xl border border-gray-200 transform animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 m-0 mb-2">Confirm Reservation</h3>
              <p className="text-gray-600">Review your selected stalls</p>
            </div>
            
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
              {selectedStalls.map((stall) => (
                <div key={stall.id} className="p-4 bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl border-2 border-sky-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: getHallColorStyle(stall.hall) }}
                    >
                      <span className="text-white font-bold">{stall.hall}</span>
                    </div>
                    <div>
                      <strong className="text-gray-800 text-lg">Stall {stall.name}</strong>
                      <div className="text-sm text-gray-600">Hall {stall.hall} • {getStallSizeLabel(stall.size)}</div>
                    </div>
                  </div>
                  <span className="text-2xl">{getStallIcon(stall.size)}</span>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500 mb-6">
              <p className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                <span className="text-lg">📧</span>
                <span>
                  A confirmation email with a unique <strong>QR code</strong> will be sent to your registered email address. 
                  This QR code will act as your pass to enter the exhibition premises.
                </span>
              </p>
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
                className="px-6 py-3 bg-gradient-to-r from-sky-600 to-cyan-500 text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

    </div>
  );
}

export default Reservations;
