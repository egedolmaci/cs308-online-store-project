const Filter = ({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  sortedProducts,
}) => {
  console.log(sortBy);
  return (
    <div className="bg-white/80 backdrop-blur-xl border-b border-sand/30 shadow-sm">
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar - Centered */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 rounded-2xl border-2 border-sand/40 focus:border-sage focus:outline-none bg-white shadow-lg text-gray-800 placeholder-gray-500 transition-all duration-300 hover:shadow-xl"
            />
            <svg
              className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Categories - Centered Pills */}
        <div className="mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 justify-center flex-wrap px-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`group relative px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {selectedCategory === category && (
                  <div className="absolute inset-0 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 rounded-full shadow-lg"></div>
                )}
                {selectedCategory !== category && (
                  <div className="absolute inset-0 bg-white border border-sand/50 rounded-full group-hover:border-sage group-hover:shadow-md transition-all duration-300"></div>
                )}
                <span className="relative z-10">{category}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort and Results - Centered */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-6 py-2.5 rounded-xl border border-sand/40 bg-white focus:outline-none focus:border-sage text-sm font-medium text-gray-700 cursor-pointer hover:shadow-md transition-all duration-300"
          >
            <option value="name">Sort: Name</option>
            <option value="price-low">Sort: Price ↑</option>
            <option value="price-high">Sort: Price ↓</option>
            <option value="popularity">Sort: Popular</option>
          </select>

          <div className="text-sm">
            <span className="text-gray-600 font-semibold">
              {sortedProducts.length}
            </span>
            <span className="text-gray-500 ml-1">products found</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
