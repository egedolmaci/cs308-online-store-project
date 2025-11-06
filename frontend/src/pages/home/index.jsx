import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-linen via-cream to-linen flex items-center justify-center px-4 py-16">
      <div className="max-w-4xl w-full text-center">
        {/* Hero Section */}
        <div className="space-y-8 mb-12">
          {/* Store Name */}
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-gray-900 tracking-tight">
              <span className="bg-linear-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                Fashion Store
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 font-light tracking-wide">
              Timeless Style, Modern Comfort
            </p>
          </div>

          {/* Decorative Element */}
          <div className="flex items-center justify-center gap-4 my-8">
            <div className="h-px w-24 bg-linear-to-r from-transparent to-sand"></div>
            <div className="w-2 h-2 rounded-full bg-sand"></div>
            <div className="h-px w-24 bg-linear-to-l from-transparent to-sand"></div>
          </div>

          {/* Tagline */}
          <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Discover our curated collection of premium fashion essentials. From
            casual basics to statement pieces.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            to="/store"
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 hover:shadow-2xl transition-all duration-300 active:scale-95 shadow-lg min-w-60 text-lg"
          >
            <span>Shop Collection</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-sand/20 hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-linear-to-br from-sand to-sage flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Premium Quality</h3>
            <p className="text-sm text-gray-600">
              Carefully selected materials and craftsmanship
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-sand/20 hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-linear-to-br from-sage to-linen flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-600">
              Free shipping on orders over $100
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-sand/20 hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-linear-to-br from-linen to-cream flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Easy Returns</h3>
            <p className="text-sm text-gray-600">
              30-day hassle-free return policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
