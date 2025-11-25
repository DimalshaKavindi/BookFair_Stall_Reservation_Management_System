import {
  AlertCircle,
  ChevronDown,
  Download,
  Filter,
  Loader2,
  Search,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { reservationsAPI } from "../../api/axios";
import EmpLayout from "../../layout/EmpLayout";

import ReservationTable from "../../components/ReservationTable";
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
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [reservationsRes] = await Promise.all([
        reservationsAPI.getAll(),
       
      ]);
      setReservations(reservationsRes.reservations);
      
    } catch (err: any) {
      setError(err.message || "Failed to load data");
      console.error("Load data error:", err);
    } finally {
      setLoading(false);
    }
  };

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
                onClick={loadData}
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
       <div className="p-6 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">All Reservations</h1>
                <p className="text-gray-600">View and manage all reservations</p>
              </div>
            </div>
          
          </div>
        </div>


     
        <div className="bg-white rounded-xl border border-[#4dd9e8]/20 shadow-sm mb-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row">
          
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

        
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

         
            <button
              onClick={exportToCSV}
              className="px-6 py-3 bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] hover:shadow-lg text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>

         
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

        <ReservationTable reservations={filteredReservations} />
      </div>
    </EmpLayout>
  );
}