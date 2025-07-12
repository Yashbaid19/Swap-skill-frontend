import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import {
  User,
  Mail,
  MapPin,
  Star,
  Edit3,
  Check,
  X,
  Clock,
  Target,
  Users,
  TrendingUp,
  Award,
  MessageCircle,
  Trash2,
  Calendar,
  Badge,
  RefreshCw,
} from "lucide-react";
import { userApi, swapApi, feedbackApi } from "../lib/api";

// Types for API responses
interface SwapRequest {
  id: string;
  fromUser: {
    name: string;
    email: string;
    skillsOffered: string[];
  };
  skillWanted: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

interface OutgoingRequest {
  id: string;
  toUser: {
    name: string;
    email: string;
  };
  skillOffered: string;
  skillWanted: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

interface Feedback {
  id: string;
  type: "given" | "received";
  user: string;
  skill: string;
  rating: number;
  message: string;
  date: string;
}

interface DashboardData {
  user: {
    name: string;
    email: string;
    location?: string;
    skillsOffered: string[];
    skillsWanted: string[];
    availability: string[];
    profilePicture?: string;
  };
  stats: {
    swapsCompleted: number;
    avgRating: number;
    skillsShared: number;
    skillsLearning: number;
  };
  incomingRequests: SwapRequest[];
  sentRequests: OutgoingRequest[];
  feedbackReceived: Feedback[];
  feedbackGiven: Feedback[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, user, updateUser } = useAuth();
  const [processingRequest, setProcessingRequest] = useState<string | null>(
    null,
  );

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // State for dashboard stats from new API
  const [dashboardStats, setDashboardStats] = useState({
    totalSwaps: 0,
    acceptedSwaps: 0,
    rejectedSwaps: 0,
    feedbacks: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Load dashboard data
  const loadDashboardData = async () => {
    try {
      setError(null);
      const data = await userApi.getDashboard(user?.id);
      setDashboardData(data);

      // Update user context with latest user data
      if (data.user) {
        updateUser(data.user);
      }
    } catch (err: any) {
      console.error("Error loading dashboard:", err);
      setError(err.message || "Failed to load dashboard data");

      // Fallback to mock data if API fails
      setDashboardData({
        user: {
          name: user?.fullName || "John Doe",
          email: user?.email || "john.doe@example.com",
          location: user?.location || "San Francisco, CA",
          skillsOffered: user?.skillsOffered || [
            "React",
            "JavaScript",
            "Node.js",
          ],
          skillsWanted: user?.skillsWanted || ["Python", "UI/UX Design"],
          availability: user?.availability || ["Weekends", "Evenings"],
          profilePicture: user?.profilePicture,
        },
        stats: {
          swapsCompleted: 0,
          avgRating: 0,
          skillsShared: user?.skillsOffered?.length || 0,
          skillsLearning: user?.skillsWanted?.length || 0,
        },
        incomingRequests: [],
        sentRequests: [],
        feedbackReceived: [],
        feedbackGiven: [],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load dashboard stats from new API
  const fetchDashboardStats = async () => {
    if (!user?.id) return;

    try {
      setStatsError(null);
      setStatsLoading(true);
      const statsData = await userApi.getDashboardStats(user.id);
      setDashboardStats({
        totalSwaps: statsData.totalSwaps || 0,
        acceptedSwaps: statsData.acceptedSwaps || 0,
        rejectedSwaps: statsData.rejectedSwaps || 0,
        feedbacks: statsData.feedbacks || 0,
      });
    } catch (err: any) {
      console.error("Dashboard stats error:", err);
      setStatsError(err.message || "Failed to load dashboard stats");

      // Keep default values on error
      setDashboardStats({
        totalSwaps: 0,
        acceptedSwaps: 0,
        rejectedSwaps: 0,
        feedbacks: 0,
      });
    } finally {
      setStatsLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
      fetchDashboardStats();
    }
  }, [isAuthenticated, user?.id]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
    fetchDashboardStats();
  };

  const handleAcceptRequest = async (requestId: string) => {
    setProcessingRequest(requestId);
    try {
      await swapApi.updateRequestStatus(requestId, "accepted");

      // Update local state
      setDashboardData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          incomingRequests: prev.incomingRequests.map((req) =>
            req.id === requestId
              ? { ...req, status: "accepted" as const }
              : req,
          ),
        };
      });
    } catch (err: any) {
      console.error("Error accepting request:", err);
      alert(err.message || "Failed to accept request");
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setProcessingRequest(requestId);
    try {
      await swapApi.updateRequestStatus(requestId, "rejected");

      // Update local state
      setDashboardData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          incomingRequests: prev.incomingRequests.map((req) =>
            req.id === requestId
              ? { ...req, status: "rejected" as const }
              : req,
          ),
        };
      });
    } catch (err: any) {
      console.error("Error rejecting request:", err);
      alert(err.message || "Failed to reject request");
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    try {
      await swapApi.deleteRequest(requestId);

      // Update local state
      setDashboardData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sentRequests: prev.sentRequests.filter((req) => req.id !== requestId),
        };
      });
    } catch (err: any) {
      console.error("Error deleting request:", err);
      alert(err.message || "Failed to delete request");
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Failed to load dashboard data</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-skillswap-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    user: userData,
    stats,
    incomingRequests,
    sentRequests,
    feedbackReceived,
    feedbackGiven,
  } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Dashboard
                </h1>
                <p className="text-xl text-gray-600">
                  Manage your skill swaps and track your progress
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-skillswap-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>

