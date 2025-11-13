import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import SalesManagerView from "./components/SalesManagerView";
import ProductManagerView from "./components/ProductManagerView";
import SupportAgentView from "./components/SupportAgentView";
import { USER_ROLES } from "../../constants";

const Management = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const user = useSelector((state) => state.user);

  // Simulate role - in production this would come from authentication
  // You can change this to test different roles
  const userRole = user.role || USER_ROLES.SALES_MANAGER;

  // Check if user has management access
  const hasManagementAccess = [
    USER_ROLES.SALES_MANAGER,
    USER_ROLES.PRODUCT_MANAGER,
    USER_ROLES.SUPPORT_AGENT,
  ].includes(userRole);

  // Redirect if no access
  if (!hasManagementAccess) {
    navigate("/");
    return null;
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard userRole={userRole} setActiveSection={setActiveSection} />;
      case "sales":
        if (userRole === USER_ROLES.SALES_MANAGER) {
          return <SalesManagerView />;
        }
        return <Dashboard userRole={userRole} setActiveSection={setActiveSection} />;
      case "products":
        if (userRole === USER_ROLES.PRODUCT_MANAGER) {
          return <ProductManagerView />;
        }
        return <Dashboard userRole={userRole} setActiveSection={setActiveSection} />;
      case "support":
        if (userRole === USER_ROLES.SUPPORT_AGENT) {
          return <SupportAgentView />;
        }
        return <Dashboard userRole={userRole} setActiveSection={setActiveSection} />;
      default:
        return <Dashboard userRole={userRole} setActiveSection={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-linen via-cream to-linen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-2xl shadow-lg border border-sand/20"
          >
            <span className="font-bold text-gray-900">Management Menu</span>
            <svg
              className={`w-6 h-6 text-gray-700 transform transition-transform ${
                isMobileSidebarOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isMobileSidebarOpen={isMobileSidebarOpen}
            setIsMobileSidebarOpen={setIsMobileSidebarOpen}
            userRole={userRole}
          />

          {/* Main Content */}
          <main className="lg:col-span-3">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
};

export default Management;
