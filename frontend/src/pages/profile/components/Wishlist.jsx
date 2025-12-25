import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  clearWishlist,
  removeFromWishlist,
  selectWishlistError,
  selectWishlistItems,
  selectWishlistStatus,
} from "../../../store/slices/wishlistSlice";

const Wishlist = () => {
  const items = useSelector(selectWishlistItems);
  const status = useSelector(selectWishlistStatus);
  const error = useSelector(selectWishlistError);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleClear = () => {
    if (!items.length) return;
    const confirmed = window.confirm(
      "Remove all items from your wishlist?"
    );
    if (confirmed) {
      dispatch(clearWishlist());
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
    <section className="bg-white rounded-3xl shadow-xl border border-sand/20 p-6 lg:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Wishlist</h2>
          <p className="text-gray-500">
            Save products to buy later and track discounts or restocks.
          </p>
        </div>
        {items.length > 0 && (
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm font-semibold text-error border-2 border-error rounded-xl hover:bg-error hover:text-white transition-all duration-200 active:scale-95"
          >
            Clear all
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {[1, 2].map((key) => (
            <div
              key={key}
              className="animate-pulse rounded-2xl border border-sand/20 bg-cream/60 p-4"
            >
              <div className="flex gap-4">
                <div className="h-24 w-24 rounded-2xl bg-sand/30" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-3/4 rounded bg-sand/30" />
                  <div className="h-3 w-1/2 rounded bg-sand/20" />
                  <div className="h-3 w-2/3 rounded bg-sand/20" />
                  <div className="h-4 w-1/3 rounded bg-sand/40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isEmpty ? (
        <div className="text-center py-16 bg-cream/60 rounded-3xl border border-dashed border-sand/50">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white shadow-md flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-500 mb-6">
            Tap the heart on any product to save it here for quick access.
          </p>
          <button
            onClick={() => navigate("/store")}
            className="px-5 py-3 rounded-xl bg-linear-to-r from-sand to-sage text-gray-900 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          >
            Browse products
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {items.map((product) => (
            <div
              key={product.id}
              className="group rounded-2xl border border-sand/30 bg-cream/60 p-4 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex gap-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-white shadow-inner">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.discount_active && (
                    <span className="absolute top-2 left-2 rounded-full bg-error text-white text-xs font-bold px-2 py-1 shadow">
                      {product.discount_rate}% OFF
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {product.category}
                      </p>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {product.name}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleRemove(product.id)}
                      aria-label="Remove from wishlist"
                      className="text-gray-400 hover:text-error transition-colors duration-200"
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

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description || "No description provided."}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div>{renderPrice(product)}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/item/${product.id}`)}
                        className="px-4 py-2 rounded-xl bg-white border border-sand/40 text-gray-900 text-sm font-semibold shadow hover:shadow-md transition-all duration-200 active:scale-95"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold shadow hover:bg-gray-800 transition-all duration-200 active:scale-95"
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
    </section>
  );
};

export default Wishlist;
