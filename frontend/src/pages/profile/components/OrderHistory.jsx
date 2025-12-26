import OrderDetails from "./OrderDetails";
import { ORDER_STATUS_LABELS } from "../../../constants";
import { setCurrentOrder } from "../../../store/slices/ordersSlice";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../../../ui/components/EmptyState";

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
    <div className="bg-white rounded-3xl shadow-xl border border-sand/20 p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-linear-to-br from-sand/5 to-sage/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-sand to-sage flex items-center justify-center shadow-md">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
              <p className="text-sm text-gray-500">
                {orders.length > 0 ? `${orders.length} total ${orders.length === 1 ? 'order' : 'orders'}` : 'Track your purchases'}
              </p>
            </div>
          </div>
        </div>

        {orders.length === 0 && (
          <EmptyState
            title="No orders found"
            description="You haven't placed any orders yet. Start shopping to see your order history here."
            icon="inbox"
          />
        )}
        <div className="space-y-4">
          {orders.map((order) => {
            // Determine status color
            const getStatusColor = (status) => {
              const statusColors = {
                pending: 'bg-warning',
                processing: 'bg-blue-500',
                shipped: 'bg-purple-500',
                delivered: 'bg-success',
                cancelled: 'bg-error',
                refunded: 'bg-gray-500',
              };
              return statusColors[status] || 'bg-gray-500';
            };

            return (
              <div
                key={order.id}
                className="group bg-linear-to-br from-cream/30 via-white to-linen/30 rounded-2xl p-6 shadow-md border-2 border-sand/30 hover:shadow-2xl hover:border-sand/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Hover gradient effect */}
                <div className="absolute inset-0 bg-linear-to-br from-sand/5 via-transparent to-sage/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <span
                        className={`${getStatusColor(order.status)} px-3 py-1 rounded-full text-xs font-bold text-white shadow-md`}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4 text-sand"
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
                        <span className="font-medium">{order.created_at}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-4 h-4 text-sand"
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
                        <span className="font-medium">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Total & Action */}
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${order.total_amount.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => dispatch(setCurrentOrder(order))}
                      className="group/btn px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 hover:shadow-xl transition-all duration-300 active:scale-95 shadow-lg"
                    >
                      <span className="flex items-center gap-2">
                        View Details
                        <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
