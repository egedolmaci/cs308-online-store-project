import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import CartItemCard from "./components/CartItemCard";
import CartSummary from "./components/CartSummary";
import EmptyCart from "./components/EmptyCart";
import { clearModal, setModal } from "../../store/slices/modalSlice";
import { ICON_NAMES, MODAL_NAMES } from "../../constants";
import { openModalWithPromise } from "../../ui/modals/modalPromises";
import { generateConfirmActionModal } from "../../ui/modals";
import { clearCart } from "../../store/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity } = useSelector((state) => state.cart);

  const handleCheckout = () => {
    dispatch(setModal(
      { name: MODAL_NAMES.BANKING_MODAL }));
  };

  const handleClearCart = async () => {
    try {
      await dispatch(openModalWithPromise(generateConfirmActionModal(
        ICON_NAMES.TRASH_ICON,
        'Clear Cart',
        'Are you sure you want to clear the cart?',
        'Clear Cart',
        'Cancel'
      )));
      // If confirmed, clear the cart
      dispatch(clearModal());
      dispatch(clearCart());
    } catch (error) {
      // Modal was cancelled, do nothing
      console.log("Clear cart action cancelled: " + error);
    }
  };
  // Show empty cart if no items
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-linen via-cream to-linen flex items-center justify-center">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-linen via-cream to-linen">
      {/* Header Section */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-sand/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Shopping Cart
              </h1>
              <p className="text-gray-600">
                You have {totalQuantity}{" "}
                {totalQuantity === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            <Link
              to="/store"
              className="hidden sm:flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 font-semibold transition-colors duration-300 group"
            >
              <svg
                className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items - Left Side */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}

            {/* Clear Cart Button */}
            <div className="flex items-center justify-between pt-4">
              <Link
                to="/store"
                className="flex sm:hidden items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 font-semibold transition-colors duration-300"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Continue Shopping</span>
              </Link>
              <button
                onClick={() => {
                  handleClearCart();
                }}
                className="flex items-center gap-2 px-6 py-3 text-error hover:bg-error/10 rounded-xl font-semibold transition-all duration-300"
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
                <span>Clear Cart</span>
              </button>
            </div>
          </div>

          {/* Cart Summary - Right Side */}
          <div className="lg:col-span-1">
            <CartSummary onCheckout={handleCheckout} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
