import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../../../store/slices/cartSlice";

const ItemCard = ({ product }) => {
  const dispatch = useDispatch();
  const cartQty = useSelector(
    (state) => state.cart.items.find((i) => i.id === product.id)?.quantity || 0
  );
  const availableLeft = Math.max(0, (product.stock ?? 0) - cartQty);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (availableLeft > 0) {
      dispatch(addToCart(product));
    }
  };

  const handleCardClick = () => {
    navigate(`/item/${product.id}`);
  };

  return (
    <div
      key={product.id}
      onClick={handleCardClick}
      className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative h-72 overflow-hidden bg-linear-to-br from-cream to-linen">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        {/* Stock Status Badges */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center space-y-2">
              <span className="inline-block bg-error text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg">
                Out of Stock
              </span>
            </div>
          </div>
        )}

        {product.stock > 0 && product.stock < 20 && (
          <div className="absolute top-4 right-4">
            <span className="bg-warning text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm">
              Only {product.stock} left
            </span>
          </div>
        )}

        {/* Quick View Button */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          <button
            onClick={handleCardClick}
            className="w-full bg-white/95 backdrop-blur-sm text-gray-900 py-3 rounded-xl font-semibold hover:bg-white transition-colors duration-300 shadow-lg"
          >
            Go to Details
          </button>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
          <svg
            className="w-4 h-4 text-warning"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-bold text-gray-900">
            {product.rating}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-6 space-y-4">
        {/* Category */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-gray-500">
            {product.category}
          </span>
          <button className="text-gray-400 hover:text-error transition-colors duration-300">
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Product Name */}
        <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Product Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>Model: {product.model}</span>
          <span>•</span>
          <span>{product.warrantyStatus} warranty</span>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4">
          <div className="space-y-1">
            <p className="text-3xl font-bold text-gray-900">${product.price}</p>
            <p className="text-xs text-gray-500">
              {product.stock > 0 ? `${product.stock} in stock` : "Unavailable"}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={availableLeft === 0}
            className={`flex items-center gap-2 mx-4 px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${availableLeft === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-xl active:scale-95 shadow-lg"
              }`}
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>{availableLeft === 0 ? "Max Reached" : "Add"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
