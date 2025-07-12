import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Eye, EyeOff, CheckCircle, Shield } from "lucide-react";
import { authApi } from "../lib/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !token) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await authApi.resetPassword(token, formData.password);
      setIsSuccess(true);
    } catch (error: any) {
      console.error("Error resetting password:", error);
      setErrors({
        password:
          error.message || "Failed to reset password. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />

        <div className="flex items-center justify-center py-20 px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Password Reset Successfully
            </h1>

            <p className="text-gray-600 mb-6">
              Your password has been reset successfully. You can now log in with
              your new password.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-skillswap-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />

        <div className="flex items-center justify-center py-20 px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md text-center">
            <h1 className="text-2xl font-semibold text-red-600 mb-4">
              Invalid Reset Link
            </h1>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <button
              onClick={() => navigate("/forgot-password")}
              className="w-full bg-skillswap-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
            >
              Request New Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-skillswap-light-gray rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-skillswap-black" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Reset Your Password
            </h1>
            <p className="text-gray-600">
              Enter your new password below to complete the reset process.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className={`w-full px-4 py-3 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-skillswap-black focus:border-transparent ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className={`w-full px-4 py-3 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-skillswap-black focus:border-transparent ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Confirm your new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

            {/* Password Requirements */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Password Requirements:
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li
                  className={`flex items-center gap-2 ${
                    formData.password.length >= 6
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <CheckCircle
                    className={`w-4 h-4 ${
                      formData.password.length >= 6
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  />
                  At least 6 characters
                </li>
                <li
                  className={`flex items-center gap-2 ${
                    formData.password === formData.confirmPassword &&
                    formData.password
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  <CheckCircle
                    className={`w-4 h-4 ${
                      formData.password === formData.confirmPassword &&
                      formData.password
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  />
                  Passwords match
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-skillswap-black text-white py-3 rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors font-medium"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Resetting Password...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
