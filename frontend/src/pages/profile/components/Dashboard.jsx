import { ORDER_STATUS_LABELS } from "../../../constants";

const Dashboard = ({ user, orders, addresses, setActiveSection }) => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-linear-to-br from-sand via-sage to-sand rounded-3xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-2">
          Welcome back, {user.firstName}!
        </h2>
        <p className="text-white/90">
          Manage your orders, profile, and account settings
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Orders */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-linear-to-br from-sand to-sage rounded-2xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {orders.length}
              </p>
              <p className="text-sm text-gray-500">Total Orders</p>
            </div>
          </div>
        </div>

        {/* Last Order Status */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-linear-to-br from-success-light to-success rounded-2xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {orders.length > 0 ? ORDER_STATUS_LABELS[orders[0].status] : "No Orders"}
              </p>
              <p className="text-sm text-gray-500">Last Order</p>
            </div>
          </div>
        </div>

        {/* Saved Addresses */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-linear-to-br from-sage to-linen rounded-2xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-700"
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
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {addresses.length}
              </p>
              <p className="text-sm text-gray-500">Saved Addresses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setActiveSection("orders")}
            className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 hover:border-sand hover:shadow-lg transition-all duration-300 text-left group"
          >
            <svg
              className="w-6 h-6 text-sand"
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
            <div>
              <p className="font-bold text-gray-900 group-hover:text-sand transition-colors">
                View Order History
              </p>
              <p className="text-sm text-gray-500">Track your past purchases</p>
            </div>
          </button>

          <button
            onClick={() => setActiveSection("personal")}
            className="flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-200 hover:border-sand hover:shadow-lg transition-all duration-300 text-left group"
          >
            <svg
              className="w-6 h-6 text-sage"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <div>
              <p className="font-bold text-gray-900 group-hover:text-sage transition-colors">
                Edit Profile
              </p>
              <p className="text-sm text-gray-500">
                Update your personal details
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
          <button
            onClick={() => setActiveSection("orders")}
            className="text-sm font-semibold text-sand hover:text-sage transition-colors"
          >
            View All →
          </button>
        </div>
        <div className="space-y-4">
          {orders.slice(0, 2).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 hover:border-sand/50 hover:shadow-md transition-all duration-300"
            >
              <div className="flex-1">
                <p className="font-bold text-gray-900">Order ID: {order.id}</p>
                <p className="text-sm text-gray-500">{order.created_at}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${order.statusColor}`}
                >
                  {order.status}
                </span>
                <p className="font-bold text-gray-900">${order.total_amount.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
