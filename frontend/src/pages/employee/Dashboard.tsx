// frontend/src/pages/employee/Dashboard.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  CheckCircle,

  Users,
  TrendingUp,
  List,
  Calendar,
  Award,
 
  Store
} from "lucide-react";
import StatCard from "../../components/StatCard";
import EmpLayout from "../../layout/EmpLayout";

// Mock data
const mockStats = {
  total: 26,
  reserved: 18,
  available: 8,
  totalVendors: 15,
  revenue: "LKR 2.4M"
};

const mockRecentReservations = [
  { 
    id: 1, 
    business: "Galaxy Books", 
    stall: "A-12", 
    size: "SMALL", 
    status: "ACTIVE",
    reservedDate: "2024-11-10",
    contact: "Nimal Perera"
  },
  { 
    id: 2, 
    business: "Sarasavi Publishers", 
    stall: "B-08", 
    size: "MEDIUM", 
    status: "ACTIVE",
    reservedDate: "2024-11-09",
    contact: "Kamala Silva"
  },
  { 
    id: 3, 
    business: "Vijitha Yapa", 
    stall: "C-15", 
    size: "LARGE", 
    status: "ACTIVE",
    reservedDate: "2024-11-08",
    contact: "Sunil Fernando"
  },
  { 
    id: 4, 
    business: "MD Gunasena", 
    stall: "D-22", 
    size: "MEDIUM", 
    status: "ACTIVE",
    reservedDate: "2024-11-07",
    contact: "Priyanka De Silva"
  },
  { 
    id: 5, 
    business: "Lake House Bookshop", 
    stall: "E-05", 
    size: "SMALL", 
    status: "PENDING",
    reservedDate: "2024-11-06",
    contact: "Rajitha Wickrama"
  }
];

const mockGenreDistribution = [
  { genre: "Fiction", count: 8, percentage: 28 },
  { genre: "Educational", count: 7, percentage: 24 },
  { genre: "Children's Books", count: 5, percentage: 17 },
  { genre: "Religious", count: 4, percentage: 14 },
  { genre: "Other", count: 5, percentage: 17 }
];

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [stats] = useState(mockStats);
  const [recentReservations] = useState(mockRecentReservations);
  const [genreDistribution] = useState(mockGenreDistribution);

  const occupancyRate = Math.round((stats.reserved / stats.total) * 100);
 

  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: "bg-green-100 text-green-800 border-green-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200"
    };
    return styles[status as keyof typeof styles] || styles.ACTIVE;
  };

  const getSizeBadge = (size: string) => {
    const styles = {
      SMALL: "bg-blue-50 text-blue-700 border-blue-200",
      MEDIUM: "bg-purple-50 text-purple-700 border-purple-200",
      LARGE: "bg-orange-50 text-orange-700 border-orange-200"
    };
    return styles[size as keyof typeof styles] || styles.SMALL;
  };

  return (
    <EmpLayout>
      <div className="max-w-7xl mx-auto space-y-6">
       {/* Header Section */}
        <div className="bg-gradient-to-br from-[#4dd9e8] to-[#2ab7c9] rounded-xl p-8 text-white shadow-[0_0_20px_rgba(77,217,232,0.4)]">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white drop-shadow-md">
                Colombo International Book Fair 2024
              </h1>
              <p className="text-white/95 text-lg drop-shadow">
                Organizer Dashboard - Sri Lanka Book Publishers' Association
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                  <Calendar className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">December 15-25, 2024</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/30">
                  <Award className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">BMICH, Colombo 07</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Stalls"
            value={stats.total}
            icon={LayoutGrid}
            color="blue"
          />
          <StatCard
            title="Reserved Stalls"
            value={stats.reserved}
            icon={CheckCircle}
            color="green"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Available Stalls"
            value={stats.available}
            icon={Store}
            color="orange"
          />
          <StatCard
            title="Total Vendors"
            value={stats.totalVendors}
            icon={Users}
            color="purple"
          />
        </div>

        {/* Occupancy & Genre Distribution Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Occupancy Rate Card */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Stall Occupancy Overview
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Real-time reservation status
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">+12% vs last year</span>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Main occupancy rate */}
              <div>
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <span className="text-4xl font-bold text-gray-900">
                      {occupancyRate}%
                    </span>
                    <span className="text-gray-500 text-sm ml-2">occupied</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {stats.reserved} of {stats.total} stalls
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stats.available} remaining
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] h-4 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
              </div>

              {/* Breakdown by size */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">6</div>
                  <div className="text-xs text-gray-600 mt-1">Small Stalls</div>
                  <div className="text-xs text-[#2ab7c9] font-medium mt-0.5">Reserved</div>
                </div>
                <div className="text-center border-x border-gray-100">
                  <div className="text-2xl font-bold text-gray-900">8</div>
                  <div className="text-xs text-gray-600 mt-1">Medium Stalls</div>
                  <div className="text-xs text-[#2ab7c9] font-medium mt-0.5">Reserved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">4</div>
                  <div className="text-xs text-gray-600 mt-1">Large Stalls</div>
                  <div className="text-xs text-[#2ab7c9] font-medium mt-0.5">Reserved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Genre Distribution */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Genre Distribution
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Top categories
            </p>
            
            <div className="space-y-4">
              {genreDistribution.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {item.genre}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Reservations
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Latest bookings from vendors
                </p>
              </div>
              <button
                onClick={() => navigate("/employee/reservations")}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] hover:shadow-lg rounded-lg transition-all flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                View All Reservations
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact Person
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Stall ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Reserved Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentReservations.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">
                        {reservation.business}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {reservation.contact}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-br from-[#4dd9e8] to-[#2ab7c9] text-white font-bold text-sm rounded-lg shadow-sm">
                        {reservation.stall}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getSizeBadge(reservation.size)}`}>
                        {reservation.size}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {new Date(reservation.reservedDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </EmpLayout>
  );
}