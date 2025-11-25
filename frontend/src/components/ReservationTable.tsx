
import { Search } from 'lucide-react';
import type { Reservation } from '../types/ReservationType';

interface ReservationTableProps {
  reservations: Reservation[];
}

export default function ReservationTable({ reservations }: ReservationTableProps) {
  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-xl border border-[#4dd9e8]/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Stall
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Business
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Contact Person
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Phone Number
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Size
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Reservation Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Literary Genres
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-12 h-12 text-gray-300" />
                      <p className="font-medium text-gray-500">No reservations found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                reservations.map((reservation) => (
                  <tr key={reservation.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-br from-[#4dd9e8] to-[#2ab7c9] text-white font-bold rounded-lg text-sm shadow-sm">
                        {reservation.stall?.name || `#${reservation.stallId}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {reservation.user?.businessName || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {reservation.user?.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {reservation.user?.contactPerson || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {reservation.user?.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        reservation.stall?.size === "LARGE"
                          ? "bg-purple-100 text-purple-800"
                          : reservation.stall?.size === "MEDIUM"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {reservation.stall?.size || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {new Date(reservation.reservationDate || reservation.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap max-w-xs gap-1">
                        {reservation.literaryGenres && reservation.literaryGenres.length > 0 ? (
                          reservation.literaryGenres.slice(0, 2).map((genre: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 bg-gradient-to-r from-[#4dd9e8]/20 to-[#2ab7c9]/20 text-[#1e2875] border border-[#4dd9e8]/30 rounded-full text-xs font-medium"
                            >
                              {genre}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs italic text-gray-400">None</span>
                        )}
                        {reservation.literaryGenres && reservation.literaryGenres.length > 2 && (
                          <span className="px-2 py-0.5 text-xs text-gray-600">
                            +{reservation.literaryGenres.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        reservation.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {reservation.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {reservations.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#4dd9e8]/20 shadow-sm p-12 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="font-medium text-gray-500">No reservations found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white rounded-xl border border-[#4dd9e8]/20 shadow-sm p-4 space-y-4"
            >
             
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-br from-[#4dd9e8] to-[#2ab7c9] text-white font-bold rounded-lg text-sm shadow-sm">
                  {reservation.stall?.name || `#${reservation.stallId}`}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  reservation.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                  {reservation.status}
                </span>
              </div>

          
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600">Business Name</p>
                  <p className="font-medium text-gray-900">{reservation.user?.businessName || "N/A"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Contact Person</p>
                    <p className="text-sm text-gray-900">{reservation.user?.contactPerson || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Phone</p>
                    <p className="text-sm text-gray-900">{reservation.user?.phone || "N/A"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="text-sm text-gray-900">{reservation.user?.email || "N/A"}</p>
                </div>
              </div>

           
              <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600">Size</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    reservation.stall?.size === "LARGE"
                      ? "bg-purple-100 text-purple-800"
                      : reservation.stall?.size === "MEDIUM"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {reservation.stall?.size || "N/A"}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Reservation Date</p>
                  <p className="text-sm text-gray-900">
                    {new Date(reservation.reservationDate || reservation.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

           
              {reservation.literaryGenres && reservation.literaryGenres.length > 0 && (
                <div>
                  <p className="mb-2 text-xs text-gray-600">Literary Genres</p>
                  <div className="flex flex-wrap gap-1">
                    {reservation.literaryGenres.map((genre: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gradient-to-r from-[#4dd9e8]/20 to-[#2ab7c9]/20 text-[#1e2875] border border-[#4dd9e8]/30 rounded-full text-xs font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}