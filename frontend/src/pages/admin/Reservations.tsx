// pages/admin/Reservations.tsx
import { useEffect, useState } from 'react';
import { Users, Loader2, AlertCircle, Download } from 'lucide-react';
import { reservationsAPI } from '../../api/axios';
import AdminLayout from '../../layout/AdminLayout';
import ReservationTable from '../../components/ReservationTable';
import type { Reservation } from '../../types/ReservationType';

export default function AdminReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationsAPI.getAll();
      setReservations(response.reservations || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Stall", "Business", "Email", "Contact", "Phone", "Size", "Status", "Date", "Genres"];
    const rows = reservations.map(r => [
      r.stall?.name || `Stall ${r.stallId}`,
      r.user?.businessName || "N/A",
      r.user?.email || "N/A",
      r.user?.contactPerson || "N/A",
      r.user?.phone || "N/A",
      r.stall?.size || "N/A",
      r.status,
      new Date(r.createdAt).toLocaleDateString(),
      (r.literaryGenres || []).join("; ")
    ]);

    const csv = [headers.join(","), ...rows.map(row => row.map(cell => `"${cell}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reservations_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#4dd9e8] animate-spin" />
            <p className="text-gray-600">Loading reservations...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-3 p-6 border border-red-200 rounded-xl bg-red-50">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-medium text-red-700">{error}</p>
              <button onClick={loadData} className="mt-2 text-sm text-red-600 underline">Try again</button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
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
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] rounded-lg hover:shadow-lg transition-all font-medium"
            >
              <Download size={20} />
              Export CSV
            </button>
          </div>
        </div>


        {/* Reservations Table */}
        <ReservationTable reservations={reservations} />
      </div>
    </AdminLayout>
  );
}