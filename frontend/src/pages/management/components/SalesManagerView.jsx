import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserOrders,
  selectOrders,
  selectOrdersLoading,
  selectOrdersError,
} from "../../../store/slices/ordersSlice";
import {
  fetchProducts,
  updateProduct,
  selectProducts,
  selectProductsLoading,
} from "../../../store/slices/productsSlice";
import { generateInvoiceReportPDF } from "../../../utils/pdfGenerator";

const SalesManagerView = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("invoices");

  // Redux state
  const orders = useSelector(selectOrders);
  const isLoadingOrders = useSelector(selectOrdersLoading);
  const ordersError = useSelector(selectOrdersError);

  const products = useSelector(selectProducts);
  const isLoadingProducts = useSelector(selectProductsLoading);

  // Invoice Reporting State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Stock Management State
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockValues, setStockValues] = useState({});

  // Revenue Calculator State
  const [revenueStartDate, setRevenueStartDate] = useState("");
  const [revenueEndDate, setRevenueEndDate] = useState("");
  const [revenueData, setRevenueData] = useState(null);

  // Load products when stock tab is active
  useEffect(() => {
    if (activeTab === "stock") {
      dispatch(fetchProducts());
    } else if (activeTab === "invoices" || activeTab === "revenue") {
      dispatch(fetchUserOrders());
    }
  }, [activeTab, dispatch]);

  // Initialize stock values when products load
  useEffect(() => {
    if (products.length > 0) {
      const initialStockValues = {};
      products.forEach((product) => {
        initialStockValues[product.id] = product.stock;
      });
      setStockValues(initialStockValues);
    }
  }, [products]);

  // Invoice Reporting Functions
  const handleFetchInvoices = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.created_at || order.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      return orderDate >= start && orderDate <= end;
    });

    setFilteredOrders(filtered);
  };

  const handlePrintInvoices = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    generateInvoiceReportPDF(filteredOrders, startDate, endDate);
  };

  // Stock Management Functions
  const handleStockUpdate = async (productId) => {
    try {
      await dispatch(
        updateProduct({
          productId,
          productData: { stock: stockValues[productId] },
        })
      ).unwrap();
      setEditingStockId(null);
      dispatch(fetchProducts());
    } catch (error) {
      alert(error || "Error updating stock");
    }
  };

  const handleStockChange = (productId, value) => {
    setStockValues({
      ...stockValues,
      [productId]: parseInt(value) || 0,
    });
  };

  // Revenue Calculator Functions
  const handleCalculateRevenue = () => {
    if (!revenueStartDate || !revenueEndDate) {
      alert("Please select both start and end dates");
      return;
    }

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.created_at || order.date);
      const start = new Date(revenueStartDate);
      const end = new Date(revenueEndDate);
      return orderDate >= start && orderDate <= end;
    });

    const totalRevenue = filtered.reduce(
      (sum, order) => sum + parseFloat(order.total_amount || 0),
      0
    );
    const paidRevenue = filtered
      .filter((o) => o.status === "delivered" || o.status === "paid")
      .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
    const pendingRevenue = filtered
      .filter((o) => o.status === "pending" || o.status === "processing")
      .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

    setRevenueData({
      totalRevenue: totalRevenue.toFixed(2),
      paidRevenue: paidRevenue.toFixed(2),
      pendingRevenue: pendingRevenue.toFixed(2),
      totalOrders: filtered.length,
      paidOrders: filtered.filter((o) => o.status === "delivered" || o.status === "paid").length,
      pendingOrders: filtered.filter((o) => o.status === "pending" || o.status === "processing")
        .length,
      averageOrderValue: filtered.length > 0 ? (totalRevenue / filtered.length).toFixed(2) : "0.00",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sales Management
        </h2>
        <p className="text-gray-600">
          View invoices, manage stock, and analyze revenue
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl p-2 shadow-lg border border-sand/20">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("invoices")}
            className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "invoices"
                ? "bg-linear-to-br from-sand to-sage text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Invoice Reporting
          </button>
          <button
            onClick={() => setActiveTab("stock")}
            className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "stock"
                ? "bg-linear-to-br from-sand to-sage text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Stock Management
          </button>
          <button
            onClick={() => setActiveTab("revenue")}
            className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "revenue"
                ? "bg-linear-to-br from-sand to-sage text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Revenue Calculator
          </button>
        </div>
      </div>

      {/* Invoice Reporting Tab */}
      {activeTab === "invoices" && (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Invoice Reporting
          </h3>

          {ordersError && (
            <div className="mb-4 p-4 rounded-2xl bg-error/20 border border-error">
              <p className="text-error font-medium">{ordersError}</p>
            </div>
          )}

          {/* Date Range Picker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Fetch Button */}
          <button
            onClick={handleFetchInvoices}
            disabled={isLoadingOrders}
            className="w-full px-6 py-4 rounded-2xl bg-linear-to-r from-sand to-sage text-white font-bold hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isLoadingOrders ? "Loading..." : "Fetch Invoices"}
          </button>

          {/* Invoice Table */}
          {filteredOrders.length > 0 && (
            <>
              <div className="mb-4 flex gap-3">
                <button
                  onClick={handlePrintInvoices}
                  className="flex-1 px-4 py-3 rounded-2xl border-2 border-sand text-sand font-semibold hover:bg-sand hover:text-white transition-all duration-300"
                >
                  Print
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 px-4 py-3 rounded-2xl bg-sand text-white font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Save as PDF
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-linear-to-r from-sand to-sage text-white">
                      <th className="px-4 py-3 text-left rounded-tl-2xl">
                        Order ID
                      </th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left rounded-tr-2xl">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => (
                      <tr
                        key={order.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index === filteredOrders.length - 1 ? "border-0" : ""
                        }`}
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          ${order.total_amount}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              order.status === "delivered"
                                ? "bg-success-light text-success"
                                : order.status === "pending"
                                ? "bg-warning/20 text-warning"
                                : "bg-error/20 text-error"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="mt-6 p-4 rounded-2xl bg-linear-to-r from-sand/10 to-sage/10 border border-sand/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">
                    Total Amount:
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    $
                    {filteredOrders
                      .reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Stock Management Tab */}
      {activeTab === "stock" && (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Stock Management</h3>

          {isLoadingProducts ? (
            <p className="text-center text-gray-500 py-8">Loading products...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-linear-to-r from-sand to-sage text-white">
                    <th className="px-4 py-3 text-left rounded-tl-2xl">Product Name</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Current Stock</th>
                    <th className="px-4 py-3 text-left rounded-tr-2xl">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index === products.length - 1 ? "border-0" : ""
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{product.category}</td>
                      <td className="px-4 py-3">
                        {editingStockId === product.id ? (
                          <input
                            type="number"
                            value={stockValues[product.id]}
                            onChange={(e) => handleStockChange(product.id, e.target.value)}
                            className="w-24 px-3 py-2 rounded-xl border-2 border-sand focus:outline-none"
                          />
                        ) : (
                          <span
                            className={`font-semibold ${
                              product.stock < 10 ? "text-error" : "text-gray-900"
                            }`}
                          >
                            {product.stock}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editingStockId === product.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStockUpdate(product.id)}
                              className="px-3 py-1 rounded-xl bg-success-light text-success font-semibold hover:bg-success hover:text-white transition-all duration-300"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingStockId(null);
                                setStockValues({
                                  ...stockValues,
                                  [product.id]: product.stock,
                                });
                              }}
                              className="px-3 py-1 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setEditingStockId(product.id)}
                            className="px-3 py-1 rounded-xl border-2 border-sand text-sand font-semibold hover:bg-sand hover:text-white transition-all duration-300"
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Revenue Calculator Tab */}
      {activeTab === "revenue" && (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Revenue Calculator
          </h3>

          {/* Date Range Picker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={revenueStartDate}
                onChange={(e) => setRevenueStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={revenueEndDate}
                onChange={(e) => setRevenueEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Calculate Button */}
          <button
            onClick={handleCalculateRevenue}
            disabled={isLoadingOrders}
            className="w-full px-6 py-4 rounded-2xl bg-linear-to-r from-sand to-sage text-white font-bold hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isLoadingOrders ? "Loading..." : "Calculate Revenue"}
          </button>

          {/* Revenue Data Display */}
          {revenueData && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-linear-to-br from-success-light/20 to-success/20 border border-success">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ${revenueData.totalRevenue}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-linear-to-br from-sand/20 to-sage/20 border border-sand">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Paid Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ${revenueData.paidRevenue}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-linear-to-br from-warning/20 to-warning/10 border border-warning">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Pending Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ${revenueData.pendingRevenue}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-linear-to-br from-linen/40 to-cream/40 border border-linen">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Total Orders
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {revenueData.totalOrders}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-linear-to-br from-success-light/20 to-success/20 border border-success">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Paid Orders
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {revenueData.paidOrders}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-linear-to-br from-sage/20 to-linen/20 border border-sage">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  Avg Order Value
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ${revenueData.averageOrderValue}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SalesManagerView;
