import { useState } from "react";

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="bg-white/95 backdrop-blur-xl border-b border-sand/20 ">
      <div className="container mx-auto px-4 py-6">
        {/* Top Bar - Search and Sort */}
        <div className="flex flex-col lg:flex-row items-center gap-4 mb-4 justify-center">
          {/* Search Bar - Enhanced */}
          <div className="w-full lg:flex-1 max-w-2xl">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search products, categories, or models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full px-6 py-4 pl-14 pr-12 rounded-2xl border-2 border-sand/30 focus:border-gray-900 focus:outline-none bg-white text-gray-800 placeholder-gray-400 transition-all duration-300"
              />
              <svg
                className={`absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 transition-all duration-300 ${isSearchFocused ? "text-gray-900 scale-110" : "text-gray-400"
                  }`}
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
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg
                    className="w-5 h-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Sort and Results */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            {/* Sort Dropdown - Enhanced */}
            <div className="relative flex-1 lg:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none pl-12 pr-10 py-3.5 rounded-xl border-2 border-sand/30 bg-white focus:outline-none focus:border-gray-900 text-sm font-semibold text-gray-700 cursor-pointer transition-all duration-300"
              >
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popularity">Most Popular</option>
              </select>
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            {/* Results Counter - Enhanced */}
            <div className="hidden sm:flex items-center gap-2 px-5 py-3.5 rounded-xl bg-gray-50 border-2 border-sand/20">
              <div className="text-sm font-bold text-gray-900">
                {sortedProducts.length}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {sortedProducts.length === 1 ? "product" : "products"}
              </div>
            </div>
          </div>
        </div>

        {/* Categories - Enhanced Pills */}
        <div className="relative flex items-center justify-center">
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 flex justify-center items-center">
            <div className="flex gap-2.5 pb-2 pt-2 min-w-min">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`group relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${selectedCategory === category
                    ? "text-white scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:scale-105"
                    }`}
                  style={{
                    animationDelay: `${index * 30}ms`,
                  }}
                >
                  {selectedCategory === category ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl"></div>
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-xl"></div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-white border-2 border-sand/40 rounded-xl group-hover:border-gray-300 transition-all duration-300"></div>
                    </>
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {category}
                    {selectedCategory === category && (
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Results Counter */}
        <div className="sm:hidden flex items-center justify-center gap-2 mt-4 px-5 py-3 rounded-xl bg-gray-50 border-2 border-sand/20">
          <div className="text-sm">
            <span className="font-bold text-gray-900">
              {sortedProducts.length}
            </span>
            <span className="text-gray-500 ml-1">
              {sortedProducts.length === 1 ? "product found" : "products found"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
