import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  updateOrderStatus,
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
  selectUpdateOrderStatus,
} from "../../../store/slices/ordersSlice";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "../../../constants";

const OrdersManagement = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const updateStatus = useSelector(selectUpdateOrderStatus);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Order status options using constants
  const statusOptions = [
    { value: ORDER_STATUSES.PROCESSING, label: ORDER_STATUS_LABELS[ORDER_STATUSES.PROCESSING], color: "sand" },
    { value: ORDER_STATUSES.IN_TRANSIT, label: ORDER_STATUS_LABELS[ORDER_STATUSES.IN_TRANSIT], color: "sand" },
    { value: ORDER_STATUSES.DELIVERED, label: ORDER_STATUS_LABELS[ORDER_STATUSES.DELIVERED], color: "success" },
    { value: ORDER_STATUSES.CANCELLED, label: ORDER_STATUS_LABELS[ORDER_STATUSES.CANCELLED], color: "error" },
    { value: ORDER_STATUSES.REFUND_REQUESTED, label: ORDER_STATUS_LABELS[ORDER_STATUSES.REFUND_REQUESTED], color: "warning" },
    { value: ORDER_STATUSES.REFUNDED, label: ORDER_STATUS_LABELS[ORDER_STATUSES.REFUNDED], color: "error" },
  ];

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await dispatch(
        updateOrderStatus({ orderId: selectedOrder.id, status: newStatus })
      ).unwrap();
      setShowStatusModal(false);
      setSelectedOrder(null);
      setNewStatus("");
      dispatch(fetchAllOrders());
    } catch (error) {
      alert(error || "Failed to update order status");
    }
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || ORDER_STATUSES.PROCESSING);
    setShowStatusModal(true);
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find((opt) => opt.value === status);
    return statusOption?.color || "gray";
  };

  const getStatusLabel = (status) => {
    const statusOption = statusOptions.find((opt) => opt.value === status);
    return statusOption?.label || status;
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      order.id.toString().includes(searchTerm) ||
      order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.delivery_address?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Order Tracking & Management
        </h2>
        <p className="text-gray-600">
          Track deliveries and update order statuses
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Orders
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Order ID, customer name, or address..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
            >
              <option value="all">All Orders</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
        {error && (
          <div className="mb-4 p-4 rounded-2xl bg-error/20 border border-error">
            <p className="text-error font-medium">{error}</p>
          </div>
        )}

        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            {searchTerm || filterStatus !== "all"
              ? "No orders match your filters"
              : "No orders found"}
          </p>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-2xl border-2 border-gray-200 hover:border-sand/50 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-gray-900 text-lg">
                        Order #{order.id}
                      </h4>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold bg-${getStatusColor(
                          order.status
                        )}/20 text-${getStatusColor(order.status)}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      {order.user_name && (
                        <p>
                          <span className="font-semibold">Customer:</span>{" "}
                          {order.user_name}
                        </p>
                      )}
                      {order.delivery_address && (
                        <p>
                          <span className="font-semibold">Address:</span>{" "}
                          {order.delivery_address}
                        </p>
                      )}
                      <p>
                        <span className="font-semibold">Date:</span>{" "}
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                      {order.total_amount && (
                        <p>
                          <span className="font-semibold">Total:</span> $
                          {order.total_amount.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => openStatusModal(order)}
                    className="px-6 py-3 rounded-2xl bg-linear-to-r from-sand to-sage text-white font-semibold hover:shadow-lg transition-all duration-300 whitespace-nowrap"
                  >
                    Update Status
                  </button>
                </div>

                {/* Order Items */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Items ({order.items.length}):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3"
                        >
                          <p className="font-medium text-gray-900">
                            {item.product_name || `Product #${item.product_id}`}
                          </p>
                          <p>
                            Qty: {item.quantity} × ${item.product_price?.toFixed(2) || "0.00"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Update Order Status
            </h3>

            <div className="mb-4 p-4 rounded-2xl bg-gray-50">
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-bold text-gray-900">#{selectedOrder.id}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdateStatus}
                  disabled={updateStatus === "loading"}
                  className="flex-1 px-6 py-3 rounded-2xl bg-linear-to-r from-sand to-sage text-white font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {updateStatus === "loading" ? "Updating..." : "Update"}
                </button>
                <button
                  onClick={() => {
                    setShowStatusModal(false);
                    setSelectedOrder(null);
                    setNewStatus("");
                  }}
                  className="flex-1 px-6 py-3 rounded-2xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
