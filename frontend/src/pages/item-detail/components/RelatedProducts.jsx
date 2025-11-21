import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../store/slices/cartSlice";

const RelatedProducts = ({ products }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const inCart = cartItems.find((i) => i.id === product.id)?.quantity || 0;
    const availableLeft = Math.max(0, (product.stock ?? 0) - inCart);
    if (availableLeft > 0) {
      dispatch(addToCart(product));
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/item/${productId}`);
    // Scroll to top when navigating to a new product
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-wider">
          Related Products
        </h2>
        <button
          onClick={() => navigate("/store")}
          className="text-gray-600 hover:text-gray-900 font-semibold transition-colors duration-300 flex items-center gap-2 group"
        >
          <span>View All</span>
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
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
          >
            {/* Product Image */}
            <div className="relative h-64 overflow-hidden bg-linear-to-br from-cream to-linen">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Stock Status */}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-error text-white px-4 py-2 rounded-full font-bold text-xs shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}

              {product.stock > 0 && product.stock < 20 && (
                <div className="absolute top-3 right-3">
                  <span className="bg-warning text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
                    {product.stock} left
                  </span>
                </div>
              )}

              {/* Rating Badge */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <svg
                  className="w-3.5 h-3.5 text-warning"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-bold text-gray-900">
                  {product.rating}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-5 space-y-3">
              {/* Category */}
              <span className="text-xs font-semibold tracking-wider uppercase text-gray-500">
                {product.category}
              </span>

              {/* Product Name */}
              <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300 line-clamp-2">
                {product.name}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                {product.description}
              </p>

              {/* Price and CTA */}
              <div className="flex items-center justify-between pt-3">
                <div className="space-y-0.5">
                  <p className="text-2xl font-bold text-gray-900">
                    ${product.price}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.stock > 0 ? "In stock" : "Unavailable"}
                  </p>
                </div>
                {(() => {
                  const inCart = cartItems.find((i) => i.id === product.id)?.quantity || 0;
                  const availableLeft = Math.max(0, (product.stock ?? 0) - inCart);
                  return (
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={availableLeft === 0}
                      className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                        availableLeft === 0
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg active:scale-95"
                      }`}
                    >
                      <svg
                        className="w-4 h-4"
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
                      <span>{availableLeft === 0 ? "Max Reached" : "Add"}</span>
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
