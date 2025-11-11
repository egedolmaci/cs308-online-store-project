const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-cream via-linen to-sage">
      {/* Glass morphism container */}
      <div className="relative">
        {/* Animated background circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-sand/30 animate-pulse blur-2xl"></div>
          <div
            className="w-24 h-24 rounded-full bg-sage/30 animate-pulse blur-xl absolute"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        {/* Main loading card */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-sand/20">
          <div className="flex flex-col items-center space-y-6">
            {/* Spinning logo */}
            <div className="relative">
              <div
                className="w-20 h-20 bg-gradient-to-br from-sand via-sage to-sand rounded-2xl flex items-center justify-center shadow-lg animate-spin"
                style={{ animationDuration: "2s" }}
              >
                <svg
                  className="w-10 h-10 text-white"
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
              {/* Pulsing ring around logo */}
              <div className="absolute inset-0 rounded-2xl border-4 border-sand/40 animate-ping"></div>
            </div>

            {/* Loading text */}
            <div className="text-center">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Fashion Store
              </h2>
              <p className="text-sm text-gray-600 font-medium mt-1">
                {message}
              </p>
            </div>

            {/* Animated dots */}
            <div className="flex items-center space-x-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full bg-gradient-to-br from-sand to-sage shadow-lg animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
