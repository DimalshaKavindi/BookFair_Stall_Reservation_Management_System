
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ArrowLeft, Loader2 } from 'lucide-react';
import { adminAPI } from '../../api/axios';
import AdminLayout from '../../layout/AdminLayout';
import { showToastError } from '../../utils/toast/errToast';
import { showToastSuccess } from '../../utils/toast/successToast';

type StallSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export default function CreateStall() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    size: 'SMALL' as StallSize,
    dimensions: '',
    location: '',
    positionX: '',
    positionY: '',
    isAvailable: true,
  });

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      showToastError('Stall name is required');
      return false;
    }
    if (!formData.dimensions.trim()) {
      showToastError('Dimensions are required');
      return false;
    }
    if (!formData.location.trim()) {
      showToastError('Location is required');
      return false;
    }
    if (!formData.positionX || !formData.positionY) {
      showToastError('Position coordinates are required');
      return false;
    }
    const x = parseInt(formData.positionX);
    const y = parseInt(formData.positionY);
    if (isNaN(x) || isNaN(y) || x < 0 || y < 0) {
      showToastError('Position coordinates must be valid positive numbers');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await adminAPI.createStall({
        name: formData.name,
        size: formData.size,
        dimensions: formData.dimensions,
        location: formData.location,
        positionX: parseInt(formData.positionX),
        positionY: parseInt(formData.positionY),
        isAvailable: formData.isAvailable,
      });
      showToastSuccess('Stall created successfully!');
      
      setTimeout(() => {
        navigate('/admin/stalls');
      }, 1500);
    } catch (err: any) {
      showToastError(err.message || 'Failed to create stall');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full min-h-screen bg-gray-50">
        <div className="p-8 mb-6 bg-white border border-gray-200 shadow-sm rounded-xl">
          <button
            onClick={() => navigate('/admin/stalls')}
            className="flex items-center gap-2 mb-4 text-gray-600 transition-colors hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <ArrowLeft size={20} />
            <span>Back to Stalls</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
              <Store className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Stall</h1>
              <p className="text-gray-600">Add a new stall to the exhibition</p>
            </div>
          </div>
        </div>

        <div className="w-full p-8 bg-white border border-gray-200 shadow-sm rounded-xl">
          <form onSubmit={handleSubmit} className="space-y-8">
        
            <div>
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Basic Information</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Stall Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all"
                      placeholder="e.g., A-01, B-15"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Stall Size *
                    </label>
                    <select
                      value={formData.size}
                      onChange={(e) => updateField('size', e.target.value as StallSize)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all"
                      disabled={isLoading}
                    >
                      <option value="SMALL">Small</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LARGE">Large</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Dimensions *
                    </label>
                    <input
                      type="text"
                      value={formData.dimensions}
                      onChange={(e) => updateField('dimensions', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all"
                      placeholder="e.g., 3m x 3m, 4m x 4m"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all"
                      placeholder="e.g., Hall A, Near entrance"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>

  
            <div className="pt-8 border-t border-gray-200">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Map Position</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Position X (Horizontal) *
                  </label>
                  <input
                    type="number"
                    value={formData.positionX}
                    onChange={(e) => updateField('positionX', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all"
                    placeholder="0"
                    min="0"
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-xs text-gray-500">Left to right position on the map</p>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Position Y (Vertical) *
                  </label>
                  <input
                    type="number"
                    value={formData.positionY}
                    onChange={(e) => updateField('positionY', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2ab7c9] focus:border-transparent outline-none transition-all"
                    placeholder="0"
                    min="0"
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-xs text-gray-500">Top to bottom position on the map</p>
                </div>
              </div>
            </div>

      
            <div className="pt-8 border-t border-gray-200">
              <h3 className="mb-6 text-lg font-semibold text-gray-900">Availability Settings</h3>
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => updateField('isAvailable', e.target.checked)}
                    className="w-5 h-5 mt-0.5 text-[#2ab7c9] border-gray-300 rounded focus:ring-[#2ab7c9]"
                    disabled={isLoading}
                  />
                  <div>
                    <p className="font-medium text-gray-900">Available for booking</p>
                    <p className="text-sm text-gray-600">
                      When enabled, this stall can be reserved by vendors through the system
                    </p>
                  </div>
                </label>
              </div>
            </div>

   
            <div className="flex gap-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/admin/stalls')}
                disabled={isLoading}
                className="flex-1 px-6 py-3 font-medium text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Stall'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}