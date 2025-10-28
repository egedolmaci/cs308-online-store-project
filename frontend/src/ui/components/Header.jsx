import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const navigate = useNavigate();

  const handleNavigate = (route) => {
    navigate(route)
  }

  const location = useLocation();
  const selectedTab = location.pathname

  const selectedTabStyle = "text-sm font-medium text-gray-900 border-b-2 border-gray-900 pb-1";
  const normalTabStyle = "text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-sand/30 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sand to-sage rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Fashion Store
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className={selectedTab === "/" ? selectedTabStyle : normalTabStyle}
            >
              Home
            </a>
            <a
              href="/store"
              className={selectedTab === "/store" ? selectedTabStyle : normalTabStyle}
            >
              Store
            </a>
            <a
              href="/about"
              className={selectedTab === "/about" ? selectedTabStyle : normalTabStyle}
            >
              About
            </a>
            <a
              href="/contact"
              className={selectedTab === "/contact" ? selectedTabStyle : normalTabStyle}
            >
              Contact
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <button onClick={() => handleNavigate("/cart")} className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200">
              <svg
                className="w-6 h-6"
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
              <span className="absolute -top-1 -right-1 bg-error text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            </button>

            {/* Profile */}
            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200">
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
              <span className="text-sm font-medium">Profile</span>
            </button>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
