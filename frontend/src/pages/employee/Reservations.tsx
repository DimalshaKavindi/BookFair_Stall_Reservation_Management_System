// frontend/src/pages/employee/Reservations.tsx
import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  X,
  Eye
} from "lucide-react";
import EmpLayout from "../../layout/EmpLayout";


// Mock reservation data
const mockReservations = [
  {
    id: 1,
    stallName: "A",
    stallSize: "SMALL",
    businessName: "Galaxy Books",
    email: "galaxy@example.com",
    contactPerson: "Ishara Perera",
    phone: "077-1234567",
    status: "ACTIVE",
    reservationDate: "2024-11-01",
    literaryGenres: ["Fiction", "Mystery", "Thriller"]
  },
  {
    id: 2,
    stallName: "B",
    stallSize: "MEDIUM",
    businessName: "Sarasavi Publishers",
    email: "sarasavi@example.com",
    contactPerson: "Nimal Silva",
    phone: "077-2345678",
    status: "ACTIVE",
    reservationDate: "2024-11-02",
    literaryGenres: ["Education", "Children"]
  },
  {
    id: 3,
    stallName: "C",
    stallSize: "LARGE",
    businessName: "Vijitha Yapa",
    email: "vijitha@example.com",
    contactPerson: "Kumari Fernando",
    phone: "077-3456789",
    status: "ACTIVE",
    reservationDate: "2024-11-02",
    literaryGenres: ["General", "Non-Fiction", "Biography"]
  },
  {
    id: 4,
    stallName: "D",
    stallSize: "MEDIUM",
    businessName: "MD Gunasena",
    email: "gunasena@example.com",
    contactPerson: "Sunil Wickrama",
    phone: "077-4567890",
    status: "ACTIVE",
    reservationDate: "2024-11-03",
    literaryGenres: ["Educational", "Academic"]
  },
  {
    id: 5,
    stallName: "E",
    stallSize: "SMALL",
    businessName: "Lake House Bookshop",
    email: "lakehouse@example.com",
    contactPerson: "Chaminda Ratne",
    phone: "077-5678901",
    status: "CANCELLED",
    reservationDate: "2024-11-03",
    literaryGenres: ["Classic", "Literature"]
  },
  {
    id: 6,
    stallName: "F",
    stallSize: "LARGE",
    businessName: "Godage International",
    email: "godage@example.com",
    contactPerson: "Anura Jayasinghe",
    phone: "077-6789012",
    status: "ACTIVE",
    reservationDate: "2024-11-04",
    literaryGenres: ["Religion", "Philosophy", "Self-Help"]
  },
  {
    id: 7,
    stallName: "G",
    stallSize: "SMALL",
    businessName: "Samayawardhana",
    email: "samaya@example.com",
    contactPerson: "Ruwan Dias",
    phone: "077-7890123",
    status: "ACTIVE",
    reservationDate: "2024-11-04",
    literaryGenres: ["Local Authors", "Sinhala Literature"]
  },
  {
    id: 8,
    stallName: "H",
    stallSize: "MEDIUM",
    businessName: "Neptune Publications",
    email: "neptune@example.com",
    contactPerson: "Dilshan Perera",
    phone: "077-8901234",
    status: "ACTIVE",
    reservationDate: "2024-11-05",
    literaryGenres: ["Science", "Technology", "History"]
  }
];

type FilterType = {
  status: string;
  size: string;
};

export default function EmployeeReservations() {
  const [reservations] = useState(mockReservations);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterType>({ status: "all", size: "all" });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);

  // Filtered reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesSearch =
        searchQuery === "" ||
        reservation.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.stallName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reservation.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filters.status === "all" || reservation.status === filters.status;

      const matchesSize =
        filters.size === "all" || reservation.stallSize === filters.size;

      return matchesSearch && matchesStatus && matchesSize;
    });
  }, [reservations, searchQuery, filters]);

  const exportToCSV = () => {
    const headers = ["Stall", "Business Name", "Email", "Contact Person", "Phone", "Size", "Status", "Genres"];
    const rows = filteredReservations.map(r => [
      r.stallName,
      r.businessName,
      r.email,
      r.contactPerson,
      r.phone,
      r.stallSize,
      r.status,
      r.literaryGenres.join("; ")
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
              placeholder="Search by business, email, stall, or contact person..."
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
                className="w-full px-4 py-2 transition-all border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

      {/* Reservations Table */}
      <div className="bg-white rounded-xl border border-[#4dd9e8]/20 shadow-sm overflow-hidden">
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
                  Contact Person
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Size
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
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
                      <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-[#4dd9e8] to-[#2ab7c9] text-white font-bold rounded-lg text-lg shadow-sm">
                        {reservation.stallName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {reservation.businessName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {reservation.contactPerson}
                      </div>
                      <div className="text-xs text-gray-500">
                        {reservation.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {reservation.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        reservation.stallSize === "LARGE"
                          ? "bg-purple-100 text-purple-800"
                          : reservation.stallSize === "MEDIUM"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {reservation.stallSize}
                      </span>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedReservation(reservation)}
                        className="text-[#2ab7c9] hover:text-[#1e2875] font-medium text-sm flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation Detail Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-6 bg-white border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Reservation Details
              </h3>
              <button
                onClick={() => setSelectedReservation(null)}
                className="p-2 transition-colors rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Stall Info */}
              <div className="bg-gradient-to-br from-[#1e2875]/10 to-[#3245a5]/10 rounded-lg p-4 border border-[#4dd9e8]/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#4dd9e8] to-[#2ab7c9] text-white rounded-lg flex items-center justify-center text-3xl font-bold shadow-md">
                    {selectedReservation.stallName}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Stall</p>
                    <p className="text-lg font-semibold text-gray-900">
                      Stall {selectedReservation.stallName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedReservation.stallSize}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-700 uppercase">
                  Business Information
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Business Name</p>
                    <p className="font-medium text-gray-900">
                      {selectedReservation.businessName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact Person</p>
                    <p className="font-medium text-gray-900">
                      {selectedReservation.contactPerson}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">
                      {selectedReservation.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">
                      {selectedReservation.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reservation Info */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-700 uppercase">
                  Reservation Information
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-600">Reservation Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedReservation.reservationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedReservation.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {selectedReservation.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Literary Genres */}
              <div>
                <h4 className="mb-3 text-sm font-semibold text-gray-700 uppercase">
                  Literary Genres
                </h4>
                {selectedReservation.literaryGenres.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedReservation.literaryGenres.map((genre: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-[#4dd9e8]/20 to-[#2ab7c9]/20 text-[#1e2875] border border-[#4dd9e8]/30 rounded-full text-sm font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-gray-500">No genres specified</p>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedReservation(null)}
                className="w-full px-6 py-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </EmpLayout>
  );
}