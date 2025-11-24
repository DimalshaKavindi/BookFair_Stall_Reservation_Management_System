// pages/employee/Profile.tsx
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Edit2,
  Save,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { usersAPI } from "../../api/axios";
import EmpLayout from "../../layout/EmpLayout";
import type { User as UserType } from "../../types/UserType";

export default function EmployeeProfile() {
  const [profile, setProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await usersAPI.getProfile();
      setProfile(response.user);
      setFormData({
        businessName: response.user.businessName || "",
        contactPerson: response.user.contactPerson || "",
        phone: response.user.phone || "",
        address: response.user.address || "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const response = await usersAPI.updateProfile(formData);
      setProfile(response.user);
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    if (profile) {
      setFormData({
        businessName: profile.businessName || "",
        contactPerson: profile.contactPerson || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  };

  if (loading) {
    return (
      <EmpLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="font-medium text-gray-600">Loading profile...</p>
          </div>
        </div>
      </EmpLayout>
    );
  }

  return (
    <EmpLayout>
      
        <div className="mx-auto space-y-6 max-w-7xl">
          
       

          {/* Alerts - Only show when NOT editing */}
          {!isEditing && success && (
            <div className="flex items-center gap-3 p-4 mb-6 border border-green-200 rounded-lg bg-green-50">
              <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          )}

          {!isEditing && error && (
            <div className="flex items-center gap-3 p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
              <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-600" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* Profile Card */}
          {profile && (
            <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
              
              {/* Header Section */}
              <div className="bg-gradient-to-br from-[#1a2f8d] via-[#1f52b1] to-[#0d91c5] rounded-xl p-8 text-white shadow-[0_0_20px_rgba(77,217,232,0.4)]">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{profile.businessName || "Employee"}</h2>
                      <p className="mt-1 text-sm text-blue-100">{profile.role}</p>
                     
                    </div>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-8 sm:p-8">
                
                {/* Account Information */}
                <div>
                  <h3 className="flex items-center gap-2 mb-6 text-lg font-semibold text-gray-900">
                    <Mail className="w-5 h-5 text-blue-600" />
                    Account Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                        <input
                          type="email"
                          value={profile.email}
                          disabled
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">Cannot be changed</p>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Role</label>
                        <input
                          type="text"
                          value={profile.role}
                          disabled
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm"
                        />
                        <p className="mt-1 text-xs text-gray-500">System assigned</p>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200" />

                {/* Business Information */}
                <div>
                  <h3 className="flex items-center gap-2 mb-6 text-lg font-semibold text-gray-900">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Business Information
                  </h3>

                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Business Name</label>
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          placeholder="Enter business name"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Contact Person</label>
                        <input
                          type="text"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          placeholder="Enter contact person name"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Address</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter complete address"
                          rows={3}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>

                      {/* Alerts in Edit Mode - Show above buttons */}
                      {success && (
                        <div className="flex items-center gap-3 p-4 border border-green-200 rounded-lg bg-green-50">
                          <CheckCircle className="flex-shrink-0 w-5 h-5 text-green-600" />
                          <p className="text-sm font-medium text-green-800">{success}</p>
                        </div>
                      )}

                      {error && (
                        <div className="flex items-center gap-3 p-4 border border-red-200 rounded-lg bg-red-50">
                          <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-600" />
                          <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                      )}

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {isSaving ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={isSaving}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">Business Name</label>
                        <p className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm">
                          {profile.businessName || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">Contact Person</label>
                        <p className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 text-sm">
                          {profile.contactPerson || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">Phone Number</label>
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                          <Phone className="flex-shrink-0 w-4 h-4 text-gray-400" />
                          <p className="text-sm text-gray-900">{profile.phone || "Not provided"}</p>
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">Address</label>
                        <div className="flex items-start gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-gray-900">{profile.address || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <hr className="border-gray-200" />


              </div>
            </div>
          )}

        </div>
   
    </EmpLayout>
  );
}