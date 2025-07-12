import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { Star, MessageCircle, Send, Award, User } from "lucide-react";
import { feedbackApi, swapApi } from "../lib/api";

interface FeedbackItem {
  id: string;
  type: "given" | "received";
  user: string;
  userId: string;
  skill: string;
  rating: number;
  message: string;
  date: string;
  swapRequestId?: string;
}

export default function Feedback() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchParams] = useSearchParams();
  const swapRequestId = searchParams.get("swapRequestId");
  const toUserId = searchParams.get("toUserId");
  const skill = searchParams.get("skill");

  const [activeTab, setActiveTab] = useState<"submit" | "received" | "given">(
    swapRequestId ? "submit" : "received",
  );

  const [formData, setFormData] = useState({
    rating: 0,
    message: "",
    skill: skill || "",
  });

  const [feedbackData, setFeedbackData] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load feedback data
  useEffect(() => {
    if (isAuthenticated && activeTab !== "submit") {
      loadFeedback();
    }
  }, [isAuthenticated, activeTab]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await feedbackApi.getFeedback();
      setFeedbackData(data.feedback || []);
    } catch (err: any) {
      console.error("Error loading feedback:", err);
      setError(err.message || "Failed to load feedback");
      // Mock data fallback
      setFeedbackData([
        {
          id: "1",
          type: "received",
          user: "Alice Johnson",
          userId: "user1",
          skill: "React",
          rating: 5,
          message: "Excellent teacher! Very patient and clear explanations.",
          date: "2024-01-12",
        },
        {
          id: "2",
          type: "given",
          user: "Bob Smith",
          userId: "user2",
          skill: "Python",
          rating: 4,
          message: "Great session, learned a lot about data structures!",
          date: "2024-01-10",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!toUserId || !swapRequestId) {
      alert("Missing required information for feedback submission");
      return;
    }

    if (formData.rating === 0) {
      alert("Please select a rating");
      return;
    }

    setSubmitting(true);

    try {
      await feedbackApi.submitFeedback({
        toUserId,
        swapRequestId,
        rating: formData.rating,
        message: formData.message,
        skill: formData.skill,
      });

      alert("Feedback submitted successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Error submitting feedback:", err);
      alert(err.message || "Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 cursor-pointer transition-colors ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        } ${interactive ? "hover:text-yellow-300" : ""}`}
        onClick={() => interactive && handleStarClick(i + 1)}
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Feedback</h1>
            <p className="text-xl text-gray-600">
              Share your experience and view feedback from others
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="flex border-b">
              {swapRequestId && (
                <button
                  onClick={() => setActiveTab("submit")}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === "submit"
                      ? "text-skillswap-black border-b-2 border-skillswap-black"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Send className="w-4 h-4 inline mr-2" />
                  Submit Feedback
                </button>
              )}
              <button
                onClick={() => setActiveTab("received")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === "received"
                    ? "text-skillswap-black border-b-2 border-skillswap-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Award className="w-4 h-4 inline mr-2" />
                Feedback Received
              </button>
              <button
                onClick={() => setActiveTab("given")}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === "given"
                    ? "text-skillswap-black border-b-2 border-skillswap-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <MessageCircle className="w-4 h-4 inline mr-2" />
                Feedback Given
              </button>
            </div>

            <div className="p-6">
              {/* Submit Feedback Tab */}
              {activeTab === "submit" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Submit Feedback
                  </h2>

                  <form onSubmit={handleSubmitFeedback} className="space-y-6">
                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Rating *
                      </label>
                      <div className="flex gap-1">
                        {renderStars(formData.rating, true)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Click on stars to rate (1-5 stars)
                      </p>
                    </div>

                    {/* Skill */}
                    <div>
                      <label
                        htmlFor="skill"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Skill *
                      </label>
                      <input
                        type="text"
                        id="skill"
                        value={formData.skill}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            skill: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-skillswap-black focus:border-transparent"
                        placeholder="e.g., React, Python, Guitar"
                        required
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Feedback Message *
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            message: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-skillswap-black focus:border-transparent"
                        placeholder="Share your experience with this skill swap..."
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {formData.message.length}/500 characters
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting || formData.rating === 0}
                        className="flex-1 px-6 py-3 bg-skillswap-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {submitting ? "Submitting..." : "Submit Feedback"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Received Feedback Tab */}
              {activeTab === "received" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Feedback You've Received
                  </h2>

                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading feedback...</p>
                    </div>
                  ) : error ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <p className="text-yellow-800">
                        <strong>Note:</strong> {error}. Showing demo data.
                      </p>
                    </div>
                  ) : null}

                  <div className="space-y-4">
                    {feedbackData
                      .filter((f) => f.type === "received")
                      .map((feedback) => (
                        <div
                          key={feedback.id}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-skillswap-yellow rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-skillswap-black" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {feedback.user}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Skill: {feedback.skill}
                                </p>
                              </div>
                            </div>
                            <div className="flex">
                              {renderStars(feedback.rating)}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">
                            "{feedback.message}"
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(feedback.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}

                    {feedbackData.filter((f) => f.type === "received")
                      .length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No feedback received yet
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Given Feedback Tab */}
              {activeTab === "given" && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Feedback You've Given
                  </h2>

                  <div className="space-y-4">
                    {feedbackData
                      .filter((f) => f.type === "given")
                      .map((feedback) => (
                        <div
                          key={feedback.id}
                          className="bg-gray-50 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  {feedback.user}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  Skill: {feedback.skill}
                                </p>
                              </div>
                            </div>
                            <div className="flex">
                              {renderStars(feedback.rating)}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">
                            "{feedback.message}"
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(feedback.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}

                    {feedbackData.filter((f) => f.type === "given").length ===
                      0 && (
                      <div className="text-center py-8 text-gray-500">
                        No feedback given yet
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
