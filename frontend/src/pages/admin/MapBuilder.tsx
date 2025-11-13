import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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

interface Stall {
  id: string;
  name: string;
  hallId: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  positionX: number; // percentage within hall
  positionY: number; // percentage within hall
  row?: number;
  col?: number;
  isAvailable: boolean;
}

const MAP_STORAGE_KEY = 'exhibition_map_data';

function MapBuilder() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [selectedHall, setSelectedHall] = useState<string | null>(null);
  const [selectedStall, setSelectedStall] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isCreatingHall, setIsCreatingHall] = useState(false);
  const [hallStartPos, setHallStartPos] = useState({ x: 0, y: 0 });
  const [hallEndPos, setHallEndPos] = useState({ x: 0, y: 0 });
  const [isDrawingHall, setIsDrawingHall] = useState(false);
  const [showHallForm, setShowHallForm] = useState(false);
  const [showStallForm, setShowStallForm] = useState(false);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);
  const [editingStall, setEditingStall] = useState<Stall | null>(null);
  
  // Form states
  const [hallForm, setHallForm] = useState({
    name: '',
    rows: 5,
    cols: 5,
    color: '#9333ea'
  });
  
  const [stallForm, setStallForm] = useState({
    name: '',
    size: 'SMALL' as 'SMALL' | 'MEDIUM' | 'LARGE',
    hallId: ''
  });

  // Load saved map data
  useEffect(() => {
    const savedData = localStorage.getItem(MAP_STORAGE_KEY);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setHalls(data.halls || []);
        setStalls(data.stalls || []);
      } catch (error) {
        console.error('Error loading map data:', error);
      }
    }
  }, []);

  // Save map data
  const saveMapData = () => {
    const data = {
      halls,
      stalls
    };
    localStorage.setItem(MAP_STORAGE_KEY, JSON.stringify(data));
    alert('Map saved successfully!');
  };

  // Handle canvas mouse down for creating hall
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCreatingHall || !canvasRef.current) return;
    e.preventDefault();
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setHallStartPos({ x, y });
    setHallEndPos({ x, y });
    setIsDrawingHall(true);
  };

  // Handle canvas mouse move for drawing hall
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawingHall || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setHallEndPos({ x, y });
  };

  // Handle canvas mouse up for finishing hall creation
  const handleCanvasMouseUp = () => {
    if (!isDrawingHall) return;
    
    const width = Math.abs(hallEndPos.x - hallStartPos.x);
    const height = Math.abs(hallEndPos.y - hallStartPos.y);
    
    if (width > 5 && height > 5) {
      const newHall: Hall = {
        id: `hall-${Date.now()}`,
        name: hallForm.name || `Hall ${halls.length + 1}`,
        positionX: Math.min(hallEndPos.x, hallStartPos.x),
        positionY: Math.min(hallEndPos.y, hallStartPos.y),
        width,
        height,
        rows: hallForm.rows,
        cols: hallForm.cols,
        color: hallForm.color
      };
      
      setHalls([...halls, newHall]);
      setIsCreatingHall(false);
      setIsDrawingHall(false);
      setHallStartPos({ x: 0, y: 0 });
      setHallEndPos({ x: 0, y: 0 });
      setShowHallForm(false);
      setHallForm({ name: '', rows: 5, cols: 5, color: '#9333ea' });
    } else {
      setIsDrawingHall(false);
      setHallStartPos({ x: 0, y: 0 });
      setHallEndPos({ x: 0, y: 0 });
    }
  };

  // Handle hall drag
  const handleHallMouseDown = (e: React.MouseEvent, hallId: string) => {
    e.stopPropagation();
    setSelectedHall(hallId);
    setIsDragging(true);
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDragStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !selectedHall || !canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const currentX = ((e.clientX - rect.left) / rect.width) * 100;
      const currentY = ((e.clientY - rect.top) / rect.height) * 100;
      
      setHalls(halls.map(hall => {
        if (hall.id === selectedHall) {
          return {
            ...hall,
            positionX: Math.max(0, Math.min(100 - hall.width, currentX)),
            positionY: Math.max(0, Math.min(100 - hall.height, currentY))
          };
        }
        return hall;
      }));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setSelectedHall(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, selectedHall, halls]);

  // Generate stalls for a hall
  const generateStallsForHall = (hall: Hall) => {
    const newStalls: Stall[] = [];
    const stallWidth = 100 / hall.cols;
    const stallHeight = 100 / hall.rows;
    
    for (let row = 0; row < hall.rows; row++) {
      for (let col = 0; col < hall.cols; col++) {
        const stallNumber = (row * hall.cols + col + 1).toString().padStart(2, '0');
        const stall: Stall = {
          id: `stall-${hall.id}-${stallNumber}`,
          name: `${hall.name}${stallNumber}`,
          hallId: hall.id,
          size: 'SMALL',
          positionX: col * stallWidth + stallWidth / 2,
          positionY: row * stallHeight + stallHeight / 2,
          row,
          col,
          isAvailable: true
        };
        newStalls.push(stall);
      }
    }
    
    setStalls([...stalls.filter(s => s.hallId !== hall.id), ...newStalls]);
  };

  // Handle stall click
  const handleStallClick = (e: React.MouseEvent, stallId: string) => {
    e.stopPropagation();
    const stall = stalls.find(s => s.id === stallId);
    if (stall) {
      setEditingStall(stall);
      setStallForm({
        name: stall.name,
        size: stall.size,
        hallId: stall.hallId
      });
      setShowStallForm(true);
    }
  };

  // Delete hall
  const handleDeleteHall = (hallId: string) => {
    if (confirm('Are you sure you want to delete this hall? All stalls will be deleted.')) {
      setHalls(halls.filter(h => h.id !== hallId));
      setStalls(stalls.filter(s => s.hallId !== hallId));
    }
  };

  // Delete stall
  const handleDeleteStall = (stallId: string) => {
    setStalls(stalls.filter(s => s.id !== stallId));
    setShowStallForm(false);
  };

  // Save stall changes
  const handleSaveStall = () => {
    if (!editingStall) return;
    
    setStalls(stalls.map(s => {
      if (s.id === editingStall.id) {
        return {
          ...s,
          name: stallForm.name,
          size: stallForm.size
        };
      }
      return s;
    }));
    
    setShowStallForm(false);
    setEditingStall(null);
  };

  // Save hall changes
  const handleSaveHall = () => {
    if (!editingHall) return;
    
    setHalls(halls.map(h => {
      if (h.id === editingHall.id) {
        return {
          ...h,
          name: hallForm.name,
          rows: hallForm.rows,
          cols: hallForm.cols,
          color: hallForm.color
        };
      }
      return h;
    }));
    
    // Regenerate stalls if rows/cols changed
    const updatedHall = halls.find(h => h.id === editingHall.id);
    if (updatedHall && (updatedHall.rows !== hallForm.rows || updatedHall.cols !== hallForm.cols)) {
      const hall = halls.find(h => h.id === editingHall.id);
      if (hall) {
        generateStallsForHall({ ...hall, rows: hallForm.rows, cols: hallForm.cols });
      }
    }
    
    setShowHallForm(false);
    setEditingHall(null);
  };

  // Edit hall
  const handleEditHall = (hall: Hall) => {
    setEditingHall(hall);
    setHallForm({
      name: hall.name,
      rows: hall.rows,
      cols: hall.cols,
      color: hall.color
    });
    setShowHallForm(true);
  };

  const getStallColor = (size: string) => {
    switch (size) {
      case 'SMALL': return 'bg-green-400';
      case 'MEDIUM': return 'bg-orange-400';
      case 'LARGE': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl px-4 md:px-8 py-5 flex flex-col md:flex-row justify-between items-center shadow-xl border-b border-white/20 z-50">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-bold">📚</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent m-0">
              Colombo International Bookfair
            </h1>
            <p className="text-xs md:text-sm text-gray-600 m-0 font-medium">Admin Portal - Map Builder</p>
          </div>
        </div>
        <div className="flex gap-2 md:gap-3 w-full md:w-auto justify-center md:justify-end">
          <button 
            className="px-6 py-2.5 bg-white/80 backdrop-blur-sm text-gray-700 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-white hover:shadow-md transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            onClick={() => navigate('/vendor/reservations')}
          >
            <span>👁️</span> View Map
          </button>
          <button 
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            onClick={saveMapData}
          >
            <span>💾</span> Save Map
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
            Map Builder
          </h2>
          <p className="text-lg md:text-xl opacity-95 font-medium">
            Create and customize your exhibition hall layout
          </p>
        </div>

        {/* Controls Panel */}
        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl mb-6 shadow-2xl border border-white/30">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsCreatingHall(true);
                  setShowHallForm(true);
                  setHallStartPos({ x: 0, y: 0 });
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <span>➕</span> Create Hall
              </button>
              <button
                onClick={() => {
                  const hallId = prompt('Enter Hall ID to generate stalls:');
                  const hall = halls.find(h => h.id === hallId || h.name === hallId);
                  if (hall) {
                    generateStallsForHall(hall);
                    alert(`Generated ${hall.rows * hall.cols} stalls for ${hall.name}`);
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <span>⚡</span> Generate Stalls
              </button>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              <span className="mr-4">Halls: {halls.length}</span>
              <span>Stalls: {stalls.length}</span>
            </div>
          </div>
        </div>

        {/* Map Canvas */}
        <div className="bg-white/95 backdrop-blur-xl p-6 md:p-8 rounded-3xl mb-6 shadow-2xl border border-white/30">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span>🎨</span> Map Canvas
            </h3>
            {isCreatingHall && (
              <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-semibold">
                Click and drag on canvas to create a hall
              </div>
            )}
          </div>
          <div
            ref={canvasRef}
            className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300"
            style={{ 
              minHeight: '700px', 
              aspectRatio: '16/9',
              cursor: isCreatingHall ? 'crosshair' : 'default'
            }}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          >
            {/* Preview rectangle while drawing */}
            {isDrawingHall && hallStartPos.x > 0 && hallStartPos.y > 0 && (
              <div
                className="absolute border-2 border-purple-500 border-dashed bg-purple-200 opacity-30"
                style={{
                  left: `${Math.min(hallEndPos.x, hallStartPos.x)}%`,
                  top: `${Math.min(hallEndPos.y, hallStartPos.y)}%`,
                  width: `${Math.abs(hallEndPos.x - hallStartPos.x)}%`,
                  height: `${Math.abs(hallEndPos.y - hallStartPos.y)}%`
                }}
              />
            )}
            {/* Halls */}
            {halls.map((hall) => (
              <div
                key={hall.id}
                className={`absolute rounded-xl border-2 transition-all duration-200 ${
                  selectedHall === hall.id
                    ? 'border-purple-600 shadow-2xl ring-4 ring-purple-300'
                    : 'border-gray-400 hover:border-purple-400'
                }`}
                style={{
                  left: `${hall.positionX}%`,
                  top: `${hall.positionY}%`,
                  width: `${hall.width}%`,
                  height: `${hall.height}%`,
                  background: `linear-gradient(135deg, ${hall.color}40, ${hall.color}20)`,
                  cursor: 'move'
                }}
                onMouseDown={(e) => handleHallMouseDown(e, hall.id)}
              >
                {/* Hall Label */}
                <div className="absolute -top-8 left-0 flex items-center gap-2">
                  <div
                    className="px-3 py-1 rounded-lg text-white text-sm font-bold shadow-lg"
                    style={{ backgroundColor: hall.color }}
                  >
                    {hall.name}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditHall(hall);
                      }}
                      className="w-6 h-6 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                      title="Edit Hall"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteHall(hall.id);
                      }}
                      className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      title="Delete Hall"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {/* Stalls within hall */}
                {stalls
                  .filter(s => s.hallId === hall.id)
                  .map((stall) => {
                    const absoluteX = hall.positionX + (stall.positionX / 100) * hall.width;
                    const absoluteY = hall.positionY + (stall.positionY / 100) * hall.height;
                    
                    return (
                      <div
                        key={stall.id}
                        className={`absolute w-3 h-3 md:w-4 md:h-4 rounded border border-gray-600 cursor-pointer hover:scale-150 transition-all ${
                          getStallColor(stall.size)
                        } ${selectedStall === stall.id ? 'ring-2 ring-purple-600' : ''}`}
                        style={{
                          left: `${stall.positionX}%`,
                          top: `${stall.positionY}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        onClick={(e) => handleStallClick(e, stall.id)}
                        title={`${stall.name} - ${stall.size}`}
                      />
                    );
                  })}
              </div>
            ))}
          </div>
        </div>

        {/* Halls List */}
        {halls.length > 0 && (
          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl mb-6 shadow-2xl border border-white/30">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🏛️</span> Halls ({halls.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {halls.map((hall) => {
                const hallStalls = stalls.filter(s => s.hallId === hall.id);
                return (
                  <div
                    key={hall.id}
                    className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="px-3 py-1 rounded-lg text-white text-sm font-bold"
                        style={{ backgroundColor: hall.color }}
                      >
                        {hall.name}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditHall(hall)}
                          className="w-6 h-6 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteHall(hall.id)}
                          className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      <div>Grid: {hall.rows} × {hall.cols}</div>
                      <div>Stalls: {hallStalls.length}</div>
                      <div>Position: {hall.positionX.toFixed(1)}%, {hall.positionY.toFixed(1)}%</div>
                      <div>Size: {hall.width.toFixed(1)}% × {hall.height.toFixed(1)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Hall Form Modal */}
      {showHallForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl max-w-md w-[90%] shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              {editingHall ? 'Edit Hall' : 'Create New Hall'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Hall Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                  value={hallForm.name}
                  onChange={(e) => setHallForm({ ...hallForm, name: e.target.value })}
                  placeholder="e.g., Hall A"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rows</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                    value={hallForm.rows}
                    onChange={(e) => setHallForm({ ...hallForm, rows: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Columns</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                    value={hallForm.cols}
                    onChange={(e) => setHallForm({ ...hallForm, cols: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                <input
                  type="color"
                  className="w-full h-12 border-2 border-gray-200 rounded-xl cursor-pointer"
                  value={hallForm.color}
                  onChange={(e) => setHallForm({ ...hallForm, color: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
                onClick={() => {
                  setShowHallForm(false);
                  setIsCreatingHall(false);
                  setEditingHall(null);
                }}
              >
                Cancel
              </button>
              {editingHall ? (
                <button
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg"
                  onClick={handleSaveHall}
                >
                  Save Changes
                </button>
              ) : (
                <button
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-lg"
                  onClick={() => {
                    setIsCreatingHall(true);
                    setHallStartPos({ x: 0, y: 0 });
                    setHallEndPos({ x: 0, y: 0 });
                    setShowHallForm(false);
                  }}
                >
                  Start Drawing
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stall Form Modal */}
      {showStallForm && editingStall && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl max-w-md w-[90%] shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Edit Stall</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stall Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                  value={stallForm.name}
                  onChange={(e) => setStallForm({ ...stallForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Size</label>
                <select
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
                  value={stallForm.size}
                  onChange={(e) => setStallForm({ ...stallForm, size: e.target.value as 'SMALL' | 'MEDIUM' | 'LARGE' })}
                >
                  <option value="SMALL">Small</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LARGE">Large</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600"
                onClick={() => {
                  handleDeleteStall(editingStall.id);
                }}
              >
                Delete
              </button>
              <button
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200"
                onClick={() => {
                  setShowStallForm(false);
                  setEditingStall(null);
                }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg"
                onClick={handleSaveStall}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapBuilder;

