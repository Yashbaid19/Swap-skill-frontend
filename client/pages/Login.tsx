import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login(email, password);
      // Redirect to dashboard after successful login
      navigate("/dashboard");
    } catch (error: any) {
      // Show user-friendly error message
      if (
        error.message?.includes("Cannot connect to backend") ||
        error.message?.includes("API endpoint not found") ||
        error.message?.includes("HTTP 404")
      ) {
        alert(
          "Backend server not available. The app will continue in demo mode with sample data.",
        );
      } else {
        alert(error.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome Back to SkillSwap
            </h1>
            <p className="text-gray-600">Log in to continue</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-skillswap-black focus:border-transparent"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-skillswap-black focus:border-transparent"
                required
              />
            </div>

            <div className="text-left">
              <Link
                to="/forgot-password"
                className="text-sm text-gray-600 hover:text-skillswap-black transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-skillswap-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>

            <Link
              to="/signup"
              className="w-full bg-skillswap-yellow text-skillswap-black py-3 rounded-md hover:bg-yellow-400 transition-colors font-medium block text-center"
            >
              Sign Up for SkillSwap
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
