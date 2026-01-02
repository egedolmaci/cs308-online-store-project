import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearWishlist,
  removeFromWishlist,
  selectWishlistError,
  selectWishlistItems,
  selectWishlistStatus,
} from "../../../store/slices/wishlistSlice";
import { addToast } from "../../../store/slices/toastSlice";

const Wishlist = () => {
  const items = useSelector(selectWishlistItems);
  const status = useSelector(selectWishlistStatus);
  const error = useSelector(selectWishlistError);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (productId) => {
    const product = items.find(item => item.id === productId);
    dispatch(removeFromWishlist(productId));
    dispatch(addToast({
      type: "info",
      title: "Removed from Wishlist",
      message: product ? `${product.name} removed from your wishlist` : "Item removed from wishlist",
      duration: 3000
    }));
  };

  const handleClear = () => {
    if (!items.length) return;
    const confirmed = window.confirm(
      "Remove all items from your wishlist?"
    );
    if (confirmed) {
      dispatch(clearWishlist());
      dispatch(addToast({
        type: "success",
        title: "Wishlist Cleared",
        message: "All items removed from your wishlist",
        duration: 3000
      }));
    }
  };

  const renderPrice = (product) => {
    const basePrice = Number(product.price || 0).toFixed(2);
    if (product.discount_active && product.final_price != null) {
      return (
        <div className="space-y-1">
          <p className="text-xl font-bold text-success">
            ${Number(product.final_price).toFixed(2)}
          </p>
          <p className="text-sm font-semibold text-gray-400 line-through">
            ${basePrice}
          </p>
        </div>
      );
    }
    return (
      <p className="text-xl font-bold text-gray-900">
        ${basePrice}
      </p>
    );
  };

  const isLoading = status === "loading";
  const isEmpty = !items || items.length === 0;

  return (
    <section className="bg-white rounded-3xl shadow-xl border border-sand/20 p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-sand/5 to-sage/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-sand to-sage flex items-center justify-center shadow-md">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Wishlist</h2>
              <p className="text-sm text-gray-500">
                {items.length > 0 ? `${items.length} saved ${items.length === 1 ? 'item' : 'items'}` : 'Save products to buy later'}
              </p>
            </div>
          </div>
          {items.length > 0 && (
            <button
              onClick={handleClear}
              className="group px-5 py-2.5 text-sm font-semibold text-error border-2 border-error rounded-xl hover:bg-error hover:text-white transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear all
              </span>
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border-2 border-error/30 bg-error/5 px-5 py-4 text-sm text-error flex items-center gap-3 shadow-sm">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((key) => (
              <div
                key={key}
                className="animate-pulse rounded-2xl border-2 border-sand/20 bg-linear-to-br from-cream/60 to-linen/40 p-5 shadow-md"
              >
                <div className="flex gap-4">
                  <div className="h-28 w-28 rounded-2xl bg-sand/30 shadow-inner" />
                  <div className="flex-1 space-y-3">
                    <div className="h-3 w-1/4 rounded-full bg-sand/20" />
                    <div className="h-5 w-3/4 rounded-lg bg-sand/30" />
                    <div className="h-3 w-2/3 rounded-full bg-sand/20" />
                    <div className="h-6 w-1/3 rounded-lg bg-sand/40 mt-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isEmpty ? (
          <div className="text-center py-20 bg-linear-to-br from-cream/60 via-linen/40 to-cream/60 rounded-3xl border-2 border-dashed border-sand/40 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-sand/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-sage/10 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white shadow-xl flex items-center justify-center animate-pulse">
                <svg
                  className="w-10 h-10 text-sand"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Your Wishlist is Empty
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Start saving your favorite items! Click the heart icon on any product to add it to your wishlist.
              </p>
              <button
                onClick={() => navigate("/store")}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-linear-to-r from-sand to-sage text-gray-900 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Explore Products</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {items.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl border-2 border-sand/30 bg-white p-5 shadow-md hover:shadow-2xl hover:border-sand/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-linear-to-br from-sand/5 via-transparent to-sage/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                <div className="flex gap-4 relative z-10">
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-cream/40 shadow-md ring-2 ring-sand/20">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {product.discount_active && (
                      <span className="absolute top-2 left-2 rounded-full bg-error text-white text-xs font-bold px-2.5 py-1 shadow-lg animate-pulse">
                        {product.discount_rate}% OFF
                      </span>
                    )}
                    {!product.discount_active && product.stock < 10 && product.stock > 0 && (
                      <span className="absolute top-2 left-2 rounded-full bg-warning text-white text-xs font-bold px-2.5 py-1 shadow-lg">
                        Low Stock
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-xs font-bold uppercase tracking-wider text-sand">
                            {product.category}
                          </p>
                          {product.stock === 0 && (
                            <span className="text-xs font-semibold text-error">• Out of Stock</span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-gray-700 transition-colors">
                          {product.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleRemove(product.id)}
                        aria-label="Remove from wishlist"
                        className="text-gray-400 hover:text-error hover:scale-110 transition-all duration-200 p-1 rounded-lg hover:bg-error/10"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {product.description || "No description provided."}
                    </p>

                    <div className="flex items-end justify-between pt-2">
                      <div>{renderPrice(product)}</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/item/${product.id}`)}
                          className="group/btn px-4 py-2 rounded-xl bg-linear-to-r from-sand/20 to-sage/20 border-2 border-sand/40 text-gray-900 text-sm font-bold shadow-sm hover:shadow-lg hover:from-sand/30 hover:to-sage/30 transition-all duration-200 active:scale-95"
                        >
                          <span className="flex items-center gap-1">
                            View
                            <svg className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </button>
                        <button
                          onClick={() => handleRemove(product.id)}
                          className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-bold shadow-md hover:bg-gray-800 hover:shadow-lg transition-all duration-200 active:scale-95"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Wishlist;
