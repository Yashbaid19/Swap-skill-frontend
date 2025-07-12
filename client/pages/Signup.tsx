import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { authApi } from "../lib/api";
import {
  Upload,
  X,
  Eye,
  EyeOff,
  MapPin,
  Users,
  Target,
  Clock,
  Star,
  Shield,
  Heart,
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

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    skillsOffered: [] as string[],
    skillsWanted: [] as string[],
    availability: [] as string[],
    profilePicture: null as File | null,
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

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

    if (formData.skillsOffered.length === 0) {
      newErrors.skillsOffered =
        "Please select at least one skill you can offer";
    } else if (formData.skillsOffered.length < 2) {
      newErrors.skillsOffered = "Please select at least 2 skills you can offer";
    }

    if (formData.skillsWanted.length === 0) {
      newErrors.skillsWanted =
        "Please select at least one skill you want to learn";
    }

    if (formData.availability.length === 0) {
      newErrors.availability = "Please select your availability";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Please agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSkillToggle = (skill: string, type: "offered" | "wanted") => {
    const key = type === "offered" ? "skillsOffered" : "skillsWanted";
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(skill)
        ? prev[key].filter((s) => s !== skill)
        : [...prev[key], skill],
    }));
  };

  const handleAvailabilityToggle = (option: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter((item) => item !== option)
        : [...prev.availability, option],
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Register user via API
      const signupResponse = await authApi.signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        location: formData.location,
        skillsOffered: formData.skillsOffered,
        skillsWanted: formData.skillsWanted,
        availability: formData.availability,
      });

      // If signup returns token and user, use it directly
      if (signupResponse.token && signupResponse.user) {
        // Store auth token
        localStorage.setItem("authToken", signupResponse.token);

        // Store user data with proper mapping
        const userData = {
          id: signupResponse.user.id,
          fullName: signupResponse.user.fullName || signupResponse.user.name,
          email: signupResponse.user.email,
          location: signupResponse.user.location,
          skillsOffered:
            signupResponse.user.skillsOffered ||
            signupResponse.user.offered_skills ||
            formData.skillsOffered,
          skillsWanted:
            signupResponse.user.skillsWanted ||
            signupResponse.user.wanted_skills ||
            formData.skillsWanted,
          availability:
            signupResponse.user.availability || formData.availability,
          profilePicture:
            signupResponse.user.profilePicture ||
            signupResponse.user.profile_pic_url,
        };

        localStorage.setItem("userData", JSON.stringify(userData));

        // Update auth context directly
        updateUser(userData);

        alert("Account created successfully!");
        navigate("/dashboard");
      } else {
        // Fallback: Auto-login after successful registration
        await login(formData.email, formData.password);

        alert("Account created successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Error creating account:", error);
      alert(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Join SkillSwap Today
            </h1>
            <p className="text-xl text-gray-600">
              Start your journey of skill exchange and growth
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Why Join SkillSwap Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Why Join SkillSwap?
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Learn from Peers
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Get real-world knowledge from people who actually use
                        these skills
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Star className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Build Your Reputation
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Share your expertise and grow your reputation in the
                        community
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Zero Cost
                      </h4>
                      <p className="text-gray-600 text-sm">
                        No money involved - just mutual learning and growth
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Safe & Verified
                      </h4>
                      <p className="text-gray-600 text-sm">
                        All profiles are verified with rating system for trust
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Signup Form */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
              >
                {/* Basic Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Basic Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            fullName: e.target.value,
                          }))
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-skillswap-black ${
                          errors.fullName ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Location (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skillswap-black"
                        placeholder="City, Country"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Details */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Account Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-skillswap-black ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password *
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              password: e.target.value,
                            }))
                          }
                          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-skillswap-black ${
                            errors.password
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Minimum 6 characters"
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
                          <p className="text-red-500 text-sm mt-1">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password *
                        </label>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-skillswap-black ${
                            errors.confirmPassword
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          placeholder="Confirm your password"
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
                    </div>
                  </div>
                </div>

                {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture (Optional)
                  </label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                      {profilePreview ? (
                        <img
                          src={profilePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="profile-upload"
                      />
                      <label
                        htmlFor="profile-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Choose Photo
                      </label>
                      {profilePreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setProfilePreview(null);
                            setFormData((prev) => ({
                              ...prev,
                              profilePicture: null,
                            }));
                          }}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills Offered */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Target className="w-4 h-4 inline mr-1" />
                    Skills You Can Offer * (Select 2-3)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4">
                    {skillOptions.map((skill) => (
                      <label
                        key={skill}
                        className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                          formData.skillsOffered.includes(skill)
                            ? "bg-skillswap-yellow text-skillswap-black"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.skillsOffered.includes(skill)}
                          onChange={() => handleSkillToggle(skill, "offered")}
                          className="w-4 h-4 text-skillswap-black rounded mr-2"
                        />
                        <span className="text-sm">{skill}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {formData.skillsOffered.length}
                  </p>
                  {errors.skillsOffered && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.skillsOffered}
                    </p>
                  )}
                </div>

                {/* Skills Wanted */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Skills You Want to Learn *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4">
                    {skillOptions.map((skill) => (
                      <label
                        key={skill}
                        className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                          formData.skillsWanted.includes(skill)
                            ? "bg-blue-100 text-blue-800"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.skillsWanted.includes(skill)}
                          onChange={() => handleSkillToggle(skill, "wanted")}
                          className="w-4 h-4 text-blue-600 rounded mr-2"
                        />
                        <span className="text-sm">{skill}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Selected: {formData.skillsWanted.length}
                  </p>
                  {errors.skillsWanted && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.skillsWanted}
                    </p>
                  )}
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Your Availability *
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {availabilityOptions.map((option) => (
                      <label
                        key={option}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.availability.includes(option)
                            ? "border-skillswap-black bg-skillswap-light-gray"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.availability.includes(option)}
                          onChange={() => handleAvailabilityToggle(option)}
                          className="w-4 h-4 text-skillswap-black rounded mr-3"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                  {errors.availability && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.availability}
                    </p>
                  )}
                </div>

                {/* Terms Agreement */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          agreeToTerms: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-skillswap-black rounded mr-3"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-skillswap-black hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-skillswap-black hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.agreeToTerms}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <Link
                    to="/login"
                    className="flex-1 text-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Already have an account?
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-skillswap-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
