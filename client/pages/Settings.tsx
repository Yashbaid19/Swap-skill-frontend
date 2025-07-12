import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { userApi, authApi } from "../lib/api";
import {
  User,
  Mail,
  Lock,
  MapPin,
  Target,
  Users,
  Clock,
  Upload,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  Trash2,
  LogOut,
  X,
  Camera,
} from "lucide-react";

const skillOptions = [
  "Programming",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "UI/UX Design",
  "Graphic Design",
  "Digital Marketing",
  "Content Writing",
  "Photography",
  "Video Editing",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Guitar",
  "Piano",
  "Singing",
  "Cooking",
  "Baking",
  "Yoga",
  "Fitness Training",
  "Public Speaking",
  "Project Management",
  "Business Strategy",
  "Accounting",
  "Excel/Spreadsheets",
];

const availabilityOptions = [
  "Weekdays (9 AM - 5 PM)",
  "Weekdays (Evening)",
  "Weekends",
  "Saturday Morning",
  "Saturday Afternoon",
  "Sunday Morning",
  "Sunday Afternoon",
  "Flexible Schedule",
];

export default function Settings() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.profilePicture || "");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load user data from context and allow editing
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    location: user?.location || "",
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
    availability: user?.availability || [],
    profilePicture: null as File | null,
  });

  // Update profile data when user context changes
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        email: user.email || "",
        location: user.location || "",
        skillsOffered: user.skillsOffered || [],
        skillsWanted: user.skillsWanted || [],
        availability: user.availability || [],
        profilePicture: null,
      });
      setImagePreview(user.profilePicture || "");
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSkillToggle = (skill: string, type: "offered" | "wanted") => {
    const key = type === "offered" ? "skillsOffered" : "skillsWanted";
    setProfileData((prev) => ({
      ...prev,
      [key]: prev[key].includes(skill)
        ? prev[key].filter((s) => s !== skill)
        : [...prev[key], skill],
    }));
  };

  const handleAvailabilityToggle = (option: string) => {
    setProfileData((prev) => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter((item) => item !== option)
        : [...prev.availability, option],
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData((prev) => ({ ...prev, profilePicture: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validatePasswordChange = () => {
    const newErrors: { [key: string]: string } = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setErrors({});

    try {
      // Prepare data for backend API
      const updateData = {
        name: profileData.fullName,
        location: profileData.location,
        skillsOffered: profileData.skillsOffered,
        skillsWanted: profileData.skillsWanted,
        availability: profileData.availability.join(", "), // Convert array to string for backend
      };

      // Update profile via new backend API
      const updatedProfile = await userApi.updateUserProfile(updateData);

      // Update user context with response data
      updateUser({
        fullName: updatedProfile.name || profileData.fullName,
        email: profileData.email, // Email typically not updated via profile endpoint
        location: updatedProfile.location || profileData.location,
        skillsOffered:
          updatedProfile.skillsOffered || profileData.skillsOffered,
        skillsWanted: updatedProfile.skillsWanted || profileData.skillsWanted,
        availability:
          typeof updatedProfile.availability === "string"
            ? updatedProfile.availability.split(", ").map((s) => s.trim())
            : updatedProfile.availability || profileData.availability,
      });

      setSuccessMessage("✅ Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert(error.message || "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePasswordChange()) return;

    setIsSaving(true);

    try {
      await authApi.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      alert("Password changed successfully!");
    } catch (error: any) {
      console.error("Error changing password:", error);
      setErrors({
        currentPassword: error.message || "Failed to change password",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteAccount = () => {
    // Simulate account deletion
    logout();
    navigate("/");
    alert("Account deleted successfully");
  };

  const handleProfilePictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      const { imageUrl } = await userApi.uploadProfilePicture(file);
      setImagePreview(imageUrl);

      // Update user context with new profile picture
      updateUser({
        ...user,
        profilePicture: imageUrl,
      });

      setSuccessMessage("✅ Profile picture updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      console.error("Upload failed:", err);
      alert(
        err.message || "Failed to upload profile picture. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Show loading while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile Settings", icon: User },
    { id: "account", label: "Account Settings", icon: Lock },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Settings</h1>
            <p className="text-xl text-gray-600">
              Manage your account and profile preferences
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
                <div className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          activeTab === tab.id
                            ? "bg-skillswap-black text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border p-8">
                {/* Profile Settings */}
                {activeTab === "profile" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                        Profile Settings
                      </h2>

                      {/* Profile Picture */}
                      <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Profile Picture
                        </label>
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                              {imagePreview ? (
                                <img
                                  src={imagePreview}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : profilePreview ? (
                                <img
                                  src={profilePreview}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <label
                              htmlFor="profile-upload"
                              className="absolute bottom-0 right-0 w-8 h-8 bg-skillswap-black rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
                            >
                              <Camera className="w-4 h-4 text-white" />
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="profile-upload"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-600 mb-2">
                              Click the camera icon to update your profile
                              picture
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                              Recommended size: 200x200px. Accepts JPG, PNG, GIF
                            </p>

                            {/* New Upload Button */}
                            <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              onChange={handleProfilePictureUpload}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploading}
                              className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                              <Upload className="w-4 h-4" />
                              {uploading ? "Uploading..." : "Upload New Photo"}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Basic Info */}
                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-1" />
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profileData.fullName}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                fullName: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skillswap-black"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 inline mr-1" />
                            Location
                          </label>
                          <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                location: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skillswap-black"
                            placeholder="City, Country"
                          />
                        </div>
                      </div>

                      {/* Skills Offered */}
                      <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          <Target className="w-4 h-4 inline mr-1" />
                          Skills You Offer
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4">
                          {skillOptions.map((skill) => (
                            <label
                              key={skill}
                              className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                                profileData.skillsOffered.includes(skill)
                                  ? "bg-skillswap-yellow text-skillswap-black"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={profileData.skillsOffered.includes(
                                  skill,
                                )}
                                onChange={() =>
                                  handleSkillToggle(skill, "offered")
                                }
                                className="w-4 h-4 text-skillswap-black rounded mr-2"
                              />
                              <span className="text-sm">{skill}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Skills Wanted */}
                      <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          <Users className="w-4 h-4 inline mr-1" />
                          Skills You Want to Learn
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4">
                          {skillOptions.map((skill) => (
                            <label
                              key={skill}
                              className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                                profileData.skillsWanted.includes(skill)
                                  ? "bg-blue-100 text-blue-800"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={profileData.skillsWanted.includes(
                                  skill,
                                )}
                                onChange={() =>
                                  handleSkillToggle(skill, "wanted")
                                }
                                className="w-4 h-4 text-blue-600 rounded mr-2"
                              />
                              <span className="text-sm">{skill}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Your Availability
                        </label>
                        <div className="grid md:grid-cols-2 gap-3">
                          {availabilityOptions.map((option) => (
                            <label
                              key={option}
                              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                                profileData.availability.includes(option)
                                  ? "border-skillswap-black bg-skillswap-light-gray"
                                  : "border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={profileData.availability.includes(
                                  option,
                                )}
                                onChange={() =>
                                  handleAvailabilityToggle(option)
                                }
                                className="w-4 h-4 text-skillswap-black rounded mr-3"
                              />
                              <span className="text-sm">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={handleSaveProfile}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-6 py-3 bg-skillswap-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          {isSaving ? "Saving..." : "Save Profile"}
                        </button>

                        {successMessage && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-green-800 text-sm">
                              {successMessage}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Settings */}
                {activeTab === "account" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                        Account Settings
                      </h2>

                      {/* Email Section */}
                      <div className="bg-gray-50 rounded-lg p-6 mb-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                              Email Address
                            </h3>
                            <p className="text-gray-600">{profileData.email}</p>
                          </div>
                          <button className="px-4 py-2 text-skillswap-black border border-skillswap-black rounded-lg hover:bg-skillswap-black hover:text-white transition-colors">
                            Update Email
                          </button>
                        </div>
                      </div>

                      {/* Change Password */}
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          Change Password
                        </h3>
                        <div className="space-y-4 max-w-md">
                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <input
                              type={showCurrentPassword ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  currentPassword: e.target.value,
                                }))
                              }
                              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-skillswap-black ${
                                errors.currentPassword
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                              className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                            {errors.currentPassword && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.currentPassword}
                              </p>
                            )}
                          </div>

                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  newPassword: e.target.value,
                                }))
                              }
                              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-skillswap-black ${
                                errors.newPassword
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
                            >
                              {showNewPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                            {errors.newPassword && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.newPassword}
                              </p>
                            )}
                          </div>

                          <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  confirmPassword: e.target.value,
                                }))
                              }
                              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-skillswap-black ${
                                errors.confirmPassword
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                              ) : (
                                <Eye className="w-5 h-5" />
                              )}
                            </button>
                            {errors.confirmPassword && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.confirmPassword}
                              </p>
                            )}
                          </div>

                          <button
                            onClick={handleChangePassword}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-3 bg-skillswap-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                          >
                            <Lock className="w-4 h-4" />
                            {isSaving ? "Changing..." : "Change Password"}
                          </button>
                        </div>
                      </div>

                      {/* Logout */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                              Sign Out
                            </h3>
                            <p className="text-gray-600">
                              Sign out of your account on this device
                            </p>
                          </div>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Danger Zone */}
                {activeTab === "danger" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-red-600 mb-6">
                        Danger Zone
                      </h2>

                      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-red-900 mb-2">
                              Delete Account
                            </h3>
                            <p className="text-red-700 mb-4">
                              Once you delete your account, there is no going
                              back. Please be certain.
                            </p>
                            <ul className="text-sm text-red-600 space-y-1">
                              <li>• All your profile data will be removed</li>
                              <li>• Your skill swap history will be deleted</li>
                              <li>• This action cannot be undone</li>
                            </ul>
                          </div>
                          <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Account
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you absolutely sure you want to delete your account? This
              action cannot be undone and you will lose all your data.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