            {error && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  <strong>Note:</strong> {error}. Showing offline data.
                </p>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Profile & Stats */}
            <div className="lg:col-span-1 space-y-6">
              {/* User Profile Section */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Profile
                  </h2>
                  <button
                    onClick={() => navigate("/settings")}
                    className="flex items-center gap-1 px-3 py-1 text-sm text-skillswap-black border border-skillswap-black rounded-lg hover:bg-skillswap-black hover:text-white transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                </div>

                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {userData.profilePicture ? (
                      <img
                        src={userData.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {userData.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{userData.email}</span>
                  </div>
                  {userData.location && (
                    <div className="flex items-center justify-center gap-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{userData.location}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Skills Offered
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {userData.skillsOffered.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Skills Wanted
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {userData.skillsWanted.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Availability
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {userData.availability.map((time) => (
                        <span
                          key={time}
                          className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats Section */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Quick Stats
                  </h2>
                  {statsError && (
                    <span className="text-xs text-yellow-600">Demo Data</span>
                  )}
                </div>

                {statsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {dashboardStats.totalSwaps}
                      </div>
                      <div className="text-xs text-blue-600">Total Swaps</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {dashboardStats.acceptedSwaps}
                      </div>
                      <div className="text-xs text-green-600">Accepted</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {dashboardStats.rejectedSwaps}
                      </div>
                      <div className="text-xs text-red-600">Rejected</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {dashboardStats.feedbacks}
                      </div>
                      <div className="text-xs text-purple-600">Feedbacks</div>
                    </div>
                  </div>
                )}

                {statsError && (
                  <div className="mt-4 text-xs text-yellow-600 text-center">
                    Unable to load live stats: {statsError}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Requests & Feedback */}
            <div className="lg:col-span-2 space-y-6">
              {/* Incoming Swap Requests */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Incoming Requests
                  </h2>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                    {
                      incomingRequests.filter((r) => r.status === "pending")
                        .length
                    }{" "}
                    pending
                  </span>
                </div>

                <div className="space-y-4">
                  {incomingRequests.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No incoming requests yet
                    </div>
                  ) : (
                    incomingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {request.fromUser.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Wants to learn:{" "}
                              <span className="font-medium">
                                {request.skillWanted}
                              </span>
                            </p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {request.fromUser.skillsOffered.map((skill) => (
                                <span
                                  key={skill}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {request.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleAcceptRequest(request.id)
                                  }
                                  disabled={processingRequest === request.id}
                                  className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
                                >
                                  <Check className="w-4 h-4" />
                                  Accept
                                </button>
                                <button
                                  onClick={() =>
                                    handleRejectRequest(request.id)
                                  }
                                  disabled={processingRequest === request.id}
                                  className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
                                >
                                  <X className="w-4 h-4" />
                                  Reject
                                </button>
                              </>
                            )}
                            {request.status !== "pending" && (
                              <span
                                className={`px-2 py-1 rounded text-sm ${
                                  request.status === "accepted"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {request.status}
                              </span>
                            )}
                          </div>
                        </div>
                        {request.message && (
                          <div className="bg-gray-50 rounded p-3 mt-3">
                            <p className="text-sm text-gray-700">
                              "{request.message}"
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Outgoing Swap Requests */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Your Sent Requests
                </h2>

                <div className="space-y-4">
                  {sentRequests.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No outgoing requests yet
                    </div>
                  ) : (
                    sentRequests.map((request) => (
                      <div
                        key={request.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              To: {request.toUser.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Offering:{" "}
                              <span className="font-medium text-green-600">
                                {request.skillOffered}
                              </span>{" "}
                              → Learning:{" "}
                              <span className="font-medium text-blue-600">
                                {request.skillWanted}
                              </span>
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {new Date(request.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded text-sm ${
                                request.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : request.status === "accepted"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {request.status}
                            </span>
                            {request.status === "pending" && (
                              <button
                                onClick={() => handleDeleteRequest(request.id)}
                                className="flex items-center gap-1 px-2 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50 text-sm"
                              >
                                <Trash2 className="w-3 h-3" />
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Feedback Section */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Feedback
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Received Feedback */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="w-4 h-4 text-green-600" />
                      Feedback Received
                    </h3>
                    <div className="space-y-3">
                      {feedbackReceived.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          No feedback received yet
                        </p>
                      ) : (
                        feedbackReceived.map((feedback) => (
                          <div
                            key={feedback.id}
                            className="border border-gray-200 rounded-lg p-3"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">
                                {feedback.user}
                              </span>
                              <div className="flex">
                                {renderStars(feedback.rating)}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                              Skill: {feedback.skill}
                            </p>
                            <p className="text-sm text-gray-700">
                              "{feedback.message}"
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(feedback.date).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Given Feedback */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                      Feedback Given
                    </h3>
                    <div className="space-y-3">
                      {feedbackGiven.length === 0 ? (
                        <p className="text-gray-500 text-sm">
                          No feedback given yet
                        </p>
                      ) : (
                        feedbackGiven.map((feedback) => (
                          <div
                            key={feedback.id}
                            className="border border-gray-200 rounded-lg p-3"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm">
                                {feedback.user}
                              </span>
                              <div className="flex">
                                {renderStars(feedback.rating)}
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mb-1">
                              Skill: {feedback.skill}
                            </p>
                            <p className="text-sm text-gray-700">
                              "{feedback.message}"
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(feedback.date).toLocaleDateString()}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
