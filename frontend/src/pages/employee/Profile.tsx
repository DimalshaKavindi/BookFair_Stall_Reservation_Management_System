// pages/employee/Profile.tsx
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Users,
  Edit2,
  Save,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
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
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-5xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Profile Settings</h1>
            <p className="mt-2 text-gray-600">Manage your employee account information</p>
          </div>

          {/* Success Alert */}
          {success && (
            <div className="flex items-center gap-3 p-4 mb-6 border rounded-lg bg-emerald-50 border-emerald-200">
              <CheckCircle className="flex-shrink-0 w-5 h-5 text-emerald-600" />
              <p className="font-medium text-emerald-700">{success}</p>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
              <AlertCircle className="flex-shrink-0 w-5 h-5 text-red-600" />
              <p className="font-medium text-red-700">{error}</p>
            </div>
          )}

          {/* Profile Card */}
          {profile && (
            <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
              
              {/* Profile Header */}
              <div className="px-8 py-12 bg-gradient-to-r from-blue-600 to-blue-700">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center justify-center w-20 h-20 border-2 rounded-full bg-white/20 backdrop-blur-sm border-white/30">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{profile.businessName || "Employee"}</h2>
                      <p className="mt-1 text-sm font-medium tracking-wide text-blue-100 uppercase">{profile.role}</p>
                      <p className="mt-2 text-sm text-blue-200">ID: #{profile.id}</p>
                    </div>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-sm hover:shadow-md"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Content */}
              <div className="p-8 space-y-8">
                
                {/* Account Information Section */}
                <div>
                  <h3 className="flex items-center gap-2 mb-6 text-lg font-semibold text-gray-900">
                    <Mail className="w-5 h-5 text-blue-600" />
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Email */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full px-4 py-3 font-medium text-gray-900 border border-gray-200 rounded-lg bg-gray-50"
                      />
                      <p className="mt-1 text-xs text-gray-500">Cannot be changed</p>
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Role</label>
                      <input
                        type="text"
                        value={profile.role}
                        disabled
                        className="w-full px-4 py-3 font-medium text-gray-900 border border-gray-200 rounded-lg bg-gray-50"
                      />
                      <p className="mt-1 text-xs text-gray-500">System assigned</p>
                    </div>
                  </div>
                </div>

                {/* Business Information Section */}
                <div className="pt-8 border-t border-gray-200">
                  <h3 className="flex items-center gap-2 mb-6 text-lg font-semibold text-gray-900">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Business Information
                  </h3>
                  
                  {isEditing ? (
                    <div className="space-y-6">
                      {/* Business Name */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Business Name</label>
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          placeholder="Enter business name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Contact Person */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Contact Person</label>
                        <input
                          type="text"
                          name="contactPerson"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          placeholder="Enter contact person name"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-700">Address</label>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter complete address"
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-4">
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="inline-flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-white transition-all rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                          className="inline-flex items-center justify-center flex-1 gap-2 px-6 py-3 font-semibold text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      {/* Business Name */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">Business Name</label>
                        <p className="px-4 py-3 text-lg font-medium text-gray-900 border border-gray-200 rounded-lg bg-gray-50">
                          {profile.businessName || "Not provided"}
                        </p>
                      </div>

                      {/* Contact Person */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">Contact Person</label>
                        <p className="px-4 py-3 text-lg font-medium text-gray-900 border border-gray-200 rounded-lg bg-gray-50">
                          {profile.contactPerson || "Not provided"}
                        </p>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">Phone Number</label>
                        <div className="flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <p className="text-lg font-medium text-gray-900">{profile.phone || "Not provided"}</p>
                        </div>
                      </div>

                      {/* Address */}
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600">Address</label>
                        <div className="flex items-start gap-3 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50">
                          <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                          <p className="font-medium text-gray-900">{profile.address || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Info Section */}
                <div className="pt-8 border-t border-gray-200">
                  <h3 className="flex items-center gap-2 mb-6 text-lg font-semibold text-gray-900">
                    <Users className="w-5 h-5 text-blue-600" />
                    Account Details
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Created Date */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-600">Account Created</label>
                      <p className="px-4 py-3 font-medium text-gray-900 border border-gray-200 rounded-lg bg-gray-50">
                        {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : "N/A"}
                      </p>
                    </div>

                    {/* Last Updated */}
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-600">Last Updated</label>
                      <p className="px-4 py-3 font-medium text-gray-900 border border-gray-200 rounded-lg bg-gray-50">
                        {profile.updatedAt ? new Date(profile.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </EmpLayout>
  );
}