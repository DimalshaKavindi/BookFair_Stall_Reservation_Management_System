import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Stall {
  id: string;
  name: string;
  size: 'small' | 'medium' | 'large';
  row: number;
  col: number;
  reserved: boolean;
  reservedBy?: string;
}

interface SelectedStall extends Stall {
  selected: boolean;
}

function Reservations() {
  const navigate = useNavigate();
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [selectedStalls, setSelectedStalls] = useState<SelectedStall[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Generate stall grid (example: 10x8 grid)
  useEffect(() => {
    const generatedStalls: Stall[] = [];
    const sizes: ('small' | 'medium' | 'large')[] = ['small', 'medium', 'large'];
    let stallCounter = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 10; col++) {
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        const reserved = Math.random() > 0.7; // 30% reserved for demo
        // Generate stall names: A, B, C, ..., Z, AA, AB, etc.
        const letterIndex = stallCounter % 26;
        const letter = String.fromCharCode(65 + letterIndex);
        const number = Math.floor(stallCounter / 26);
        const stallName = number > 0 ? `${letter}${number}` : letter;
        
        generatedStalls.push({
          id: `${row}-${col}`,
          name: stallName,
          size,
          row,
          col,
          reserved,
          reservedBy: reserved ? 'Vendor ' + Math.floor(Math.random() * 10) : undefined
        });
        stallCounter++;
      }
    }
    setStalls(generatedStalls);
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
      
      // In real implementation, this would:
      // 1. Send reservation to backend API
      // 2. Backend generates QR code
      // 3. Backend sends confirmation email with QR code
      // 4. Navigate to dashboard
      
      alert('Reservation confirmed! A confirmation email with QR code will be sent to your registered email address.');
      navigate('/vendor/dashboard');
    }, 1500);
  };

  const getStallClasses = (stall: Stall) => {
    const isSelected = selectedStalls.find(s => s.id === stall.id);
    
    if (stall.reserved) {
      return 'aspect-square min-w-[60px] md:min-w-[80px] border-2 border-gray-400 rounded-lg flex flex-col items-center justify-center cursor-not-allowed transition-all p-2 bg-gray-300 opacity-60';
    }
    
    if (isSelected) {
      return 'aspect-square min-w-[60px] md:min-w-[80px] border-2 border-indigo-600 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all p-2 bg-indigo-500 text-white scale-105 shadow-lg';
    }
    
    const sizeColors = {
      small: 'bg-green-200 border-green-400',
      medium: 'bg-orange-200 border-orange-400',
      large: 'bg-red-200 border-red-400'
    };
    
    return `aspect-square min-w-[60px] md:min-w-[80px] border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all p-2 hover:scale-105 hover:shadow-md ${sizeColors[stall.size]}`;
  };

  const getStallSizeLabel = (size: string) => {
    return size.charAt(0).toUpperCase() + size.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600">
      <nav className="bg-white/95 backdrop-blur-md px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center shadow-lg sticky top-0 z-50 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 m-0">Colombo International Bookfair</h1>
          <p className="text-xs md:text-sm text-gray-600 m-0">Vendor Portal</p>
        </div>
        <div className="flex gap-2 md:gap-4 w-full md:w-auto justify-center md:justify-end">
          <button 
            className="px-6 py-2 border-none bg-transparent text-gray-600 rounded-lg text-base cursor-pointer transition-all hover:bg-gray-100 hover:text-gray-800"
            onClick={() => navigate('/vendor/dashboard')}
          >
            Dashboard
          </button>
          <button 
            className="px-6 py-2 border-none bg-indigo-500 text-white rounded-lg text-base cursor-pointer transition-all hover:bg-indigo-600"
            onClick={() => navigate('/vendor/reservations')}
          >
            Reservations
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="text-center text-white mb-6 md:mb-8">
          <h2 className="text-3xl md:text-4xl font-bold m-0 mb-2 drop-shadow-lg">Stall Reservation</h2>
          <p className="text-base md:text-lg opacity-90">Select up to 3 stalls for your business. Click on available stalls to select them.</p>
        </div>

        <div className="bg-white p-6 rounded-xl mb-8 flex gap-8 flex-wrap justify-center shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md border-2 border-gray-300 bg-green-200"></div>
            <span className="text-gray-700">Small Stall</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md border-2 border-gray-300 bg-orange-200"></div>
            <span className="text-gray-700">Medium Stall</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md border-2 border-gray-300 bg-red-200"></div>
            <span className="text-gray-700">Large Stall</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md border-2 border-indigo-500 bg-indigo-500"></div>
            <span className="text-gray-700">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md border-2 border-gray-400 bg-gray-300"></div>
            <span className="text-gray-700">Reserved</span>
          </div>
        </div>

        <div className="bg-white p-4 md:p-8 rounded-2xl mb-8 shadow-2xl overflow-x-auto">
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2 min-w-fit mx-auto">
            {stalls.map((stall) => (
              <div
                key={stall.id}
                className={getStallClasses(stall)}
                onClick={() => handleStallClick(stall)}
                title={`Stall ${stall.name} - ${getStallSizeLabel(stall.size)}`}
              >
                <span className="font-semibold text-sm">{stall.name}</span>
                <span className="text-xs opacity-80 mt-1">{getStallSizeLabel(stall.size)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl mb-8 shadow-2xl">
          <h3 className="text-xl font-semibold m-0 mb-4 text-gray-800">Selected Stalls ({selectedStalls.length}/3)</h3>
          {selectedStalls.length === 0 ? (
            <p className="text-gray-400 italic py-4 text-center">No stalls selected yet. Click on available stalls to select them.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {selectedStalls.map((stall) => (
                <div key={stall.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <div className="flex items-center gap-2">
                    <strong className="text-gray-800">Stall {stall.name}</strong>
                    <span className="inline-block px-3 py-1 bg-indigo-500 text-white rounded-xl text-xs">{getStallSizeLabel(stall.size)}</span>
                  </div>
                  <button
                    className="px-4 py-2 bg-red-500 text-white border-none rounded-lg cursor-pointer transition-colors hover:bg-red-600"
                    onClick={() => handleStallClick(stall)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            className="px-6 md:px-8 py-3 bg-white text-indigo-500 border-2 border-indigo-500 rounded-lg text-base font-semibold cursor-pointer transition-all hover:bg-gray-50"
            onClick={() => navigate('/vendor/dashboard')}
          >
            Back to Dashboard
          </button>
          <button
            className="px-6 md:px-8 py-3 bg-indigo-500 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all shadow-md hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setShowConfirmModal(true)}
            disabled={selectedStalls.length === 0}
          >
            Confirm Reservation
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm"
          onClick={() => setShowConfirmModal(false)}
        >
          <div 
            className="bg-white p-8 rounded-2xl max-w-md w-[90%] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-semibold m-0 mb-4 text-gray-800">Confirm Reservation</h3>
            <p className="text-gray-700 mb-4">You are about to reserve the following stalls:</p>
            <ul className="list-none p-0 m-4">
              {selectedStalls.map((stall) => (
                <li key={stall.id} className="p-3 bg-gray-50 rounded-lg mb-2">
                  <strong className="text-gray-800">Stall {stall.name}</strong> - {getStallSizeLabel(stall.size)}
                </li>
              ))}
            </ul>
            <p className="text-gray-600 text-sm leading-relaxed m-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              Once confirmed, a confirmation email with a unique QR code will be sent to your registered email address. 
              This QR code will act as your pass to enter the exhibition premises.
            </p>
            <div className="flex gap-4 justify-end mt-6">
              <button
                className="px-6 py-2 bg-white text-indigo-500 border-2 border-indigo-500 rounded-lg text-base font-semibold cursor-pointer transition-all hover:bg-gray-50 disabled:opacity-50"
                onClick={() => setShowConfirmModal(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-indigo-500 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all shadow-md hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleConfirmReservation}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Confirm Reservation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reservations;
