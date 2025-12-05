import { useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
} from "../../../store/slices/cartSlice";

const CartItemCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0 && newQuantity <= item.stock) {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="flex flex-col md:flex-row gap-6 p-6">
        {/* Product Image */}
        <div className="relative w-full md:w-48 h-48 flex-shrink-0 rounded-2xl overflow-hidden bg-linear-to-br from-cream to-linen">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          {item.discount_active && (
            <div className="absolute top-3 left-3 bg-error text-white px-3 py-1.5 rounded-full shadow-lg">
              <span className="text-xs font-bold">
                {item.discount_rate}% OFF
              </span>
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
            <span className="text-xs font-bold text-gray-900">
              {item.category}
            </span>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            {/* Title and Remove Button */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500">Model: {item.model}</p>
              </div>
              <button
                onClick={() => dispatch(removeFromCart(item.id))}
                className="p-2 text-gray-400 hover:text-error hover:bg-error/10 rounded-xl transition-all duration-300"
                aria-label="Remove item"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            {/* Stock Status */}
            {item.stock < 20 && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-warning/10 text-warning rounded-full text-xs font-bold">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Only {item.stock} left in stock
              </div>
            )}
          </div>

          {/* Quantity Controls and Price */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-100">
            {/* Quantity Controls */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">
                Quantity:
              </span>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                <button
                  onClick={() => dispatch(decreaseQuantity(item.id))}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                  aria-label="Decrease quantity"
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
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <input
                  type="number"
                  min="1"
                  max={item.stock}
                  value={item.quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center font-bold text-gray-900 bg-transparent focus:outline-none"
                />
                <button
                  onClick={() => dispatch(increaseQuantity(item.id))}
                  disabled={item.quantity >= item.stock}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-white hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-900"
                  aria-label="Increase quantity"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                {item.discount_active ? (
                  <>
                    <div className="flex items-center justify-end gap-2 mb-0.5">
                      <p className="text-xs text-gray-400 line-through">
                        ${item.originalPrice?.toFixed(2) || item.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-success font-bold">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-success">
                      ${item.totalPrice.toFixed(2)}
                    </p>
                    <p className="text-xs text-success font-semibold mt-1">
                      Discount applied
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500 mb-0.5">
                      ${item.price.toFixed(2)} each
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${item.totalPrice.toFixed(2)}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
