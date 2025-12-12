import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

export default function Navbar() {
  const { authenticated, clearAccessToken } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    if (confirm("Log out now?")) {
      clearAccessToken();
      window.location.href = "/login";
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-indigo-600">My App</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive("/")
                    ? "text-gray-900 border-b-2 border-indigo-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive("/about")
                    ? "text-gray-900 border-b-2 border-indigo-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                About
              </Link>
              <Link
                to="/demo"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive("/demo")
                    ? "text-gray-900 border-b-2 border-indigo-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                API Demo
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex sm:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {authenticated ? (
              <>
                <Link to="/user" className="text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  User
                </Link>
                <Button variant="danger" onClick={handleLogout} className="text-xs py-1 px-3">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
            >
              About
            </Link>
            <Link
              to="/demo"
              className="block text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
            >
              API Demo
            </Link>
            <div className="border-t pt-2 mt-2">
              {authenticated ? (
                <>
                  <Link
                    to="/user"
                    className="block text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                  >
                    User
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-red-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block text-indigo-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
