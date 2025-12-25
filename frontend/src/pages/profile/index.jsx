import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/slices/userSlice";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import OrderHistory from "./components/OrderHistory";
import PersonalDetails from "./components/PersonalDetails";
import { fetchUserOrders } from "../../store/slices/ordersSlice";
import Wishlist from "./components/Wishlist";
import { fetchWishlist } from "../../store/slices/wishlistSlice";
import { MANAGEMENT_ROLES } from "../../constants";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const userRole = useSelector((state) => state.user.role);
  const isManagementUser = MANAGEMENT_ROLES.includes(userRole);

  useEffect(() => {
    if (isManagementUser) {
      setActiveSection("personal");
    }
  }, [isManagementUser, setActiveSection]);

  // Mock order data
  const orders = useSelector((state) => state.orders.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
    dispatch(fetchWishlist());
  }, [dispatch]);


  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/store");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard
            user={user}
            orders={orders}
            setActiveSection={setActiveSection}
          />
        );
      case "orders":
        return <OrderHistory orders={orders} />;
      case "wishlist":
        return <Wishlist />;
      case "personal":
        return <PersonalDetails />;
      default:
        return (
          <Dashboard
            user={user}
            orders={orders}
            setActiveSection={setActiveSection}
          />
        );
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
            <span className="font-bold text-gray-900">Menu</span>
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
            onLogout={handleLogout}
          />

          {/* Main Content */}
          <main className="lg:col-span-3">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
