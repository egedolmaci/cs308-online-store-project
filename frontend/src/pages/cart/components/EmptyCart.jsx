import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Empty Cart Icon */}
        <div className="relative mx-auto mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-linear-to-br from-sand/20 to-sage/20 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-4 h-4 bg-warning rounded-full animate-pulse"></div>
          <div className="absolute bottom-4 left-4 w-3 h-3 bg-sage rounded-full animate-pulse delay-300"></div>
        </div>

        {/* Message */}
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Looks like you have not added any items to your cart yet. Start
          shopping to fill it up!
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/store"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 hover:shadow-xl transition-all duration-300 active:scale-98"
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <span>Start Shopping</span>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto bg-success/10 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              Quality Products
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto bg-warning/10 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-warning"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Fast Shipping</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 mx-auto bg-sage/30 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              Secure Payment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
