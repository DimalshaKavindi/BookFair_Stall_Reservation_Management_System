import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface Genre {
  id: string;
  name: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [newGenre, setNewGenre] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [businessName, setBusinessName] = useState('My Business');
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [availableGenres] = useState<string[]>([
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery',
    'Romance', 'Thriller', 'Horror', 'Biography', 'History',
    'Science', 'Philosophy', 'Religion', 'Self-Help', 'Business',
    'Children\'s Books', 'Young Adult', 'Poetry', 'Drama', 'Comics'
  ]);

  // Load business name from localStorage or use default
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
    // Clear any stored data
    localStorage.removeItem('vendor_business_name');
    localStorage.removeItem('vendor_auth_token');
    // Redirect to login/home page
    navigate('/');
    // You can also show a success message or call an API to logout
  };

  const handleAddGenre = () => {
    if (newGenre.trim() && !genres.find(g => g.name.toLowerCase() === newGenre.toLowerCase())) {
      setGenres([...genres, { id: Date.now().toString(), name: newGenre }]);
      setNewGenre('');
    }
  };

  const handleRemoveGenre = (id: string) => {
    setGenres(genres.filter(g => g.id !== id));
  };

  const handleSelectFromList = (genre: string) => {
    if (!genres.find(g => g.name.toLowerCase() === genre.toLowerCase())) {
      setGenres([...genres, { id: Date.now().toString(), name: genre }]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a4f] via-[#123c8c] to-[#0f9ed6] relative overflow-hidden">
      {/* Animated background elements */}
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
            className="px-6 py-2.5 bg-gradient-to-r from-sky-600 to-cyan-500 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
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

      <div className="relative max-w-7xl mx-auto p-4 md:p-8 z-10 pt-24 md:pt-28">
        {/* Welcome Header */}
        <div className="text-center text-white mb-10 md:mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
              <span className="text-4xl">✨</span>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold m-0 mb-3 drop-shadow-2xl">
            Welcome to Your Dashboard
          </h2>
          <p className="text-lg md:text-xl bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] bg-clip-text text-transparent font-medium">
            Manage your literary genres and stall reservations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Selected Genres</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
                  {genres.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-sky-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📖</span>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Reserved Stalls</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
                  0
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏪</span>
              </div>
            </div>
          </div>
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Available Stalls</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text text-transparent">
                  Many
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 md:p-10 mb-8 shadow-2xl border border-white/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🎭</span>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 m-0">Literary Genres</h3>
              <p className="text-gray-500 text-sm m-0">Add genres you'll be displaying at the exhibition</p>
            </div>
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl text-base transition-all duration-200 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200 bg-gray-50"
                  placeholder="Enter a genre name..."
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddGenre()}
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xl">✍️</span>
              </div>
              <button 
                className="px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-400 text-white border-none rounded-xl text-base font-bold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
                onClick={handleAddGenre}
              >
                <span>➕</span> Add Genre
              </button>
            </div>

            {/* Quick Select */}
            <div className="mt-6">
              <p className="text-gray-600 mb-4 text-sm font-semibold flex items-center gap-2">
                <span>⚡</span> Quick Select Popular Genres
              </p>
              <div className="flex flex-wrap gap-3">
                {availableGenres.map((genre) => {
                  const isSelected = genres.find(g => g.name.toLowerCase() === genre.toLowerCase());
                  return (
                    <button
                      key={genre}
                      className={`px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 border-2 transform hover:scale-105 ${
                        isSelected
                          ? 'bg-gradient-to-r from-sky-500 to-cyan-400 border-transparent text-white shadow-lg'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-sky-400 hover:text-sky-600 hover:shadow-md'
                      }`}
                      onClick={() => handleSelectFromList(genre)}
                    >
                      {genre}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Genres */}
          <div className="mt-8 pt-8 border-t-2 border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span>📚</span> Your Selected Genres
                <span className="px-3 py-1 bg-gradient-to-r from-sky-500 to-cyan-400 text-white rounded-full text-sm">
                  {genres.length}
                </span>
              </h4>
            </div>
            {genres.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
                <span className="text-5xl mb-4 block">📖</span>
                <p className="text-gray-400 font-medium text-lg">No genres added yet</p>
                <p className="text-gray-400 text-sm mt-1">Add genres to get started with your exhibition setup</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {genres.map((genre, index) => (
                  <div 
                    key={genre.id} 
                    className="group flex items-center justify-between p-4 bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl border-2 border-sky-100 hover:border-sky-300 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-md">
                        <span className="text-lg">📖</span>
                      </div>
                      <span className="text-gray-800 font-semibold text-base">{genre.name}</span>
                    </div>
                    <button
                      className="w-8 h-8 bg-red-500 text-white border-none rounded-lg cursor-pointer text-lg leading-none flex items-center justify-center transition-all duration-200 hover:bg-red-600 hover:scale-110 shadow-md"
                      onClick={() => handleRemoveGenre(genre.id)}
                      aria-label={`Remove ${genre.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            className="px-8 py-4 bg-white/90 backdrop-blur-xl text-sky-700 border-2 border-sky-300 rounded-xl text-base font-bold cursor-pointer transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            onClick={() => navigate('/vendor/reservations')}
          >
            <span>👁️</span> View Reservations
          </button>
          <button
            className="px-8 py-4 bg-gradient-to-r from-sky-600 to-cyan-500 text-white border-none rounded-xl text-base font-bold cursor-pointer transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
            onClick={() => navigate('/vendor/reservations')}
          >
            <span>✨</span> Make New Reservation
          </button>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
