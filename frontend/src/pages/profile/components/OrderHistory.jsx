import OrderDetails from "./OrderDetails";
import { ORDER_STATUS_LABELS } from "../../../constants";
import { setCurrentOrder } from "../../../store/slices/ordersSlice";
import { useDispatch, useSelector } from "react-redux";

const OrderHistory = ({ orders }) => {
  const selectedOrder = useSelector((state) => state.orders.currentOrder);
  const dispatch = useDispatch();

  // If an order is selected, show the details view
  if (selectedOrder) {
    return (
      <OrderDetails
        order={selectedOrder}
        onBack={() => dispatch(setCurrentOrder(null))}
      />
    );
  }

  // Otherwise, show the order list
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
        <p className="text-sm text-gray-500">{orders.length} total orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Order Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    Order ID: {order.id}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white`}
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{order.created_at}</span>
                  </div>
                  <div className="flex items-center gap-1">
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
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span>{order.items.length} items</span>
                  </div>
                </div>
              </div>

              {/* Order Total & Action */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${order.total_amount.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(setCurrentOrder(order))}
                  className="px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
