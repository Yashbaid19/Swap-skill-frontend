import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { Search, User as UserIcon, Clock, MessageCircle } from "lucide-react";
import { swapApi, userApi } from "../lib/api";

interface User {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  rating: number;
  location?: string;
  profilePicture?: string;
}

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

export default function SwapRequest() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchParams] = useSearchParams();
  const preselectedUserId = searchParams.get("userId");

  const [formData, setFormData] = useState({
    requestedTo: preselectedUserId || "",
    skillOffered: "",
    skillRequested: "",
    availability: [] as string[],
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserSearch, setShowUserSearch] = useState(!preselectedUserId);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await userApi.searchUsers();
        setUsers(response.users || []);
      } catch (err) {
        console.error("Error loading users:", err);
        setError("Failed to load users. Please try again.");
        // Fallback to mock data if API fails
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  // Search users by skill when search term changes
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm.trim()) {
        // Load all users when search is empty
        try {
          const response = await userApi.searchUsers();
          setUsers(response.users || []);
        } catch (err) {
          console.error("Error loading users:", err);
        }
        return;
      }

      try {
        setLoadingUsers(true);
        const response = await userApi.searchUsers(searchTerm);
        setUsers(response.users || []);
      } catch (err) {
        console.error("Error searching users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (isAuthenticated) {
      const timeoutId = setTimeout(searchUsers, 300); // Debounce search
      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, isAuthenticated]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

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

  const filteredUsers = users.filter(
    (currentUser) =>
      currentUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currentUser.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const selectedUser = users.find(
    (currentUser) => currentUser.id === formData.requestedTo,
  );

  const handleAvailabilityChange = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter((item) => item !== option)
        : [...prev.availability, option],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await swapApi.sendRequest({
        toUserId: formData.requestedTo,
        offeredSkill: formData.skillOffered,
        wantedSkill: formData.skillRequested,
        availability: formData.availability,
        message: formData.message,
      });

      // Show success message and redirect
      alert("Swap request sent successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Error sending swap request:", err);
      setError(err.message || "Failed to send swap request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Send Swap Request
            </h1>
            <p className="text-xl text-gray-600">
              Connect with other users to exchange skills and knowledge
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-sm border p-6 space-y-6"
          >
            {/* User Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserIcon className="w-4 h-4 inline mr-1" />
                Send Request To *
              </label>

              {!selectedUser && (
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search for users by name or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-skillswap-black focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {selectedUser ? (
                <div className="flex items-center gap-4 p-4 bg-skillswap-light-gray rounded-lg">
                  <div className="w-12 h-12 bg-skillswap-yellow rounded-full flex items-center justify-center text-lg font-bold text-skillswap-black">
                    {selectedUser.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {selectedUser.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Skills: {selectedUser.skills.join(", ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, requestedTo: "" }));
                      setShowUserSearch(true);
                    }}
                    className="text-sm text-skillswap-black hover:underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {loadingUsers ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
                      <p className="text-gray-500">Loading users...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      {searchTerm
                        ? `No users found matching "${searchTerm}"`
                        : "No users available"}
                    </p>
                  ) : (
                    filteredUsers.map((userItem) => (
                      <div
                        key={userItem.id}
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            requestedTo: userItem.id,
                          }));
                          setShowUserSearch(false);
                        }}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="w-10 h-10 bg-skillswap-yellow rounded-full flex items-center justify-center text-sm font-bold text-skillswap-black">
                          {userItem.avatar}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {userItem.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {userItem.skills.slice(0, 2).join(", ")}
                            {userItem.skills.length > 2 && "..."}
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          ★ {userItem.rating}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Skill Offered */}
            <div>
              <label
                htmlFor="skillOffered"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Skill You're Offering *
              </label>
              <input
                type="text"
                id="skillOffered"
                required
                value={formData.skillOffered}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    skillOffered: e.target.value,
                  }))
                }
                placeholder="e.g., Python Programming, Graphic Design, Spanish Language"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-skillswap-black focus:border-transparent"
              />
            </div>

            {/* Skill Requested */}
            <div>
              <label
                htmlFor="skillRequested"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Skill You Want to Learn *
              </label>
              <input
                type="text"
                id="skillRequested"
                required
                value={formData.skillRequested}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    skillRequested: e.target.value,
                  }))
                }
                placeholder="e.g., Photoshop, Web Development, Guitar Playing"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-skillswap-black focus:border-transparent"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Your Availability * (Select all that apply)
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {availabilityOptions.map((option) => (
                  <label
                    key={option}
                    className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                      formData.availability.includes(option)
                        ? "border-skillswap-black bg-skillswap-light-gray"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.availability.includes(option)}
                      onChange={() => handleAvailabilityChange(option)}
                      className="w-4 h-4 text-skillswap-black bg-gray-100 border-gray-300 rounded focus:ring-skillswap-black focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
              {formData.availability.length === 0 && (
                <p className="text-red-500 text-sm mt-1">
                  Please select at least one availability option
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <MessageCircle className="w-4 h-4 inline mr-1" />
                Personal Message (Optional)
              </label>
              <textarea
                id="message"
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Introduce yourself and explain why you'd like to do this skill swap..."
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-skillswap-black focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.message.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.requestedTo ||
                  !formData.skillOffered ||
                  !formData.skillRequested ||
                  formData.availability.length === 0
                }
                className="flex-1 px-6 py-3 bg-skillswap-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Sending Request..." : "Send Swap Request"}
              </button>
            </div>
          </form>

          {/* Form Preview */}
          {(formData.requestedTo ||
            formData.skillOffered ||
            formData.skillRequested) && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Request Preview
              </h3>
              <div className="space-y-2 text-sm">
                {selectedUser && (
                  <p>
                    <span className="font-medium">To:</span> {selectedUser.name}
                  </p>
                )}
                {formData.skillOffered && (
                  <p>
                    <span className="font-medium">Offering:</span>{" "}
                    {formData.skillOffered}
                  </p>
                )}
                {formData.skillRequested && (
                  <p>
                    <span className="font-medium">Requesting:</span>{" "}
                    {formData.skillRequested}
                  </p>
                )}
                {formData.availability.length > 0 && (
                  <p>
                    <span className="font-medium">Available:</span>{" "}
                    {formData.availability.join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
