import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MANAGEMENT_ROLES } from "../../constants";
import { Briefcase } from "lucide-react";

const Header = () => {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = useSelector((state) => state.user.role);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isManagementUser =
    isAuthenticated && MANAGEMENT_ROLES.includes(userRole);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-sand/20 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Enhanced */}
            <Link
              to="/"
              className="flex items-center space-x-3 group cursor-pointer"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-sand via-sage to-sand rounded-2xl flex items-center justify-center shadow-lg transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Fashion Store
                </span>
                <p className="text-xs text-gray-500 font-medium -mt-1">
                  Style & Elegance
                </p>
              </div>
            </Link>

            {/* Navigation Links - Enhanced */}
            <nav className="hidden lg:flex items-center space-x-2">
              {[
                { name: "Home", path: "/" },
                { name: "Store", path: "/store" },
                { name: "About", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${isActive(item.path)
                    ? "bg-gray-900 text-white shadow-lg scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions - Enhanced */}
            <div className="flex items-center space-x-3">
              {/* Cart Button - Enhanced */}
              <button
                onClick={() => navigate("/cart")}
                className="relative group"
              >
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-900 text-gray-700 hover:text-white transition-all duration-300 hover:shadow-xl">
                  <div className="relative">
                    <svg
                      className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {totalQuantity > 0 && (
                      <span className="absolute -top-2 -right-2 bg-error text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                        {totalQuantity}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-medium opacity-80">Cart</p>
                    <p className="text-sm font-bold -mt-0.5">
                      ${totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </button>

              {/* Profile Button - Enhanced */}
              <button
                onClick={() =>
                  navigate(isAuthenticated ? "/profile" : "/login")
                }
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
              >
                <svg
                  className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-sm font-bold">
                  {isAuthenticated ? "Profile" : "Login"}
                </span>
              </button>
              {isManagementUser && (
                <button
                  onClick={() =>
                    navigate("/management")
                  }
                  className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
                >
                  <Briefcase />
                  <span className="text-sm font-bold">
                    {"Management Panel"}
                  </span>
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300"
              >
                <svg
                  className={`w-6 h-6 transform transition-transform duration-300 ${isMobileMenuOpen ? "rotate-90" : ""
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isMobileMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Enhanced */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <nav className="container mx-auto px-4 py-4 space-y-2 border-t border-sand/20">
            {[
              { name: "Home", path: "/" },
              { name: "Store", path: "/store" },
              { name: "About", path: "/about" },
              { name: "Contact", path: "/contact" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${isActive(item.path)
                  ? "bg-gray-900 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {item.name}
              </Link>
            ))}
            {/* Mobile Profile Button */}
            <button
              onClick={() => navigate(isAuthenticated ? "/profile" : "/login")}
              className="sm:hidden w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="font-bold">
                {isAuthenticated ? "Profile" : "Login"}
              </span>
            </button>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
