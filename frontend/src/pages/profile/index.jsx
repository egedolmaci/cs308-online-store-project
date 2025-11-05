import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Mock user data (replace with actual user data from state/API)
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
  };

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

  const [editingPersonalDetails, setEditingPersonalDetails] = useState(false);
  const [personalDetailsForm, setPersonalDetailsForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  });

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "orders", label: "Order History", icon: "orders" },
    { id: "invoices", label: "Invoices & Billing", icon: "invoices" },
    { id: "personal", label: "Personal Details", icon: "personal" },
    { id: "addresses", label: "Shipping Addresses", icon: "addresses" },
    { id: "settings", label: "Settings", icon: "settings", badge: "Soon" },
  ];

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
      orders: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      ),
      invoices: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      ),
      personal: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      ),
      addresses: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      ),
      settings: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      ),
    };
    return icons[iconType];
  };

  const handleDownloadInvoice = (invoiceId) => {
    // TODO: Implement actual PDF download
    console.log(`Downloading invoice: ${invoiceId}`);
    alert(`Downloading invoice ${invoiceId}...`);
  };

  const handleSavePersonalDetails = () => {
    // TODO: Implement actual API call
    console.log("Saving personal details:", personalDetailsForm);
    setEditingPersonalDetails(false);
    alert("Personal details updated successfully!");
  };

  const handleDeleteAddress = (addressId) => {
    if (
      window.confirm("Are you sure you want to delete this shipping address?")
    ) {
      setAddresses(addresses.filter((addr) => addr.id !== addressId));
    }
  };

  const renderDashboard = () => (
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
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
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
                {orders[0].status}
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
              <p className="text-sm text-gray-500">
                Track your past purchases
              </p>
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
            View All ’
          </button>
        </div>
        <div className="space-y-4">
          {orders.slice(0, 2).map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 hover:border-sand/50 hover:shadow-md transition-all duration-300"
            >
              <div className="flex-1">
                <p className="font-bold text-gray-900">{order.id}</p>
                <p className="text-sm text-gray-500">{order.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${order.statusColor}`}
                >
                  {order.status}
                </span>
                <p className="font-bold text-gray-900">${order.total}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrderHistory = () => (
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
                    {order.id}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${order.statusColor}`}
                  >
                    {order.status}
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
                    <span>{order.date}</span>
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
                    <span>{order.items} items</span>
                  </div>
                </div>
              </div>

              {/* Order Total & Action */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${order.total}
                  </p>
                </div>
                <button className="px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 hover:shadow-lg transition-all duration-300 active:scale-95">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Invoices & Billing</h2>
        <p className="text-sm text-gray-500">
          {invoices.length} total invoices
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-sand/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Invoice ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Date Issued
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-900">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      {invoice.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{invoice.orderId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{invoice.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">
                      ${invoice.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success text-white">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDownloadInvoice(invoice.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sand text-white font-semibold hover:bg-sage hover:shadow-lg transition-all duration-300 active:scale-95"
                    >
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
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPersonalDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
        {!editingPersonalDetails && (
          <button
            onClick={() => setEditingPersonalDetails(true)}
            className="px-6 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 hover:shadow-lg transition-all duration-300 active:scale-95"
          >
            Edit
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
        {editingPersonalDetails ? (
          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={personalDetailsForm.firstName}
                  onChange={(e) =>
                    setPersonalDetailsForm({
                      ...personalDetailsForm,
                      firstName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand hover:border-sand/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={personalDetailsForm.lastName}
                  onChange={(e) =>
                    setPersonalDetailsForm({
                      ...personalDetailsForm,
                      lastName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand hover:border-sand/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={personalDetailsForm.email}
                onChange={(e) =>
                  setPersonalDetailsForm({
                    ...personalDetailsForm,
                    email: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand hover:border-sand/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={personalDetailsForm.phone}
                onChange={(e) =>
                  setPersonalDetailsForm({
                    ...personalDetailsForm,
                    phone: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand hover:border-sand/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-0"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleSavePersonalDetails}
                className="flex-1 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 hover:shadow-lg transition-all duration-300 active:scale-95"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditingPersonalDetails(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-900 text-gray-900 font-bold hover:bg-gray-50 hover:shadow-lg transition-all duration-300 active:scale-95"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">First Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.firstName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Last Name</p>
                <p className="text-lg font-semibold text-gray-900">
                  {user.lastName}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email Address</p>
              <p className="text-lg font-semibold text-gray-900">
                {user.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone Number</p>
              <p className="text-lg font-semibold text-gray-900">
                {user.phone}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Change Password
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Update your password to keep your account secure
        </p>
        <button className="px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 hover:shadow-lg transition-all duration-300 active:scale-95">
          Change Password
        </button>
      </div>
    </div>
  );

  const renderAddresses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Shipping Addresses</h2>
        <button className="px-6 py-2 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 hover:shadow-lg transition-all duration-300 active:scale-95">
          Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20 hover:shadow-xl transition-all duration-300 relative"
          >
            {address.isDefault && (
              <span className="absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-semibold bg-success text-white">
                Default
              </span>
            )}

            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-linear-to-br from-sand to-sage rounded-2xl flex items-center justify-center flex-shrink-0">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {address.type}
                </h3>
                <p className="text-sm font-semibold text-gray-700">
                  {address.name}
                </p>
              </div>
            </div>

            <div className="space-y-1 text-sm text-gray-600 mb-6">
              <p>{address.street}</p>
              <p>
                {address.city}, {address.state} {address.zip}
              </p>
              <p>{address.country}</p>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:border-sand hover:text-sand hover:shadow-md transition-all duration-300 active:scale-95">
                Edit
              </button>
              <button
                onClick={() => handleDeleteAddress(address.id)}
                className="flex-1 px-4 py-2 rounded-xl border-2 border-error text-error font-semibold hover:bg-error hover:text-white hover:shadow-md transition-all duration-300 active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20 text-center">
        <div className="w-20 h-20 bg-linear-to-br from-sand to-sage rounded-3xl flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Coming Soon
        </h3>
        <p className="text-gray-500">
          Advanced settings and preferences will be available here soon.
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "orders":
        return renderOrderHistory();
      case "invoices":
        return renderInvoices();
      case "personal":
        return renderPersonalDetails();
      case "addresses":
        return renderAddresses();
      case "settings":
        return renderSettings();
      default:
        return renderDashboard();
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
          <aside
            className={`lg:block ${isMobileSidebarOpen ? "block" : "hidden"}`}
          >
            <div className="bg-white rounded-3xl shadow-xl border border-sand/20 p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 px-2">
                My Account
              </h2>
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                      activeSection === item.id
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

              {/* Logout Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => navigate("/")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-error text-error font-semibold hover:bg-error hover:text-white transition-all duration-300 active:scale-95"
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
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Log Out
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
