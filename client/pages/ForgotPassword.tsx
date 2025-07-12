import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { useState } from "react";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { authApi } from "../lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Basic email validation
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      await authApi.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />

        <div className="flex items-center justify-center py-20 px-4">
          <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Check Your Email
            </h1>

            <p className="text-gray-600 mb-6">
              We've sent a password reset link to{" "}
              <span className="font-medium text-gray-900">{email}</span>
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Didn't receive the email?</strong>
                <br />
                Check your spam folder or wait a few minutes for the email to
                arrive.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail("");
                }}
                className="w-full bg-skillswap-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-medium"
              >
                Try Different Email
              </button>

              <Link
                to="/login"
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium block text-center"
              >
                Back to Login
              </Link>
            </div>
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
              <Mail className="w-8 h-8 text-skillswap-black" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Forgot Your Password?
            </h1>
            <p className="text-gray-600">
              No worries! Enter your email address and we'll send you a link to
              reset your password.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-skillswap-black focus:border-transparent ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-skillswap-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending Reset Link...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-skillswap-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Don't have an account yet?
              </p>
              <Link
                to="/signup"
                className="w-full bg-skillswap-yellow text-skillswap-black py-3 rounded-md hover:bg-yellow-400 transition-colors font-medium block text-center"
              >
                Sign Up for SkillSwap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
