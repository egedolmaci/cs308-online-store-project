import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../store/slices/cartSlice";
import { addToast } from "../../../store/slices/toastSlice";

const ProductInfo = ({ product }) => {
  const dispatch = useDispatch();
  const inCart = useSelector(
    (state) => state.cart.items.find((i) => i.id === product.id)?.quantity || 0
  );
  const availableLeft = Math.max(0, (product.stock ?? 0) - inCart);
  const [quantity, setQuantity] = useState(1);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= availableLeft) {
      setQuantity(newQuantity);
    }
    else {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    const toAdd = Math.min(quantity, availableLeft);
    if (toAdd <= 0) {
      dispatch(addToast({
        type: "warning",
        title: "Cannot Add",
        message: "Product is out of stock",
        duration: 3000
      }));
      return;
    }
    for (let i = 0; i < toAdd; i++) {
      dispatch(addToCart(product));
    }
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
    dispatch(addToast({
      type: "success",
      title: "Added to Cart",
      message: `${toAdd} x ${product.name} added to your cart`,
      duration: 3000
    }));
  };

  return (
    <>
      <div className="space-y-6 lg:space-y-8">
        {/* Category Badge */}
        <div className="flex items-center gap-3">
          <span className="inline-block bg-sand/30 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold tracking-wider uppercase">
            {product.category}
          </span>
          {product.discount_active && (
            <span className="inline-block bg-error text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
              {product.discount_rate}% OFF SALE
            </span>
          )}
          {product.stock > 0 && product.stock < 20 && (
            <span className="inline-block bg-warning/20 text-warning px-4 py-2 rounded-full text-sm font-bold animate-pulse">
              Only {product.stock} left!
            </span>
          )}
        </div>

        {/* Product Title */}
        <div className="space-y-3">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            {product.name}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          {product.discount_active ? (
            <>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-5xl font-bold text-success">
                  ${product.final_price.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500">USD</span>
              </div>
              <div className="bg-success/10 border border-success/20 rounded-xl px-4 py-2 inline-block">
                <p className="text-success font-bold text-sm">
                  🎉 You save ${(product.price - product.final_price).toFixed(2)} ({product.discount_rate}% off)
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-lg text-gray-500">USD</span>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-4">
            {product.stock > 0 ? (
              <span className="text-success font-semibold">
                ✓ In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-error font-semibold">✗ Out of Stock</span>
            )}
          </p>
        </div>

        {/* Quantity Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Quantity
          </label>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white rounded-2xl shadow-lg overflow-hidden">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="px-6 py-4 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 font-bold text-xl"
              >
                −
              </button>
              <span className="px-8 py-4 text-xl font-bold border-x-2 border-gray-100 min-w-[80px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= availableLeft}
                className="px-6 py-4 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 font-bold text-xl"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">Max: {availableLeft} items</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <div className="space-y-3">
          <button
            onClick={handleAddToCart}
            disabled={availableLeft === 0}
            className={`w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold text-lg transition-all duration-300 ${product.stock === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-2xl active:scale-98 shadow-xl"
              }`}
          >
            <svg
              className="w-6 h-6"
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
            <span>{product.stock === 0 ? "Out of Stock" : "Add to Cart"}</span>
          </button>

          {/* Success Message */}
          {showAddedMessage && (
            <div className="bg-success/10 border-2 border-success text-success px-6 py-4 rounded-2xl text-center font-semibold animate-[fadeIn_0.3s_ease-in-out]">
              ✓ Added {quantity} item{quantity > 1 ? "s" : ""} to cart!
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductInfo;
