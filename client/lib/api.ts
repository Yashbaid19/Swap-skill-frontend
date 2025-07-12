const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (parseError) {
      // If response is not JSON, use status text or a more descriptive message
      if (response.status === 0 || response.status >= 500) {
        errorMessage =
          "Backend server is not available. Please check if the server is running on the configured URL.";
      } else if (response.status === 404) {
        errorMessage =
          "API endpoint not found. Please check the backend route configuration.";
      } else if (response.status === 401) {
        errorMessage = "Authentication failed. Please check your credentials.";
      }
    }

    console.error("API Error Details:", {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
      message: errorMessage,
      baseURL: baseURL,
    });

    throw new Error(errorMessage);
  }

  try {
    return await response.json();
  } catch (parseError) {
    console.error("Failed to parse response as JSON:", parseError);
    throw new Error("Invalid response format from server");
  }
};

// Helper function to make authenticated requests
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
    return response;
  } catch (networkError) {
    console.error("Network error:", networkError);
    throw new Error(
      `Cannot connect to backend server at ${baseURL}. Please check if the server is running and the URL is correct.`,
    );
  }
};

// Auth APIs
export const authApi = {
  signup: async (data: {
    fullName: string;
    email: string;
    password: string;
    location?: string;
    skillsOffered: string[];
    skillsWanted: string[];
    availability: string[];
  }) => {
    try {
      const response = await fetch(`${baseURL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (networkError) {
      console.error("Network error during signup:", networkError);
      throw new Error(
        `Cannot connect to backend server at ${baseURL}. Please check if the server is running and the URL is correct.`,
      );
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      return handleResponse(response);
    } catch (networkError) {
      console.error("Network error during login:", networkError);
      throw new Error(
        `Cannot connect to backend server at ${baseURL}. Please check if the server is running and the URL is correct.`,
      );
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await fetch(`${baseURL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      return handleResponse(response);
    } catch (networkError) {
      console.error("Network error during forgot password:", networkError);
      throw new Error(
        `Cannot connect to backend server at ${baseURL}. Please check if the server is running and the URL is correct.`,
      );
    }
  },

  resetPassword: async (token: string, password: string) => {
    try {
      const response = await fetch(
        `${baseURL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        },
      );
      return handleResponse(response);
    } catch (networkError) {
      console.error("Network error during password reset:", networkError);
      throw new Error(
        `Cannot connect to backend server at ${baseURL}. Please check if the server is running and the URL is correct.`,
      );
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await authenticatedFetch(
      `${baseURL}/api/auth/change-password`,
      {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      },
    );
    return handleResponse(response);
  },
};

// User APIs
export const userApi = {
  getDashboard: async (userId?: string) => {
    // Use userId if provided, otherwise backend should determine from JWT token
    const endpoint = userId
      ? `${baseURL}/api/users/dashboard/${userId}`
      : `${baseURL}/api/user/dashboard`;
    const response = await authenticatedFetch(endpoint);
    return handleResponse(response);
  },

  getDashboardStats: async (userId: string) => {
    const response = await authenticatedFetch(
      `${baseURL}/api/users/dashboard/${userId}`,
    );
    return handleResponse(response);
  },

  updateProfile: async (data: {
    fullName?: string;
    email?: string;
    location?: string;
    skillsOffered?: string[];
    skillsWanted?: string[];
    availability?: string[];
  }) => {
    const response = await authenticatedFetch(`${baseURL}/api/user/profile`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // New API function matching backend specification
  updateUserProfile: async (data: {
    name?: string;
    location?: string;
    skillsOffered?: string[];
    skillsWanted?: string[];
    availability?: string;
  }) => {
    const response = await authenticatedFetch(`${baseURL}/api/users/profile`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append("profilePhoto", file); // Backend expects "profilePhoto" field

    const token = getAuthToken();

    try {
      const response = await fetch(`${baseURL}/api/users/profile-picture`, {
        method: "POST",
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      });
      return handleResponse(response);
    } catch (networkError) {
      console.error(
        "Network error during profile picture upload:",
        networkError,
      );
      throw new Error(
        `Cannot connect to backend server at ${baseURL}. Please check if the server is running and the URL is correct.`,
      );
    }
  },

  searchUsers: async (skill?: string) => {
    const params = new URLSearchParams();
    if (skill) params.append("skill", skill);

    const response = await authenticatedFetch(
      `${baseURL}/api/users${params.toString() ? `?${params.toString()}` : ""}`,
    );
    return handleResponse(response);
  },
};

// Swap APIs
export const swapApi = {
  sendRequest: async (data: {
    toUserId: string;
    offeredSkill: string;
    wantedSkill: string;
    availability: string[];
    message?: string;
  }) => {
    const response = await authenticatedFetch(`${baseURL}/api/swap/request`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getRequests: async () => {
    const response = await authenticatedFetch(`${baseURL}/api/swap/requests`);
    return handleResponse(response);
  },

  updateRequestStatus: async (
    requestId: string,
    status: "accepted" | "rejected",
  ) => {
    const response = await authenticatedFetch(
      `${baseURL}/api/swap/requests/${requestId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
    );
    return handleResponse(response);
  },

  deleteRequest: async (requestId: string) => {
    const response = await authenticatedFetch(
      `${baseURL}/api/swap/requests/${requestId}`,
      {
        method: "DELETE",
      },
    );
    return handleResponse(response);
  },
};

// Feedback APIs
export const feedbackApi = {
  submitFeedback: async (data: {
    toUserId: string;
    swapRequestId: string;
    rating: number;
    message: string;
    skill: string;
  }) => {
    const response = await authenticatedFetch(`${baseURL}/api/feedback`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  getFeedback: async () => {
    const response = await authenticatedFetch(`${baseURL}/api/feedback`);
    return handleResponse(response);
  },
};

// Export base URL for any custom fetch calls
export { baseURL };
