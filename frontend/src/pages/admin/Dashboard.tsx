
import {
  Award,
  Calendar,
  CheckCircle,
  LayoutGrid,
  Loader2,
  Store,
  TrendingUp,
  UserCog,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI, reservationsAPI, stallsAPI } from "../../api/axios";
import StatCard from "../../components/StatCard";
import AdminLayout from "../../layout/AdminLayout";
import type { DashboardStats } from "../../types/DashboardStats";
import type { Reservation } from "../../types/ReservationType";
import type { Stall } from "../../types/StallType";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    total: 0, reserved: 0, available: 0, totalVendors: 0,
    smallReserved: 0, mediumReserved: 0, largeReserved: 0,
  });
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [stallsRes, reservationsRes, employeesRes] = await Promise.all([
        stallsAPI.getAll(),
        reservationsAPI.getAll(),
        adminAPI.getEmployees()
      ]);

      const stalls = stallsRes.stalls;
      const reservations = reservationsRes.reservations;
      const reserved = stalls.filter((s: Stall) => !s.isAvailable);
      const uniqueVendors = new Set(
        reservations
          .filter((r: Reservation) => r.status === "ACTIVE")
          .map((r: Reservation) => r.userId)
      );

      setStats({
        total: stalls.length,
        reserved: reserved.length,
        available: stalls.filter((s: Stall) => s.isAvailable).length,
        totalVendors: uniqueVendors.size,
        smallReserved: reserved.filter((s: Stall) => s.size === "SMALL").length,
        mediumReserved: reserved.filter((s: Stall) => s.size === "MEDIUM").length,
        largeReserved: reserved.filter((s: Stall) => s.size === "LARGE").length,
      });

      setRecentReservations(reservations.slice(0, 5));
      setEmployeeCount(employeesRes.employees?.length || 0);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const occupancyRate = stats.total > 0 ? Math.round((stats.reserved / stats.total) * 100) : 0;

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-800 border-green-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
    };
    return styles[status] || styles.ACTIVE;
  };

  const getSizeBadge = (size: string) => {
    const styles: Record<string, string> = {
      SMALL: "bg-blue-50 text-blue-700 border-blue-200",
      MEDIUM: "bg-purple-50 text-purple-700 border-purple-200",
      LARGE: "bg-orange-50 text-orange-700 border-orange-200",
    };
    return styles[size] || styles.SMALL;
  };

  const smallCount = Math.round(stats.total * 0.4);
  const mediumCount = Math.round(stats.total * 0.35);
  const largeCount = stats.total - smallCount - mediumCount;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#4dd9e8] animate-spin" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="p-6 text-center border border-red-200 bg-red-50 rounded-xl">
            <p className="mb-4 text-red-700">{error}</p>
            <button
              onClick={loadData}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto space-y-6 max-w-7xl">
        {/* Header */}
         <div className="bg-gradient-to-br from-[#4dd9e8] to-[#2ab7c9] rounded-xl p-8 text-white shadow-[0_0_20px_rgba(77,217,232,0.4)]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-white drop-shadow-md">Colombo International Book Fair 2026</h1>
              <p className="text-lg text-white/95 drop-shadow">Admin Dashboard - Sri Lanka Book Publishers' Association</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white/20 backdrop-blur-sm border-white/30">
                  <Calendar className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">September 15-24, 2026</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white/20 backdrop-blur-sm border-white/30">
                  <Award className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">BMICH, Colombo 07</span>
                </div>
              </div>
            </div>
          </div>
        </div>

    
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Stalls" value={stats.total} icon={LayoutGrid} color="blue" />
          <StatCard title="Reserved Stalls" value={stats.reserved} icon={CheckCircle} color="green" />
          <StatCard title="Available Stalls" value={stats.available} icon={Store} color="orange" />
          <StatCard title="Employees" value={employeeCount} icon={UserCog} color="purple" />
        </div>

       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm lg:col-span-2 rounded-xl hover:shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Stall Occupancy Overview</h3>
                <p className="mt-1 text-sm text-gray-600">Real-time reservation status</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">{occupancyRate}% occupied</span>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <span className="text-4xl font-bold text-gray-900">{occupancyRate}%</span>
                    <span className="ml-2 text-sm text-gray-500">occupied</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{stats.reserved} of {stats.total} stalls</div>
                    <div className="mt-1 text-xs text-gray-500">{stats.available} remaining</div>
                  </div>
                </div>
                <div className="w-full h-4 overflow-hidden bg-gray-100 rounded-full shadow-inner">
                  <div
                    className="bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] h-4 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.smallReserved}</div>
                  <div className="mt-1 text-xs text-gray-600">Small Reserved</div>
                </div>
                <div className="text-center border-gray-100 border-x">
                  <div className="text-2xl font-bold text-gray-900">{stats.mediumReserved}</div>
                  <div className="mt-1 text-xs text-gray-600">Medium Reserved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stats.largeReserved}</div>
                  <div className="mt-1 text-xs text-gray-600">Large Reserved</div>
                </div>
              </div>
            </div>
          </div>

 
          <div className="p-6 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Stall Statistics</h3>
                <p className="mt-1 text-sm text-gray-600">Total created stalls</p>
              </div>
                <button
                onClick={() => navigate("/admin/stalls")}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] hover:shadow-lg rounded-lg transition-all"
              >
                View All
              </button>
            </div>
           

            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between p-3 border border-blue-100 rounded-lg bg-blue-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Small</span>
                </div>
                <span className="text-lg font-bold text-blue-700">{smallCount}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-purple-100 rounded-lg bg-purple-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Medium</span>
                </div>
                <span className="text-lg font-bold text-purple-700">{mediumCount}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-orange-100 rounded-lg bg-orange-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700">Large</span>
                </div>
                <span className="text-lg font-bold text-orange-700">{largeCount}</span>
              </div>
            </div>

           
          </div>
        </div>

 
        <div className="transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Reservations</h3>
                <p className="mt-1 text-sm text-gray-600">Latest bookings from vendors</p>
              </div>
              <button
                onClick={() => navigate("/admin/reservations")}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] hover:shadow-lg rounded-lg transition-all"
              >
                View All
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  {["Business Name", "Stall", "Size", "Status", "Date"].map((h) => (
                    <th key={h} className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentReservations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No reservations yet</td>
                  </tr>
                ) : (
                  recentReservations.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">{r.user?.businessName || "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-br from-[#4dd9e8] to-[#2ab7c9] text-white font-bold text-sm rounded-lg shadow-sm">
                          {r.stall?.name || `Stall #${r.stallId}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getSizeBadge(r.stall?.size || "SMALL")}`}>
                          {r.stall?.size || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(r.status)}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}