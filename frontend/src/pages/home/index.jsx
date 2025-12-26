import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-linen via-cream to-linen px-4 py-16">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sand/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sage/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cream/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl w-full mx-auto text-center relative z-10">
        {/* Hero Section */}
        <div className="space-y-8 mb-12">
          {/* Store Name */}
          <div className="space-y-4">
            {/* Floating Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-sand/30 mb-6">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">New Collection Available</span>
            </div>

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

        {/* Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16 bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-sand/30">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">5K+</div>
            <div className="text-sm text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">1000+</div>
            <div className="text-sm text-gray-600">Products</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">4.9★</div>
            <div className="text-sm text-gray-600">Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Support</div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-sand/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
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

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-sand/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
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

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-sand/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
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

        {/* Newsletter Section */}
        <div className="max-w-2xl mx-auto mt-20 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-sand/30">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Stay Updated</h2>
            <p className="text-gray-600">Get exclusive offers and new collection updates</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-2xl border-2 border-sand/30 focus:border-sage focus:outline-none shadow-sm hover:shadow-md transition-shadow duration-300"
            />
            <button className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 hover:shadow-xl transition-all duration-300 active:scale-95 shadow-lg">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Join 10,000+ subscribers. Unsubscribe anytime.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center items-center gap-8 mt-16 opacity-60">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Secure Payment</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Verified Reviews</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Free Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
