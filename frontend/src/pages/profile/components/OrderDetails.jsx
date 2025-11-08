import { useDispatch, useSelector } from "react-redux";
import {
  requestRefund,
  selectRefundRequestStatus,
} from "../../../store/slices/ordersSlice";

const OrderDetails = ({ order, onBack }) => {
  const dispatch = useDispatch();
  const refundRequestStatus = useSelector(selectRefundRequestStatus);

  if (!order) return null;

  const handleRequestRefund = () => {
    if (
      window.confirm(
        "Are you sure you want to request a refund for this order? This action will notify customer support."
      )
    ) {
      dispatch(requestRefund({ orderId: order.id, reason: "Customer requested refund" }));
    }
  };

  // Check if order is eligible for refund (not already refunded or cancelled)
  const isRefundEligible =
    order.status !== "refunded" &&
    order.status !== "cancelled" &&
    order.status !== "refund_requested";

  const isRefundLoading = refundRequestStatus === "loading";

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-sand/30 text-gray-900 font-semibold hover:bg-white/80 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Orders
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
        </div>

        {/* Request Refund Button */}
        {isRefundEligible && (
          <button
            onClick={handleRequestRefund}
            disabled={isRefundLoading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-sand text-white font-semibold hover:shadow-lg transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
                d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
              />
            </svg>
            {isRefundLoading ? "Requesting..." : "Request Refund"}
          </button>
        )}
      </div>

      {/* Order Summary Card */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500 mb-1">Order ID</p>
              <p className="text-xl font-bold text-gray-900">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Order Date</p>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-gray-900 font-medium">
                  {order.created_at}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold text-white bg-gray-900">
                {order.status}
              </span>
            </div>
          </div>

          <div className="bg-linear-to-br from-sand/10 to-sage/10 rounded-2xl p-6 text-right">
            <p className="text-sm text-gray-500 mb-2">Order Total</p>
            <p className="text-3xl font-bold text-gray-900">
              ${order.total_amount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Order Items</h3>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 rounded-2xl bg-linear-to-r from-linen/30 to-cream/30 border border-sand/10 hover:shadow-md transition-all duration-300"
            >
              {/* Product Image */}
              {item.product?.image_url && (
                <div className="flex-shrink-0">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">
                  {item.product?.name || `Product ID: ${item.product_id}`}
                </h4>
                {item.product?.description && (
                  <p className="text-sm text-gray-500 mt-1">
                    {item.product.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="text-gray-600">
                    Quantity: <span className="font-semibold">{item.quantity}</span>
                  </span>
                  <span className="text-gray-600">
                    Price: <span className="font-semibold">${item.product_price.toFixed(2)}</span>
                  </span>
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                <p className="text-xl font-bold text-gray-900">
                  ${(item.product_price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Address */}
      {order.delivery_address && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Delivery Address
          </h3>
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-gray-400 mt-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <div className="text-gray-700">
              <p className="font-medium">{order.delivery_address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
