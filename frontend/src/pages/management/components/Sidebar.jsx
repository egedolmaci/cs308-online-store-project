import { USER_ROLES, USER_ROLE_LABELS } from "../../../constants";

const Sidebar = ({
  activeSection,
  setActiveSection,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  userRole,
}) => {
  // Define menu items based on role
  const getMenuItems = () => {
    const commonItems = [
      { id: "dashboard", label: "Dashboard", icon: "dashboard", roles: "all" },
    ];

    const roleSpecificItems = [];

    if (userRole === USER_ROLES.SALES_MANAGER) {
      roleSpecificItems.push({
        id: "sales",
        label: "Sales Management",
        icon: "sales",
        roles: [USER_ROLES.SALES_MANAGER],
      });
    }

    if (userRole === USER_ROLES.PRODUCT_MANAGER) {
      roleSpecificItems.push({
        id: "products",
        label: "Product Management",
        icon: "products",
        roles: [USER_ROLES.PRODUCT_MANAGER],
      });
      roleSpecificItems.push({
        id: "reviews",
        label: "Reviews",
        icon: "reviews",
        roles: [USER_ROLES.PRODUCT_MANAGER],
      });
      roleSpecificItems.push({
        id: "orders",
        label: "Order Tracking",
        icon: "orders",
        roles: [USER_ROLES.PRODUCT_MANAGER],
      });
    }

    if (userRole === USER_ROLES.SUPPORT_AGENT) {
      roleSpecificItems.push({
        id: "support",
        label: "Support",
        icon: "support",
        roles: [USER_ROLES.SUPPORT_AGENT],
      });
    }

    return [...commonItems, ...roleSpecificItems];
  };

  const menuItems = getMenuItems();

  const getIcon = (iconType) => {
    const icons = {
      dashboard: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      ),
      sales: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      ),
      products: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      ),
      support: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      ),
      reviews: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      ),
      orders: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      ),
    };
    return icons[iconType];
  };

  return (
    <aside className={`lg:block ${isMobileSidebarOpen ? "block" : "hidden"}`}>
      <div className="bg-white rounded-3xl shadow-xl border border-sand/20 p-6 sticky top-8">
        {/* Role Badge */}
        <div className="mb-6">
          <div className="bg-linear-to-br from-sand to-sage rounded-2xl p-4 text-center">
            <p className="text-white text-sm font-medium mb-1">Role</p>
            <p className="text-white text-lg font-bold">
              {USER_ROLE_LABELS[userRole]}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 px-2">
          Management
        </h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${activeSection === item.id
                  ? "bg-linear-to-br from-sand to-sage text-white shadow-lg"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {getIcon(item.icon)}
                </svg>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-1 rounded-full text-xs font-bold bg-warning text-white">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Back to Store */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <a
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-sand text-sand font-semibold hover:bg-sand hover:text-white transition-all duration-300 active:scale-95"
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Back to Store
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
