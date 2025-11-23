// pages/employee/Reservations.tsx
import {
  AlertCircle,
  ChevronDown,
  Download,
  Eye,
  Filter,
  Loader2,
  Search,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { reservationsAPI } from "../../api/axios";
import EmpLayout from "../../layout/EmpLayout";
import type { Reservation } from "../../types/ReservationType";

type FilterType = {
  status: string;
  size: string;
};

export default function EmployeeReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterType>({ status: "all", size: "all" });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationsAPI.getAll();
      setReservations(response.reservations);
    } catch (err: any) {
      setError(err.message || "Failed to load reservations");
      console.error("Load reservations error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesSearch =
        searchQuery === "" ||
        reservation.user?.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.stall?.name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filters.status === "all" || reservation.status === filters.status;

      const matchesSize =
        filters.size === "all" || reservation.stall?.size === filters.size;

      return matchesSearch && matchesStatus && matchesSize;
    });
  }, [reservations, searchQuery, filters]);

  const exportToCSV = () => {
    const headers = ["Stall", "Business Name", "Email", "Size", "Status", "Contact Person", "Phone", "Date", "Genres"];
    const rows = filteredReservations.map(r => [
      r.stall?.name || `Stall ${r.stallId}`,
      r.user?.businessName || "N/A",
      r.user?.email || "N/A",
      r.stall?.size || "N/A",
      r.status,
      r.user?.contactPerson || "N/A",
      r.user?.phone || "N/A",
      new Date(r.reservationDate || r.createdAt).toLocaleDateString(),
      (r.literaryGenres || []).join("; ")
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reservations_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = {
    total: reservations.length,
    active: reservations.filter(r => r.status === "ACTIVE").length,
    cancelled: reservations.filter(r => r.status === "CANCELLED").length
  };

  if (loading) {
    return (
      <EmpLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#4dd9e8] animate-spin" />
            <p className="text-gray-600">Loading reservations...</p>
          </div>
        </div>
      </EmpLayout>
    );
  }

  if (error) {
    return (
      <EmpLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-3 p-6 border border-red-200 rounded-xl bg-red-50">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-medium text-red-700">{error}</p>
              <button
                onClick={loadReservations}
                className="mt-2 text-sm text-red-600 underline hover:text-red-700"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </EmpLayout>
    );
  }

  return (
    <EmpLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            All Reservations
          </h2>
          <p className="text-gray-600">
            Manage and view all stall reservations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
          <div className="bg-white rounded-lg p-4 border border-[#4dd9e8]/20 shadow-sm">
            <p className="mb-1 text-sm text-gray-600">Total Reservations</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="p-4 bg-white border border-green-200 rounded-lg shadow-sm">
            <p className="mb-1 text-sm text-gray-600">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="p-4 bg-white border border-red-200 rounded-lg shadow-sm">
            <p className="mb-1 text-sm text-gray-600">Cancelled</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl border border-[#4dd9e8]/20 shadow-sm mb-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search by business, email, or stall..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent transition-all outline-none"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="px-6 py-3 bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] hover:shadow-lg text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 gap-4 pt-4 mt-4 border-t border-gray-200 sm:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent transition-all outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Stall Size
                </label>
                <select
                  value={filters.size}
                  onChange={(e) => setFilters({ ...filters, size: e.target.value })}
                  className="w-full px-4 py-2 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent"
                >
                  <option value="all">All Sizes</option>
                  <option value="SMALL">Small</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LARGE">Large</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredReservations.length} of {reservations.length} reservations
          </p>
        </div>

        {/* Reservations Table - Desktop */}
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
                {filteredReservations.length === 0 ? (
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
                  filteredReservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="transition-colors hover:bg-gray-50"
                    >
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

        {/* Reservations Cards - Mobile/Tablet */}
        <div className="grid grid-cols-1 gap-4 lg:hidden">
          {filteredReservations.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#4dd9e8]/20 shadow-sm p-12 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="font-medium text-gray-500">No reservations found</p>
              <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white rounded-xl border border-[#4dd9e8]/20 shadow-sm p-4 space-y-4"
              >
                {/* Header */}
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

                {/* Business Info */}
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

                {/* Additional Info */}
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

                {/* Literary Genres */}
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
      </div>
    </EmpLayout>
  );
}