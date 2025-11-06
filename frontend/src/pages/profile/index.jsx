import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../store/slices/userSlice";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import OrderHistory from "./components/OrderHistory";
import Invoices from "./components/Invoices";
import PersonalDetails from "./components/PersonalDetails";
import Addresses from "./components/Addresses";
import Settings from "./components/Settings";
import NotFound from "../not-found";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Mock order data
  const orders = [
    {
      id: "ORD-2024-001",
      date: "2024-11-01",
      total: 249.99,
      status: "Delivered",
      statusColor: "bg-success",
      items: 3,
    },
    {
      id: "ORD-2024-002",
      date: "2024-10-28",
      total: 129.99,
      status: "Shipped",
      statusColor: "bg-success-light",
      items: 2,
    },
    {
      id: "ORD-2024-003",
      date: "2024-10-15",
      total: 89.99,
      status: "Processing",
      statusColor: "bg-warning",
      items: 1,
    },
  ];

  // Mock invoice data
  const invoices = [
    {
      id: "INV-2024-001",
      orderId: "ORD-2024-001",
      date: "2024-11-01",
      amount: 249.99,
      status: "Paid",
    },
    {
      id: "INV-2024-002",
      orderId: "ORD-2024-002",
      date: "2024-10-28",
      amount: 129.99,
      status: "Paid",
    },
    {
      id: "INV-2024-003",
      orderId: "ORD-2024-003",
      date: "2024-10-15",
      amount: 89.99,
      status: "Paid",
    },
  ];

  // Mock addresses
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      name: "John Doe",
      street: "123 Fashion Avenue",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "USA",
      isDefault: true,
    },
    {
      id: 2,
      type: "Office",
      name: "John Doe",
      street: "456 Business Blvd",
      city: "Brooklyn",
      state: "NY",
      zip: "11201",
      country: "USA",
      isDefault: false,
    },
  ]);

  const handleDownloadInvoice = (invoiceId) => {
    // TODO: Implement actual PDF download
    console.log(`Downloading invoice: ${invoiceId}`);
    alert(`Downloading invoice ${invoiceId}...`);
  };

  const handleDeleteAddress = (addressId) => {
    if (
      window.confirm("Are you sure you want to delete this shipping address?")
    ) {
      setAddresses(addresses.filter((addr) => addr.id !== addressId));
    }
  };

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
            addresses={addresses}
            setActiveSection={setActiveSection}
          />
        );
      case "orders":
        return <OrderHistory orders={orders} />;
      case "invoices":
        return (
          <Invoices
            invoices={invoices}
            onDownloadInvoice={handleDownloadInvoice}
          />
        );
      case "personal":
        return <PersonalDetails user={user} />;
      case "addresses":
        return (
          <Addresses
            addresses={addresses}
            onDeleteAddress={handleDeleteAddress}
          />
        );
      case "settings":
        return <Settings />;
      default:
        return (
          <Dashboard
            user={user}
            orders={orders}
            addresses={addresses}
            setActiveSection={setActiveSection}
          />
        );
    }
  };

  if (isAuthenticated === false) {
    return <NotFound />;
  }

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
