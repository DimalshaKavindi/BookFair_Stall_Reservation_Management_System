import { useState, useEffect } from 'react';
import { MapPin, Calendar, Download, Trash2, QrCode, Building, Clock, CheckCircle, XCircle, AlertTriangle, Search, X } from 'lucide-react';
import { reservationsAPI, userAPI } from '../../api/axios';
import type { Reservation } from '../../types/ReservationType';
import type { UserProfile } from '../../types/UserType';
import { showToastError } from '../../utils/toast/errToast';
import { showToastSuccess } from '../../utils/toast/successToast';
import { showToastinfo } from '../../utils/toast/infoToast';

export default function MyReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'CANCELLED'>('ALL');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedQrCode, setSelectedQrCode] = useState<string>('');
  const [selectedStallName, setSelectedStallName] = useState<string>('');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const userProfile = await userAPI.getProfile();
      setCurrentUser(userProfile);
      
      const response = await reservationsAPI.getForUser(userProfile.id);
      setReservations(response.reservations || []);
    } catch (error) {
      console.error('Failed to load reservations:', error);
      showToastError('Failed to load your reservations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedReservation) return;

    setCancellingId(selectedReservation.id);
    try {
      await reservationsAPI.cancel(selectedReservation.id);

      setReservations(prev =>
        prev.map(res =>
          res.id === selectedReservation.id
            ? { ...res, status: 'CANCELLED' }
            : res
        )
      );

      showToastSuccess(`Reservation for Stall ${selectedReservation.stall?.name} has been cancelled successfully.`);
      showToastinfo('A cancellation confirmation has been sent to your email.');
      
      setShowCancelModal(false);
      setSelectedReservation(null);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message || 'Failed to cancel reservation. Please try again.';
      showToastError(errorMessage);
    } finally {
      setCancellingId(null);
    }
  };

  const handleViewQr = (qrCodeUrl: string, stallName: string) => {
    setSelectedQrCode(qrCodeUrl);
    setSelectedStallName(stallName);
    setShowQrModal(true);
  };

  const downloadQRCode = (qrCodeUrl: string, stallName: string) => {
    fetch(qrCodeUrl)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `qr-code-stall-${stallName}.png`;
        
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        
        showToastSuccess('QR code downloaded successfully!');
      })
      .catch(error => {
        console.error('Failed to download QR code:', error);
        showToastError('Failed to download QR code. Please try again.');
      });
  };

  const downloadFromModal = () => {
    if (selectedQrCode && selectedStallName) {
      downloadQRCode(selectedQrCode, selectedStallName);
      setShowQrModal(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    
    switch (status) {
      case 'ACTIVE':
        return `${baseClasses} bg-green-100 text-green-800 flex items-center gap-1`;
      case 'CANCELLED':
        return `${baseClasses} bg-red-100 text-red-800 flex items-center gap-1`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-3 h-3" />;
      case 'CANCELLED':
        return <XCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStallColor = (size: string) => {
    switch (size) {
      case 'SMALL':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LARGE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.stall?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.stall?.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || reservation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const activeReservations = reservations.filter(r => r.status === 'ACTIVE').length;
  const cancelledReservations = reservations.filter(r => r.status === 'CANCELLED').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your reservations...</p>
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
              <Building className="w-8 h-8 text-blue-600" />
              My Reservations
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your exhibition stall reservations and access QR codes
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{reservations.length}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeReservations}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{cancelledReservations}</div>
              <div className="text-sm text-gray-600">Cancelled</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 ">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-5">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              {(['ALL', 'ACTIVE', 'CANCELLED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    statusFilter === filter
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filter === 'ALL' ? 'All' : filter.charAt(0) + filter.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search stalls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="grid gap-6 bg-white py-10 px-5 md:px-10 border rounded-lg">
          {filteredReservations.length === 0 ? (
            <div className="text-center py-8">
              <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No reservations found</h3>
              <p className="text-gray-600">
                {reservations.length === 0 
                  ? "You haven't made any reservations yet."
                  : "No reservations match your current filters."
                }
              </p>
            </div>
          ) : (
            filteredReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base md:text-xl flex-col md:flex-row font-bold text-gray-900 flex items-center gap-2">
                          Stall {reservation.stall?.name}
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStallColor(
                              reservation.stall?.size || ''
                            )}`}
                          >
                            {reservation.stall?.size}
                          </span>
                        </h3>

                        <div className={getStatusBadge(reservation.status)}>
                          {getStatusIcon(reservation.status)}
                          {reservation.status}
                        </div>
                      </div>

                      <p className="text-gray-600">{reservation.stall?.dimensions}</p>

                      <div className="space-y-1 text-xs md:text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          {reservation.stall?.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          Reserved on {formatDate(reservation.reservationDate)}
                        </div>
                      </div>

                      {reservation.literaryGenres && reservation.literaryGenres.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">
                            Literary Genres:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {reservation.literaryGenres.map((genre, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs"
                              >
                                {genre}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center lg:justify-start">
                      {reservation.qrCodeUrl && reservation.status === "ACTIVE" ? (
                        <div className="text-center">
                          <img
                            src={reservation.qrCodeUrl}
                            alt="QR Code"
                            className="w-24 h-24 md:w-32 md:h-32 border border-gray-300 rounded-lg mx-auto mb-3 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => handleViewQr(reservation.qrCodeUrl!, reservation.stall?.name || 'Unknown')}
                          />
                          <p className="text-xs text-gray-500 mb-2">Scan at exhibition entrance</p>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-sm italic">
                          QR unavailable
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center gap-3">
                      {reservation.qrCodeUrl && reservation.status === "ACTIVE" && (
                        <>
                          <button
                            onClick={() =>
                              downloadQRCode(
                                reservation.qrCodeUrl!,
                                reservation.stall?.name || 'unknown'
                              )
                            }
                            className="md:text-base flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Download QR
                          </button>

                          <button
                            onClick={() => handleViewQr(reservation.qrCodeUrl!, reservation.stall?.name || 'Unknown')}
                            className="md:text-base flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs hover:bg-gray-50 transition-colors"
                          >
                            <QrCode className="w-4 h-4" />
                            View QR
                          </button>
                        </>
                      )}

                      {reservation.status === "ACTIVE" && (
                        <button
                          onClick={() => handleCancelClick(reservation)}
                          disabled={cancellingId === reservation.id}
                          className="md:text-base flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg text-xs hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {cancellingId === reservation.id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              Cancel Reservation
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showCancelModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setShowCancelModal(false);
                setSelectedReservation(null);
              }}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Reservation</h3>
              <p className="text-gray-600">
                Are you sure you want to cancel your reservation for <strong>Stall {selectedReservation.stall?.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <strong>Important:</strong> Cancelling this reservation will make the stall available for other vendors. Any associated QR codes will become invalid.
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedReservation(null);
                }}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                Keep Reservation
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={cancellingId === selectedReservation.id}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {cancellingId === selectedReservation.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Cancelling...
                  </>
                ) : (
                  'Cancel Reservation'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showQrModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Your QR Code</h3>
              <p className="text-gray-600 text-sm mb-6">Scan this code at the exhibition entrance</p>
              
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200 mb-6">
                <img
                  src={selectedQrCode}
                  alt="QR Code"
                  className="w-48 h-48 mx-auto"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowQrModal(false)}
                  className="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={downloadFromModal}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Important Information</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Each stall reservation includes a unique QR code for event access</li>
              <li>• You can download your QR codes for offline use</li>
              <li>• Cancelled reservations free up the stall for other vendors</li>
              <li>• Maximum of 3 active reservations per vendor</li>
              <li>• Contact support if you need to make changes to your reservation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}