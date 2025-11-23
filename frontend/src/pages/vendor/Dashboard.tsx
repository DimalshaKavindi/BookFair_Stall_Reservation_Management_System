import { useEffect, useRef, useState } from 'react';
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
        <div className="absolute rounded-full top-20 left-10 w-72 h-72 bg-sky-300 mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute rounded-full top-40 right-10 w-72 h-72 bg-cyan-200 mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bg-blue-200 rounded-full -bottom-8 left-1/2 w-72 h-72 mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center justify-between px-4 py-5 border-b shadow-xl bg-white/90 backdrop-blur-xl md:px-8 md:flex-row border-white/20">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="flex items-center justify-center w-10 h-10 overflow-hidden rounded-lg shadow-lg">
            <img src="/Logo.png" alt="CIBF Logo" className="object-contain w-full h-full" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#0f9ed6] m-0">
              Colombo International Bookfair
            </h1>
            <p className="m-0 text-xs font-medium text-gray-600 md:text-sm">Vendor Portal</p>
          </div>
        </div>
        <div className="flex items-center justify-center w-full gap-2 md:gap-3 md:w-auto md:justify-end">
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
              <div className="flex items-center justify-center w-10 h-10 rounded-full shadow-md bg-gradient-to-br from-sky-500 to-cyan-400">
                <span className="text-lg font-bold text-white">
                  {businessName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden text-left md:block">
                <p className="m-0 text-sm font-semibold leading-tight text-gray-800">{businessName}</p>
                <p className="m-0 text-xs leading-tight text-gray-500">Vendor Account</p>
              </div>
              <span className={`text-gray-600 transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 z-50 w-56 mt-2 overflow-hidden bg-white border border-gray-200 shadow-2xl rounded-xl animate-fade-in">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-sky-50 to-cyan-50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-md bg-gradient-to-br from-sky-500 to-cyan-400">
                      <span className="text-xl font-bold text-white">
                        {businessName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="m-0 text-sm font-bold text-gray-800 truncate">{businessName}</p>
                      <p className="m-0 text-xs text-gray-500">Vendor Account</p>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/vendor/settings');
                    }}
                    className="flex items-center w-full gap-3 px-4 py-3 text-sm text-left text-gray-700 transition-colors duration-200 hover:bg-gray-50"
                  >
                    <span className="text-lg">⚙️</span>
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full gap-3 px-4 py-3 text-sm text-left text-red-600 transition-colors duration-200 hover:bg-red-50"
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

      <div className="relative z-10 p-4 pt-24 mx-auto max-w-7xl md:p-8 md:pt-28">
        {/* Welcome Header */}
        <div className="mb-10 text-center text-white md:mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center w-20 h-20 mx-auto shadow-2xl bg-white/20 backdrop-blur-md rounded-2xl">
              <span className="text-4xl">✨</span>
            </div>
          </div>
          <h2 className="m-0 mb-3 text-4xl font-extrabold md:text-5xl drop-shadow-2xl">
            Welcome to Your Dashboard
          </h2>
          <p className="text-lg md:text-xl bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] bg-clip-text text-transparent font-medium">
            Manage your literary genres and stall reservations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3 md:gap-6">
          <div className="p-6 transition-all duration-300 transform border shadow-xl bg-white/90 backdrop-blur-xl rounded-2xl border-white/20 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-500">Selected Genres</p>
                <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text">
                  {genres.length}
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-sky-600 to-cyan-500 rounded-xl">
                <span className="text-2xl">📖</span>
              </div>
            </div>
          </div>
          <div className="p-6 transition-all duration-300 transform border shadow-xl bg-white/90 backdrop-blur-xl rounded-2xl border-white/20 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-500">Reserved Stalls</p>
                <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text">
                  0
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl">
                <span className="text-2xl">🏪</span>
              </div>
            </div>
          </div>
          <div className="p-6 transition-all duration-300 transform border shadow-xl bg-white/90 backdrop-blur-xl rounded-2xl border-white/20 hover:shadow-2xl hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-medium text-gray-500">Available Stalls</p>
                <p className="text-3xl font-bold text-transparent bg-gradient-to-r from-sky-600 to-cyan-500 bg-clip-text">
                  Many
                </p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-green-400 to-emerald-400 rounded-xl">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="p-6 mb-8 border shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl md:p-10 border-white/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-br from-sky-600 to-cyan-500 rounded-xl">
              <span className="text-2xl">🎭</span>
            </div>
            <div>
              <h3 className="m-0 text-2xl font-bold text-gray-800 md:text-3xl">Literary Genres</h3>
              <p className="m-0 text-sm text-gray-500">Add genres you'll be displaying at the exhibition</p>
            </div>
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <div className="flex flex-col gap-4 mb-6 md:flex-row">
              <div className="relative flex-1">
                <input
                  type="text"
                  className="w-full px-5 py-4 pr-12 text-base transition-all duration-200 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-200 bg-gray-50"
                  placeholder="Enter a genre name..."
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddGenre()}
                />
                <span className="absolute text-xl transform -translate-y-1/2 right-4 top-1/2">✍️</span>
              </div>
              <button 
                className="flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white transition-all duration-200 border-none shadow-lg cursor-pointer bg-gradient-to-r from-sky-500 to-cyan-400 rounded-xl hover:shadow-xl hover:scale-105"
                onClick={handleAddGenre}
              >
                <span>➕</span> Add Genre
              </button>
            </div>

            {/* Quick Select */}
            <div className="mt-6">
              <p className="flex items-center gap-2 mb-4 text-sm font-semibold text-gray-600">
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
          <div className="pt-8 mt-8 border-t-2 border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h4 className="flex items-center gap-2 text-xl font-bold text-gray-800">
                <span>📚</span> Your Selected Genres
                <span className="px-3 py-1 text-sm text-white rounded-full bg-gradient-to-r from-sky-500 to-cyan-400">
                  {genres.length}
                </span>
              </h4>
            </div>
            {genres.length === 0 ? (
              <div className="py-12 text-center border-2 border-gray-300 border-dashed bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                <span className="block mb-4 text-5xl">📖</span>
                <p className="text-lg font-medium text-gray-400">No genres added yet</p>
                <p className="mt-1 text-sm text-gray-400">Add genres to get started with your exhibition setup</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {genres.map((genre, index) => (
                  <div 
                    key={genre.id} 
                    className="flex items-center justify-between p-4 transition-all duration-200 transform border-2 group bg-gradient-to-br from-sky-50 to-cyan-50 rounded-xl border-sky-100 hover:border-sky-300 hover:shadow-lg hover:-translate-y-1"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-md bg-gradient-to-br from-sky-500 to-cyan-400">
                        <span className="text-lg">📖</span>
                      </div>
                      <span className="text-base font-semibold text-gray-800">{genre.name}</span>
                    </div>
                    <button
                      className="flex items-center justify-center w-8 h-8 text-lg leading-none text-white transition-all duration-200 bg-red-500 border-none rounded-lg shadow-md cursor-pointer hover:bg-red-600 hover:scale-110"
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
        <div className="flex flex-col justify-center gap-4 md:flex-row">
          <button
            className="flex items-center justify-center gap-2 px-8 py-4 text-base font-bold transition-all duration-200 border-2 shadow-lg cursor-pointer bg-white/90 backdrop-blur-xl text-sky-700 border-sky-300 rounded-xl hover:shadow-xl hover:scale-105"
            onClick={() => navigate('/vendor/reservations')}
          >
            <span>👁️</span> View Reservations
          </button>
          <button
            className="flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white transition-all duration-200 border-none shadow-xl cursor-pointer bg-gradient-to-r from-sky-600 to-cyan-500 rounded-xl hover:shadow-2xl hover:scale-105"
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
