import { USER_ROLES, USER_ROLE_LABELS } from "../../../constants";

const Dashboard = ({ userRole, setActiveSection }) => {
  const getRoleSpecificContent = () => {
    switch (userRole) {
      case USER_ROLES.SALES_MANAGER:
        return {
          title: "Sales Management Dashboard",
          quickActions: [
            {
              label: "Manage Discounts",
              icon: "discount",
              description: "Apply discounts to products",
              action: () => setActiveSection("sales"),
            },
            {
              label: "View Invoices",
              icon: "invoice",
              description: "Generate and view reports",
              action: () => setActiveSection("sales"),
            },
            {
              label: "Financial Analysis",
              icon: "chart",
              description: "View revenue and profit",
              action: () => setActiveSection("sales"),
            },
          ],
          stats: [
            {
              label: "Total Revenue",
              value: "$45,231",
              icon: "dollar",
              color: "from-sand to-sage",
            },
            {
              label: "Active Discounts",
              value: "12",
              icon: "tag",
              color: "from-success-light to-success",
            },
            {
              label: "Monthly Orders",
              value: "156",
              icon: "orders",
              color: "from-sage to-linen",
            },
          ],
        };

      case USER_ROLES.PRODUCT_MANAGER:
        return {
          title: "Product Management Dashboard",
          quickActions: [
            {
              label: "Manage Products",
              icon: "product",
              description: "Add, edit, or remove products",
              action: () => setActiveSection("products"),
            },
            {
              label: "Manage Categories",
              icon: "category",
              description: "Organize product categories",
              action: () => setActiveSection("products"),
            },
            {
              label: "Track Deliveries",
              icon: "delivery",
              description: "Monitor order deliveries",
              action: () => setActiveSection("products"),
            },
          ],
          stats: [
            {
              label: "Total Products",
              value: "245",
              icon: "product",
              color: "from-sand to-sage",
            },
            {
              label: "Low Stock Items",
              value: "8",
              icon: "warning",
              color: "from-warning to-error",
            },
            {
              label: "Active Deliveries",
              value: "23",
              icon: "truck",
              color: "from-sage to-linen",
            },
          ],
        };

      case USER_ROLES.SUPPORT_AGENT:
        return {
          title: "Support Dashboard",
          quickActions: [
            {
              label: "Active Chats",
              icon: "chat",
              description: "View and respond to customers",
              action: () => setActiveSection("support"),
            },
            {
              label: "Pending Requests",
              icon: "request",
              description: "Handle support tickets",
              action: () => setActiveSection("support"),
            },
            {
              label: "Customer Context",
              icon: "user",
              description: "View customer information",
              action: () => setActiveSection("support"),
            },
          ],
          stats: [
            {
              label: "Active Chats",
              value: "5",
              icon: "chat",
              color: "from-sand to-sage",
            },
            {
              label: "Waiting in Queue",
              value: "12",
              icon: "queue",
              color: "from-warning to-error",
            },
            {
              label: "Resolved Today",
              value: "34",
              icon: "check",
              color: "from-success-light to-success",
            },
          ],
        };

      default:
        return {
          title: "Management Dashboard",
          quickActions: [],
          stats: [],
        };
    }
  };

  const content = getRoleSpecificContent();

  const getIcon = (iconType) => {
    const icons = {
      discount: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      ),
      invoice: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      ),
      chart: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      ),
      product: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      ),
      category: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      ),
      delivery: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
        />
      ),
      chat: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      ),
      request: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      ),
      user: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      ),
      dollar: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
      tag: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        />
      ),
      orders: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      ),
      warning: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      ),
      truck: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
        />
      ),
      queue: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
      check: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
    };
    return icons[iconType] || icons.product;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-linear-to-br from-sand via-sage to-sand rounded-3xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-bold mb-2">{content.title}</h2>
        <p className="text-white/90">
          Manage your {USER_ROLE_LABELS[userRole].toLowerCase()} responsibilities
        </p>
      </div>

      {/* Quick Stats */}
      {content.stats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 bg-linear-to-br ${stat.color} rounded-2xl flex items-center justify-center`}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {getIcon(stat.icon)}
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {content.quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-sand hover:shadow-lg transition-all duration-300 text-center group"
            >
              <div className="w-12 h-12 bg-linear-to-br from-sand/20 to-sage/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6 text-sand"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {getIcon(action.icon)}
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900 group-hover:text-sand transition-colors">
                  {action.label}
                </p>
                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          <p className="text-gray-500 text-center py-8">
            No recent activity to display
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
