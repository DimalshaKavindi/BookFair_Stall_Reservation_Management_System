import { useState, useEffect, useCallback, useMemo } from 'react';
import { MapPin, Calendar, BookOpen,CheckCircle,Clock,AlertCircle,Edit3,Star,Warehouse} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { reservationsAPI, userAPI, stallsAPI } from '../../api/axios';
import type { Reservation } from '../../types/ReservationType';
import type { UserProfile } from '../../types/UserType';
import { showToastError } from '../../utils/toast/errToast';
import { showToastSuccess } from '../../utils/toast/successToast';

interface DashboardStats {
  totalReservations: number;
  activeReservations: number;
  availableStalls: number;
  maxStallsAllowed: number;
  pendingActions: number;
  completedSetups: number;
}

export default function VendorDashboard() {
  const navigate = useNavigate();
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [stallCounts, setStallCounts] = useState({ total: 0, available: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const maxStallsAllowed = 3;
  
  const [showGenreModal, setShowGenreModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState('');
  const [savingGenres, setSavingGenres] = useState(false);

  const fetchDashboardData = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      setError(null);
      const profile = await userAPI.getProfile();
      setCurrentUser(profile);

      const [reservationsResponse, stallsResponse] = await Promise.all([
        reservationsAPI.getForUser(profile.id),
        stallsAPI.getAll()
      ]);

      const reservationsData = (reservationsResponse.reservations || [])
        .filter(reservation => reservation.status === 'ACTIVE')
        .slice()
        .sort(
          (a, b) =>
            new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime()
        );

      setRecentReservations(reservationsData);

      const stalls = stallsResponse?.stalls || [];
      const available = stalls.filter(stall => stall.isAvailable).length;
      setStallCounts({
        total: stalls.length,
        available
      });
    } catch (err: any) {
      console.error('Failed to load vendor dashboard data:', err);
      const errorMessage = err.message || 'Failed to load dashboard. Please try again.';
      setError(errorMessage);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(() => {
      fetchDashboardData({ silent: true });
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDashboardData({ silent: true });
    setIsRefreshing(false);
  };

  const stats = useMemo<DashboardStats>(() => {
    const totalReservations = recentReservations.length;
    const activeReservations = recentReservations.filter(res => res.status === 'ACTIVE').length;
    const completedSetups = recentReservations.filter(
      res => (res.literaryGenres?.length || 0) > 0
    ).length;
    const pendingActions = Math.max(0, totalReservations - completedSetups);

    return {
      totalReservations,
      activeReservations,
      availableStalls: stallCounts.available,
      maxStallsAllowed,
      pendingActions,
      completedSetups
    };
  }, [recentReservations, stallCounts]);

  const openGenreModal = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setGenres(reservation.literaryGenres || []);
    setShowGenreModal(true);
  };

  const addGenre = () => {
    if (newGenre.trim() && !genres.includes(newGenre.trim())) {
      setGenres([...genres, newGenre.trim()]);
      setNewGenre('');
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setGenres(genres.filter(genre => genre !== genreToRemove));
  };

  const updateGenres = async () => {
    if (!selectedReservation) return;

    setSavingGenres(true);
    try {
      await reservationsAPI.updateGenres(selectedReservation.id, genres);
      setRecentReservations(prev =>
        prev.map(res =>
          res.id === selectedReservation.id
            ? { ...res, literaryGenres: [...genres] }
            : res
        )
      );
      setShowGenreModal(false);
      setSelectedReservation(null);
      showToastSuccess('Literary genres updated successfully!');
    } catch (error: any) {
      console.error('Failed to update genres:', error);
      const errorMessage = error.message || 'Failed to update genres. Please try again.';
      showToastError(errorMessage);
    } finally {
      setSavingGenres(false);
    }
  };

  const getSizeColor = (size?: string) => {
    switch (size) {
      case 'SMALL': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LARGE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const businessInfo = currentUser?.businessName || 'Vendor';
  const contactName = currentUser?.contactPerson?.split(' ')[0];

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between gap-4">
          <span>{error}</span>
          <button
            onClick={() => fetchDashboardData()}
            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      <div className="bg-gradient-to-br from-[#4598db] to-[#2ab7c9] rounded-2xl shadow-xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4 ml-2">
              
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Welcome to Vendor Dashboard</h1>
                <p className="text-blue-100 text-base md:text-lg">
                  {businessInfo} {contactName ? `- Welcome back, ${contactName}!` : ''}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/30 p-4 border rounded-lg backdrop-blur-sm border-white/30">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats.activeReservations}</p>
                    <p className="text-white-200 text-sm">Active Stalls</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/30 p-4 border rounded-lg backdrop-blur-sm border-white/30">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold">{stats.completedSetups}</p>
                    <p className="text-white-200 text-sm">Ready Stalls</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/30 p-4 border rounded-lg backdrop-blur-sm border-white/30">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-orange-400" />
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingActions}</p>
                    <p className="text-white-200 text-sm">Pending Setup</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/30 p-4 border rounded-lg backdrop-blur-sm border-white/30">
                <div className="flex items-center gap-3">
                  <MapPin className="w-8 h-8 text-violet-500 " />
                  <div>
                    <p className="text-2xl font-bold">{stats.availableStalls}</p>
                    <p className="text-white-200 text-sm">Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Exhibition Preparation Progress</h2>
          <span className="text-sm text-gray-500">
            {stats.completedSetups}/{stats.totalReservations} stalls ready
          </span>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-sm font-semibold text-[#2ab7c9] hover:text-[#1e2875] flex items-center gap-2 disabled:opacity-50"
          >
            {isRefreshing ? (
              <>
                <div className="w-4 h-4 border-2 border-[#2ab7c9] border-t-transparent rounded-full animate-spin"></div>
                Refreshing
              </>
            ) : (
              'Refresh'
            )}
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentReservations.map((reservation) => (
              <div key={reservation.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <div className={`p-2 rounded-full ${
                  reservation.literaryGenres && reservation.literaryGenres.length > 0 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {reservation.literaryGenres && reservation.literaryGenres.length > 0 ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Stall {reservation.stall?.name || reservation.stallId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {reservation.literaryGenres && reservation.literaryGenres.length > 0 
                      ? 'Ready for exhibition' 
                      : 'Setup required'
                    }
                  </p>
                </div>
                <button
                  onClick={() => openGenreModal(reservation)}
                  className={`px-3 py-1 text-sm rounded-lg font-medium ${
                    reservation.literaryGenres && reservation.literaryGenres.length > 0
                      ? 'text-green-700 bg-green-50 hover:bg-green-100'
                      : 'text-orange-700 bg-orange-50 hover:bg-orange-100'
                  }`}
                >
                  {reservation.literaryGenres && reservation.literaryGenres.length > 0 ? 'Edit' : 'Setup'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="bg-white xl:h-full rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 ">
              <div className="flex items-center justify-between">
                <h2 className="md:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#2ab7c9]" />
                  Your Stall Reservations
                </h2>
                <button
                  onClick={() => navigate('/vendor/reserve-stalls')}
                  className="text-[#2ab7c9] hover:text-[#1e2875] font-medium text-xs md:text-sm flex items-center gap-1"
                >
                  Reserve New Stall
                </button>
              </div>
            </div>
            <div className="p-6">
              {recentReservations.length === 0 ? (
                <div className="text-center py-4 xl:py-48">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No reservations yet</p>
                  <button
                    onClick={() => navigate('/vendor/reserve-stalls')}
                    className="text-[#2ab7c9] hover:text-[#1e2875] font-medium mt-2"
                  >
                    Make your first reservation
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {recentReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="border border-gray-200 rounded-lg p-6 hover:bg-slate-50 hover:border-[#2ab7c9] transition-colors"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-lg ${getSizeColor(reservation.stall?.size)}`}>
                              <Warehouse className="w-4 h-4 md:w-6 md:h-6" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                                  Stall {reservation.stall?.name || reservation.stallId}
                                </h3>
                              </div>
                              <div className="grid grid-cols-1 gap-2 text-xs md:text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Location:</span> {reservation.stall?.location || 'TBA'}
                                </div>
                                
                                <div>
                                  <span className="font-medium">Reserved:</span>{' '}
                                  {new Date(reservation.reservationDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </div>
                                
                              </div>
                            </div>
                          </div>

                          <div className="mt-4">
                            <div className="flex items-center mb-3 mr-10">
                              <span className="text-xs md:text-sm font-medium text-gray-700 flex items-center gap-2 mr-5">
                                <BookOpen className="w-4 h-4" />
                                Literary Genres
                                {reservation.literaryGenres && reservation.literaryGenres.length > 0 && (
                                  <span className="bg-slate-100 text-center text-slate-500 text-xs px-2 py-1 rounded-full">
                                    {reservation.literaryGenres.length} genres
                                  </span>
                                )}
                              </span>
                              <button
                                onClick={() => openGenreModal(reservation)}
                                className="text-[#2ab7c9] hover:text-[#1e2875] text-xs md:text-sm font-medium flex items-center gap-1"
                              >
                                <Edit3 className="w-4 h-4" />
                                {reservation.literaryGenres && reservation.literaryGenres.length > 0 ? 'Edit Genres' : 'Add Genres'}
                              </button>
                            </div>
                            
                            {reservation.literaryGenres && reservation.literaryGenres.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {reservation.literaryGenres.map((genre, index) => (
                                  <span
                                    key={index}
                                    className="px-3 py-2 bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] text-white text-sm rounded-lg font-medium shadow-sm"
                                  >
                                    {genre}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                  <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-yellow-600 flex-shrink-0" />
                                  <div>
                                    <p className="text-yellow-800 text-sm md:text-base font-medium">Setup Required</p>
                                    <p className="text-yellow-700 text-xs md:text-sm">
                                      Add literary genres to complete your stall setup and enhance visitor experience
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex">
                          <button
                            onClick={() => navigate('/vendor/my-reservations')}
                            className="flex text-sm md:text-base items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Book Fair 2026
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#4dd9e8]" />
                <span>BMICH, Colombo</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#4dd9e8]" />
                <span>September 15-24, 2026</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#4dd9e8]" />
                <span>9:00 AM - 9:00 PM</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-xs text-white/80 leading-relaxed">
                The largest book fair and exhibition in Sri Lanka. Showcase your publications 
                to thousands of visitors and book enthusiasts.
              </p>
            </div>
          </div>

          <div className="bg-white/80 rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Reservation Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Reservations</span>
                <span className="font-semibold">{stats.activeReservations}/3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ready for Exhibition</span>
                <span className="font-semibold text-green-600">{stats.completedSetups}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Needs Setup</span>
                <span className="font-semibold text-orange-600">{stats.pendingActions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Available Stalls</span>
                <span className="font-semibold text-blue-600">{stats.availableStalls}</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
            <h3 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Important Notes
            </h3>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Maximum 3 active stalls per vendor</li>
              <li>• Bring QR codes for entry</li>
              <li>• Setup must be completed 48h before event</li>
              <li>• Contact organizers for assistance</li>
            </ul>
          </div>
        </div>
      </div>

      {showGenreModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 
                max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
              Literary Genres for Stall {selectedReservation.stall?.name || selectedReservation.stallId}
            </h3>
            <p className="text-gray-600 text-xs md:text-sm mb-6">
              Add the literary genres you'll be displaying at your stall. This helps visitors find your publications.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add New Genre
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGenre()}
                  placeholder="e.g., Fiction, Science, Children"
                  className="flex-1 px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none"
                />
                <button
                  onClick={addGenre}
                  className="px-3 md:px-4 md:py-2 bg-blue-50 text-blue-700 border-blue-200 border rounded-full md:rounded-lg font-semibold 
                            hover:bg-blue-600 hover:text-white transition-all shadow-md flex items-center justify-center"
                >\
                  <span className="text-xl md:hidden">+</span>
                  <span className="hidden md:inline">Add</span>
                </button>
              </div>
            </div>
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Current Genres ({genres.length})</h4>
              {genres.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No genres added yet</p>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1">

                  {genres.map((genre, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] text-white text-sm rounded-lg font-medium"
                    >
                      {genre}
                      <button
                        onClick={() => removeGenre(genre)}
                        className="text-white hover:text-gray-200 ml-1"
                      >
                        <AlertCircle className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowGenreModal(false);
                  setSelectedReservation(null);
                }}
                className="flex-1 md:text-base text-sm px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateGenres}
                disabled={savingGenres}
                className="flex-1 md:text-base text-sm px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {savingGenres ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  'Save Genres'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}