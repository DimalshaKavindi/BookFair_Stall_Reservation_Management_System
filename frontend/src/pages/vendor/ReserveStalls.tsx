import { useState, useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import StallMap from '../../components/StallMap';
import { stallsAPI, reservationsAPI, userAPI } from '../../api/axios';
import type { Stall } from '../../types/StallType';
import type { UserProfile } from '../../types/UserType';
import type { Reservation } from '../../types/ReservationType';
import { showToastError } from '../../utils/toast/errToast';
import { showToastSuccess } from '../../utils/toast/successToast';
import { showToastinfo } from '../../utils/toast/infoToast';

export default function ReserveStalls() {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [reserving, setReserving] = useState(false);
  const [userReservations, setUserReservations] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [userReservationsList, setUserReservationsList] = useState<Reservation[]>([]);
  
  const availableCount = stalls.filter(stall => stall.isAvailable).length;
  const reservedCount = stalls.length - availableCount;

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userProfile = await userAPI.getProfile();
      setCurrentUser(userProfile);
      
      await Promise.all([
        loadStalls(),
        loadUserReservations(userProfile.id)
      ]);
    } catch (error) {
      console.error('Failed to load user data:', error);
      showToastError('Failed to load user data. Please try again.');
      setLoading(false);
    }
  };

  const loadStalls = async () => {
    try {
      const response = await stallsAPI.getAll();
      setStalls(response.stalls || []);
    } catch (error) {
      console.error('Failed to load stalls:', error);
      showToastError('Failed to load stalls. Please try again.');
    }
  };

  const loadUserReservations = async (userId: number) => {
    try {
      const response = await reservationsAPI.getForUser(userId);
      const reservations = response.reservations || [];
      setUserReservationsList(reservations);
      
      const activeReservationsCount = reservations.filter(
        (reservation: Reservation) => reservation.status === 'ACTIVE'
      ).length;
      
      setUserReservations(activeReservationsCount);
    } catch (error) {
      console.error('Failed to load user reservations:', error);
      showToastError('Failed to load your reservations.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmation(false);
    setSelectedStall(null);
  };

  const handleStallClick = (stall: Stall) => {
    if (!stall.isAvailable) return;
    
    if (userReservations >= 3) {
      showToastError('You have reached the maximum of 3 active stalls.');
      return;
    }
    
    setSelectedStall(stall);
    setShowConfirmation(true);
  };

  const handleConfirmReservation = async () => {
    if (!selectedStall) return;

    if (userReservations >= 3) {
      showToastError('You have reached the maximum of 3 active stalls.');
      setShowConfirmation(false);
      setSelectedStall(null);
      return;
    }

    setReserving(true);
    try {
      const response = await reservationsAPI.create(selectedStall.id);
      
      if (response.success) {
        showToastSuccess(`Stall ${selectedStall.name} reserved successfully! Check your email for the QR code.`);
        setShowConfirmation(false);
        setSelectedStall(null);
        await loadStalls();
        if (currentUser) {
          await loadUserReservations(currentUser.id);
        }
      } else {
        showToastError('Reservation failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Reservation failed:', error);
      const errorMessage = error.message || 'Reservation failed. Please try again.';
      
      if (error.status === 400) {
        showToastError(`Reservation failed: ${errorMessage}`);
      } else if (error.status === 404) {
        showToastError('User not found. Please log in again.');
      } else {
        showToastinfo(`Reservation failed: ${errorMessage}`);
        await loadStalls();
        if (currentUser) {
          await loadUserReservations(currentUser.id);
        }
        setShowConfirmation(false);
        setSelectedStall(null);
      }
    } finally {
      setReserving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stalls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Reserve Exhibition Stalls
            </h1>
            <p className="text-gray-600 mt-2">
              Select up to 3 stalls for your business at BMICH
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-center gap-0">
          <div className="flex flex-col items-center justify-center px-8 py-4">
            <span className="text-2xl font-bold text-gray-900">{stalls.length}</span>
            <span className="text-sm text-gray-600 font-medium">Total Stalls</span>
          </div>
          <div className="h-12 w-px bg-gray-300"></div>
          <div className="flex flex-col items-center justify-center px-8 py-4">
            <span className="text-2xl font-bold text-green-600">{availableCount}</span>
            <span className="text-sm text-gray-600 font-medium">Available</span>
          </div>
          <div className="h-12 w-px bg-gray-300"></div>

          <div className="flex flex-col items-center justify-center px-8 py-4">
            <span className="text-2xl font-bold text-red-600">{reservedCount}</span>
            <span className="text-sm text-gray-600 font-medium">Reserved</span>
          </div>

          <div className="h-12 w-px bg-gray-300"></div>
          <div className="flex flex-col items-center justify-center px-8 py-4">
            <span className="text-2xl font-bold text-blue-600">{userReservations}</span>
            <span className="text-sm text-gray-600 font-medium">Your Active Reservations</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Your active reservation progress</span>
            <span>{userReservations}/3 stalls</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(userReservations / 3) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <StallMap 
        stalls={stalls}
        selectedStalls={selectedStall ? [selectedStall] : []}
        onStallClick={handleStallClick}
        showLegend={false}
      />
      
      {showConfirmation && selectedStall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative overflow-y-auto max-h-[96vh]">
            
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-1">Confirm Reservation</h3>
              <p className="text-sm md:text-base text-gray-600">Review your stall selection before confirming</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl py-3 px-5 md:py-4 md:px-6 mb-4 border-2 border-blue-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-blue-600 font-medium mb-2">Selected Stall</p>
                  <h4 className="text-lg d:text-2xl font-bold text-gray-900">Stall {selectedStall.name}</h4>
                </div>
                <div className={`
                  w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center border-2
                  ${selectedStall.size === 'SMALL' ? 'bg-emerald-400 border-emerald-500' : ''}
                  ${selectedStall.size === 'MEDIUM' ? 'bg-yellow-400 border-yellow-500' : ''}
                  ${selectedStall.size === 'LARGE' ? 'bg-red-400 border-red-500' : ''}
                `}>
                  <span className="text-sm font-bold text-white">{selectedStall.size[0]}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-gray-600">Size:</span>
                  <span className="text-xs md:text-sm font-semibold text-gray-900">{selectedStall.size}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-gray-600">Dimensions:</span>
                  <span className="text-xs md:text-sm font-semibold text-gray-900">{selectedStall.dimensions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs md:text-sm text-gray-600">Location:</span>
                  <span className="text-xs md:text-sm font-semibold text-gray-900">{selectedStall.location}</span>
                </div>
                <div className="flex items-center justify-between border-t border-blue-200 pt-2 mt-2">
                  <span className="text-xs md:text-sm text-gray-600">Price:</span>
                  <span className="text-base md:text-lg font-bold text-blue-600">
                    {selectedStall.size === 'SMALL' ? 'LKR 20,000' : ''}
                    {selectedStall.size === 'MEDIUM' ? 'LKR 35,000' : ''}
                    {selectedStall.size === 'LARGE' ? 'LKR 50,000' : ''}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
              <p className="text-xs md:text-sm text-amber-800">
                <strong>Note:</strong> A confirmation email with QR code will be sent to your registered email address. Each stall reservation generates a unique QR code.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                disabled={reserving}
                className="flex-1 p-1 md:p-3 text-sm border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReservation}
                disabled={reserving || userReservations >= 3}
                className="flex-1 p-1 px-2 md:p-3 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md flex items-center justify-center md:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reserving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Reserving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="md:w-5 md:h-5" />
                    Confirm Booking
                  </>
                )}
              </button>
            </div>

            {userReservations >= 3 && (
              <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700 text-center">
                  You have reached the maximum limit of 3 active reservations.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}