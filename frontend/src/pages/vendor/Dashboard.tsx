import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Genre {
  id: string;
  name: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [newGenre, setNewGenre] = useState('');
  const [availableGenres] = useState<string[]>([
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery',
    'Romance', 'Thriller', 'Horror', 'Biography', 'History',
    'Science', 'Philosophy', 'Religion', 'Self-Help', 'Business',
    'Children\'s Books', 'Young Adult', 'Poetry', 'Drama', 'Comics'
  ]);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600">
      <nav className="bg-white/95 backdrop-blur-md px-4 md:px-8 py-4 flex flex-col md:flex-row justify-between items-center shadow-lg sticky top-0 z-50 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 m-0">Colombo International Bookfair</h1>
          <p className="text-xs md:text-sm text-gray-600 m-0">Vendor Portal</p>
        </div>
        <div className="flex gap-2 md:gap-4 w-full md:w-auto justify-center md:justify-end">
          <button 
            className="px-6 py-2 border-none bg-indigo-500 text-white rounded-lg text-base cursor-pointer transition-all hover:bg-indigo-600"
            onClick={() => navigate('/vendor/dashboard')}
          >
            Dashboard
          </button>
          <button 
            className="px-6 py-2 border-none bg-transparent text-gray-600 rounded-lg text-base cursor-pointer transition-all hover:bg-gray-100 hover:text-gray-800"
            onClick={() => navigate('/vendor/reservations')}
          >
            Reservations
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="text-center text-white mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold m-0 mb-2 drop-shadow-lg">Welcome to Your Dashboard</h2>
          <p className="text-base md:text-lg opacity-90">Manage your literary genres and stall reservations</p>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-8 mb-8 shadow-2xl">
          <h3 className="text-2xl font-semibold m-0 mb-2 text-gray-800">Literary Genres</h3>
          <p className="text-gray-600 mb-6">
            Add the literary genres you will be displaying/selling at the exhibition.
          </p>

          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <input
                type="text"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-colors focus:outline-none focus:border-indigo-500"
                placeholder="Enter a genre name"
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddGenre()}
              />
              <button 
                className="px-6 md:px-8 py-3 bg-indigo-500 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all shadow-md hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-lg"
                onClick={handleAddGenre}
              >
                Add Genre
              </button>
            </div>

            <div className="mt-6">
              <p className="text-gray-600 mb-3 text-sm">Or select from popular genres:</p>
              <div className="flex flex-wrap gap-2">
                {availableGenres.map((genre) => {
                  const isSelected = genres.find(g => g.name.toLowerCase() === genre.toLowerCase());
                  return (
                    <button
                      key={genre}
                      className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-all border-2 ${
                        isSelected
                          ? 'bg-indigo-500 border-indigo-500 text-white'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-500'
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

          <div className="mt-8 pt-8 border-t-2 border-gray-100">
            <h4 className="text-lg font-semibold m-0 mb-4 text-gray-800">Your Selected Genres ({genres.length})</h4>
            {genres.length === 0 ? (
              <p className="text-gray-400 italic py-4 text-center">No genres added yet. Add genres to get started.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {genres.map((genre) => (
                  <div key={genre.id} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border-2 border-gray-200">
                    <span className="text-gray-800 font-medium">{genre.name}</span>
                    <button
                      className="bg-red-500 text-white border-none rounded-full w-6 h-6 cursor-pointer text-xl leading-none flex items-center justify-center transition-colors hover:bg-red-600"
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

        <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
          <button
            className="px-6 md:px-8 py-3 bg-white text-indigo-500 border-2 border-indigo-500 rounded-lg text-base font-semibold cursor-pointer transition-all hover:bg-gray-50"
            onClick={() => navigate('/vendor/reservations')}
          >
            View Reservations
          </button>
          <button
            className="px-6 md:px-8 py-3 bg-indigo-500 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all shadow-md hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-lg"
            onClick={() => navigate('/vendor/reservations')}
          >
            Make New Reservation
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
