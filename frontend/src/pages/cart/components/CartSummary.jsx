import { useSelector } from "react-redux";

const CartSummary = ({ onCheckout }) => {
  const { totalQuantity, totalAmount } = useSelector((state) => state.cart);

  const shipping = totalAmount > 0 ? (totalAmount > 100 ? 0 : 9.99) : 0;
  const tax = totalAmount * 0.08; // 8% tax
  const finalTotal = totalAmount + shipping + tax;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-lg sticky top-24">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Summary Details */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between text-gray-600">
          <span>Subtotal ({totalQuantity} items)</span>
          <span className="font-semibold">${totalAmount.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-2">
            <span>Shipping</span>
            {shipping === 0 && totalAmount > 0 && (
              <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                FREE
              </span>
            )}
          </div>
          <span className="font-semibold">
            {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
          </span>
        </div>

        {totalAmount > 0 && totalAmount <= 100 && (
          <div className="flex items-start gap-2 p-3 bg-sage/10 rounded-xl text-sm text-gray-700">
            <svg
              className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>
              Add <strong>${(100 - totalAmount).toFixed(2)}</strong> more to
              get FREE shipping!
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-gray-600">
          <span>Tax (8%)</span>
          <span className="font-semibold">${tax.toFixed(2)}</span>
        </div>

        <div className="h-px bg-gray-200 my-4"></div>

        <div className="flex items-center justify-between text-xl font-bold text-gray-900">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={totalQuantity === 0}
        className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-3 ${
          totalQuantity === 0
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-gray-900 hover:bg-gray-800 hover:shadow-xl active:scale-98 shadow-lg"
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
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span>Proceed to Checkout</span>
      </button>

      {/* Security Badge */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <svg
            className="w-5 h-5 text-success"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>Secure checkout guaranteed</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center mb-3">
          We accept all major payment methods
        </p>
        <div className="flex items-center justify-center gap-3 opacity-60">
          <div className="px-3 py-1.5 bg-gray-100 rounded text-xs font-bold text-gray-700">
            VISA
          </div>
          <div className="px-3 py-1.5 bg-gray-100 rounded text-xs font-bold text-gray-700">
            MASTERCARD
          </div>
          <div className="px-3 py-1.5 bg-gray-100 rounded text-xs font-bold text-gray-700">
            PAYPAL
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
