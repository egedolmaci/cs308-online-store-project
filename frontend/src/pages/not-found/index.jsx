import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-linen via-cream to-linen flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="relative mb-12">
          {/* Large 404 Number */}
          <div className="text-[180px] sm:text-[240px] font-bold leading-none">
            <span className="bg-gradient-to-br from-sand via-sage to-sand bg-clip-text text-transparent opacity-20">
              404
            </span>
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Shopping Bag Icon */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-3xl bg-white shadow-2xl flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-500">
                <svg
                  className="w-16 h-16 sm:w-20 sm:h-20 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>

              {/* Floating Decorations */}
              <div className="absolute -top-6 -right-6 w-8 h-8 bg-warning rounded-full animate-bounce shadow-lg"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-sage rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute top-1/2 -right-8 w-4 h-4 bg-sand rounded-full animate-ping shadow-lg"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 mb-12">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Oops! Page Not Found
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
              The page you're looking for seems to have wandered off. Maybe it's
              shopping for new products?
            </p>
          </div>

          {/* Suggestions */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto shadow-lg border border-sand/20">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
              Helpful Suggestions:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600 text-left">
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Check the URL for typos</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Use the navigation menu to find what you need</span>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Head back to safety with the buttons below</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 hover:shadow-2xl transition-all duration-300 active:scale-98 shadow-lg min-w-[200px]"
          >
            <svg
              className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Go Home</span>
          </Link>

          <Link
            to="/store"
            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-50 hover:shadow-2xl transition-all duration-300 active:scale-98 shadow-lg border-2 border-gray-900 min-w-[200px]"
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span>Browse Store</span>
          </Link>
        </div>

        {/* Error Code */}
        <div className="mt-12 pt-8 border-t border-sand/30">
          <p className="text-sm text-gray-500 font-mono">
            Error Code: <span className="font-bold text-gray-700">404</span> |
            Page Not Found
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
