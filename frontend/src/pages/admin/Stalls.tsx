// pages/admin/Stalls.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Plus, Loader2, AlertCircle, Warehouse } from 'lucide-react';
import { stallsAPI } from '../../api/axios';
import AdminLayout from '../../layout/AdminLayout';
import type { Stall } from '../../types/StallType';
import StallMap from '../../components/StallMap';

export default function AdminStalls() {
  const navigate = useNavigate();
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  



  useEffect(() => {
    loadStalls();
  }, []);

  const loadStalls = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await stallsAPI.getAll();
      setStalls(response.stalls || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load stalls');
    } finally {
      setLoading(false);
    }
  };



  const handleStallClick = (stall: Stall) => {
    
    navigate(`/admin/stalls/${stall.id}`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#4dd9e8] animate-spin" />
            <p className="text-gray-600">Loading stalls...</p>
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
              <button
                onClick={loadStalls}
                className="mt-2 text-sm text-red-600 underline hover:text-red-700"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl">
      
        <div className="p-6 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <Store className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Stalls Management</h1>
                <p className="text-gray-600">Manage all exhibition stalls</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/stalls/create')}
              className="flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] rounded-lg hover:shadow-lg transition-all font-medium"
            >
              <Plus size={20} />
              Add Stall
            </button>
          </div>
        </div>

         <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
        <h3 className='flex items-center gap-3 mb-4 text-lg font-bold text-gray-900'>
          <Warehouse className="w-5 h-5 text-gray-500" />
          Stall Type Legend
        </h3>
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-14">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 border-2 rounded-lg bg-emerald-400 border-emerald-500">
                <span className="text-sm font-bold text-white">S</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Small Stall (2x2m) - LKR 20,000</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-400 border-2 border-yellow-500 rounded-lg">
                <span className="text-sm font-bold text-white">M</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Medium Stall (3x3m) - LKR 35,000</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-red-400 border-2 border-red-500 rounded-lg">
                <span className="text-sm font-bold text-white">L</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Large Stall (4x3m) - LKR 50,000</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-300 border-2 border-gray-400 rounded-lg opacity-60">
                <span className="text-xs text-gray-600">✕</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Reserved</span>
            </div>
          </div>
        </div>
      </div>

     
        <div className="mb-6">
          <StallMap 
            stalls={stalls}
            onStallClick={handleStallClick}
            readOnly={true}
            showLegend={true}
            highlightReserved={true}
          />
        </div>
      </div>
    </AdminLayout>
  );
}