import { Link } from "react-router-dom";
import { ArrowRightLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <header className="bg-skillswap-black text-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-semibold"
          >
            <ArrowRightLeft className="w-6 h-6" />
            <span>SkillSwap</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/browse-skills"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  Browse Skills
                </Link>
                <Link
                  to="/swap-request"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  Request Swap
                </Link>
                <Link
                  to="/matches"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  Matches
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/browse-skills"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  Browse Skills
                </Link>
                <Link
                  to="/how-it-works"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  How It Works
                </Link>
                <Link
                  to="/contact"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  Contact
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  Settings
                </Link>
                <button
                  onClick={logout}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-skillswap-yellow text-skillswap-black px-4 py-2 rounded-md hover:bg-yellow-400 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
