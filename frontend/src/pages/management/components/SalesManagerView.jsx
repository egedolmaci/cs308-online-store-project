import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import {
  fetchInvoices,
  fetchFinancials,
  updateProductPrice,
  fetchProductsWithStock,
  updateProductStock,
  fetchAllPurchases,
  fetchPurchaseById,
} from "../../../api/mockAdminService";

const SalesManagerView = () => {
  const [activeTab, setActiveTab] = useState("discounts");

  // Discount Management State
  const [discountRate, setDiscountRate] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discountMessage, setDiscountMessage] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  // Invoice Reporting State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);

  // Financial Analysis State
  const [financeStartDate, setFinanceStartDate] = useState("");
  const [financeEndDate, setFinanceEndDate] = useState("");
  const [financialData, setFinancialData] = useState(null);
  const [isLoadingFinancials, setIsLoadingFinancials] = useState(false);

  // Stock Management State
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockValues, setStockValues] = useState({});

  // Purchase History State
  const [purchases, setPurchases] = useState([]);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(false);
  const [purchaseStartDate, setPurchaseStartDate] = useState("");
  const [purchaseEndDate, setPurchaseEndDate] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  // Revenue Calculator State
  const [revenueStartDate, setRevenueStartDate] = useState("");
  const [revenueEndDate, setRevenueEndDate] = useState("");
  const [revenueData, setRevenueData] = useState(null);
  const [isCalculatingRevenue, setIsCalculatingRevenue] = useState(false);

  // Mock products for discount selection
  const mockProducts = [
    { id: "PROD-001", name: "Classic T-Shirt", price: 29.99 },
    { id: "PROD-002", name: "Denim Jeans", price: 79.99 },
    { id: "PROD-003", name: "Hoodie", price: 59.99 },
    { id: "PROD-004", name: "Leather Jacket", price: 199.99 },
    { id: "PROD-005", name: "Running Sneakers", price: 89.99 },
  ];

  // Discount Management Functions
  const handleApplyDiscount = async () => {
    if (selectedProducts.length === 0) {
      setDiscountMessage("Please select at least one product");
      return;
    }

    setIsApplyingDiscount(true);
    try {
      const result = await updateProductPrice({
        discountRate,
        productIds: selectedProducts,
      });

      if (result.success) {
        setDiscountMessage(
          `${result.message}. ${result.notifiedUsers} wishlist users notified.`
        );
        setSelectedProducts([]);
        setDiscountRate(10);
      }
    } catch (error) {
      setDiscountMessage("Error applying discount. Please try again.");
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Invoice Reporting Functions
  const handleFetchInvoices = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates");
      return;
    }

    setIsLoadingInvoices(true);
    try {
      const data = await fetchInvoices(startDate, endDate);
      setInvoices(data);
    } catch (error) {
      alert("Error fetching invoices");
    } finally {
      setIsLoadingInvoices(false);
    }
  };

  const handlePrintInvoices = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Set up colors
    const primaryColor = [182, 174, 159]; // sand color
    const textColor = [31, 41, 55]; // gray-900

    // Title
    doc.setFontSize(20);
    doc.setTextColor(...textColor);
    doc.text("Invoice Report", 20, 20);

    // Date Range
    doc.setFontSize(12);
    doc.text(`Period: ${startDate} to ${endDate}`, 20, 30);

    // Table Header
    doc.setFillColor(...primaryColor);
    doc.rect(20, 40, 170, 10, "F");
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("Invoice ID", 25, 47);
    doc.text("Customer", 60, 47);
    doc.text("Date", 110, 47);
    doc.text("Amount", 140, 47);
    doc.text("Status", 170, 47);

    // Table Rows
    let yPos = 58;
    doc.setTextColor(...textColor);

    invoices.forEach((invoice, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.text(invoice.id, 25, yPos);
      doc.text(invoice.customerName.substring(0, 20), 60, yPos);
      doc.text(invoice.date, 110, yPos);
      doc.text(`$${invoice.amount}`, 140, yPos);
      doc.text(invoice.status, 170, yPos);

      yPos += 10;
    });

    // Total
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    const total = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
    doc.text(`Total: $${total.toFixed(2)}`, 140, yPos);

    doc.save(`invoices-${startDate}-to-${endDate}.pdf`);
  };

  // Financial Analysis Functions
  const handleFetchFinancials = async () => {
    if (!financeStartDate || !financeEndDate) {
      alert("Please select both start and end dates");
      return;
    }

    setIsLoadingFinancials(true);
    try {
      const data = await fetchFinancials(financeStartDate, financeEndDate);
      setFinancialData(data);
    } catch (error) {
      alert("Error fetching financial data");
    } finally {
      setIsLoadingFinancials(false);
    }
  };

  // Stock Management Functions
  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const data = await fetchProductsWithStock();
      setProducts(data);
      const initialStockValues = {};
      data.forEach((product) => {
        initialStockValues[product.id] = product.stock;
      });
      setStockValues(initialStockValues);
    } catch (error) {
      alert("Error loading products");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleStockUpdate = async (productId) => {
    try {
      await updateProductStock(productId, stockValues[productId]);
      setEditingStockId(null);
      loadProducts();
    } catch (error) {
      alert("Error updating stock");
    }
  };

  const handleStockChange = (productId, value) => {
    setStockValues({
      ...stockValues,
      [productId]: parseInt(value) || 0,
    });
  };

  // Purchase History Functions
  const loadPurchases = async () => {
    setIsLoadingPurchases(true);
    try {
      const data = await fetchAllPurchases(purchaseStartDate, purchaseEndDate);
      setPurchases(data);
    } catch (error) {
      alert("Error loading purchases");
    } finally {
      setIsLoadingPurchases(false);
    }
  };

  const handleViewPurchaseInvoice = async (purchaseId) => {
    try {
      const purchase = await fetchPurchaseById(purchaseId);
      setSelectedPurchase(purchase);
    } catch (error) {
      alert("Error loading purchase details");
    }
  };

  const handleDownloadPurchaseInvoice = (purchase) => {
    const doc = new jsPDF();
    const primaryColor = [182, 174, 159];
    const textColor = [31, 41, 55];

    // Header
    doc.setFontSize(24);
    doc.setTextColor(...textColor);
    doc.text("Fashion Store", 20, 20);

    doc.setFontSize(16);
    doc.text("INVOICE", 20, 35);

    // Invoice Details
    doc.setFontSize(10);
    doc.text(`Invoice #: ${purchase.id}`, 20, 50);
    doc.text(`Order #: ${purchase.orderId}`, 20, 58);
    doc.text(`Date: ${purchase.date}`, 20, 66);

    // Customer Info
    doc.text("Bill To:", 120, 50);
    doc.text(purchase.customerName, 120, 58);
    doc.text(purchase.email, 120, 66);
    if (purchase.phone) doc.text(purchase.phone, 120, 74);
    if (purchase.address) {
      const addressLines = doc.splitTextToSize(purchase.address, 70);
      doc.text(addressLines, 120, 82);
    }

    // Items Table
    const tableTop = 100;
    doc.setFillColor(...primaryColor);
    doc.rect(20, tableTop, 170, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("Item", 25, tableTop + 7);
    doc.text("Qty", 110, tableTop + 7);
    doc.text("Price", 135, tableTop + 7);
    doc.text("Total", 165, tableTop + 7);

    // Items
    let yPos = tableTop + 18;
    doc.setTextColor(...textColor);
    purchase.items.forEach((item) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(item.productName, 25, yPos);
      doc.text(item.quantity.toString(), 110, yPos);
      doc.text(`$${item.price}`, 135, yPos);
      doc.text(`$${item.subtotal}`, 165, yPos);
      yPos += 10;
    });

    // Total
    yPos += 10;
    doc.setLineWidth(0.5);
    doc.line(130, yPos, 190, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Total:", 130, yPos);
    doc.text(`$${purchase.amount}`, 165, yPos);

    // Status
    yPos += 15;
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Status: ${purchase.status}`, 130, yPos);

    doc.save(`invoice-${purchase.id}.pdf`);
  };

  // Revenue Calculator Functions
  const handleCalculateRevenue = async () => {
    if (!revenueStartDate || !revenueEndDate) {
      alert("Please select both start and end dates");
      return;
    }

    setIsCalculatingRevenue(true);
    try {
      const purchases = await fetchAllPurchases(revenueStartDate, revenueEndDate);
      const totalRevenue = purchases.reduce(
        (sum, purchase) => sum + parseFloat(purchase.amount),
        0
      );
      const paidRevenue = purchases
        .filter((p) => p.status === "Paid")
        .reduce((sum, purchase) => sum + parseFloat(purchase.amount), 0);
      const pendingRevenue = purchases
        .filter((p) => p.status === "Pending")
        .reduce((sum, purchase) => sum + parseFloat(purchase.amount), 0);

      setRevenueData({
        totalRevenue: totalRevenue.toFixed(2),
        paidRevenue: paidRevenue.toFixed(2),
        pendingRevenue: pendingRevenue.toFixed(2),
        totalOrders: purchases.length,
        paidOrders: purchases.filter((p) => p.status === "Paid").length,
        pendingOrders: purchases.filter((p) => p.status === "Pending").length,
        averageOrderValue: (totalRevenue / purchases.length).toFixed(2),
      });
    } catch (error) {
      alert("Error calculating revenue");
    } finally {
      setIsCalculatingRevenue(false);
    }
  };

  // Load products when stock tab is active
  useEffect(() => {
    if (activeTab === "stock") {
      loadProducts();
    }
  }, [activeTab]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Sales Management
        </h2>
        <p className="text-gray-600">
          Manage discounts, view invoices, and analyze financials
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl p-2 shadow-lg border border-sand/20">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("discounts")}
            className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "discounts"
                ? "bg-linear-to-br from-sand to-sage text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Discount Management
          </button>
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
            onClick={() => setActiveTab("financials")}
            className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
              activeTab === "financials"
                ? "bg-linear-to-br from-sand to-sage text-white shadow-lg"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Financial Analysis
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "discounts" && (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Apply Discounts
          </h3>

          {/* Discount Rate Slider */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Discount Rate: {discountRate}%
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={discountRate}
              onChange={(e) => setDiscountRate(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-sand"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>5%</span>
              <span>25%</span>
              <span>50%</span>
            </div>
          </div>

          {/* Product Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Products
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => toggleProductSelection(product.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    selectedProducts.includes(product.id)
                      ? "border-sand bg-sand/10 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Original: ${product.price}
                      </p>
                      <p className="text-sm font-semibold text-sand">
                        New: $
                        {(product.price * (1 - discountRate / 100)).toFixed(2)}
                      </p>
                    </div>
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedProducts.includes(product.id)
                          ? "border-sand bg-sand"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedProducts.includes(product.id) && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApplyDiscount}
            disabled={isApplyingDiscount || selectedProducts.length === 0}
            className="w-full px-6 py-4 rounded-2xl bg-linear-to-r from-sand to-sage text-white font-bold hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplyingDiscount
              ? "Applying Discount..."
              : `Apply ${discountRate}% Discount to ${selectedProducts.length} Products`}
          </button>

          {/* Message */}
          {discountMessage && (
            <div className="mt-4 p-4 rounded-2xl bg-success-light/20 border border-success">
              <p className="text-success font-medium">{discountMessage}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "invoices" && (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Invoice Reporting
          </h3>

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
            disabled={isLoadingInvoices}
            className="w-full px-6 py-4 rounded-2xl bg-linear-to-r from-sand to-sage text-white font-bold hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isLoadingInvoices ? "Loading..." : "Fetch Invoices"}
          </button>

          {/* Invoice Table */}
          {invoices.length > 0 && (
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
                        Invoice ID
                      </th>
                      <th className="px-4 py-3 text-left">Customer</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Amount</th>
                      <th className="px-4 py-3 text-left rounded-tr-2xl">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice, index) => (
                      <tr
                        key={invoice.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index === invoices.length - 1 ? "border-0" : ""
                        }`}
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {invoice.id}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {invoice.customerName}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {invoice.email}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {invoice.date}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          ${invoice.amount}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              invoice.status === "Paid"
                                ? "bg-success-light text-success"
                                : invoice.status === "Pending"
                                ? "bg-warning/20 text-warning"
                                : "bg-error/20 text-error"
                            }`}
                          >
                            {invoice.status}
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
                    {invoices
                      .reduce((sum, inv) => sum + parseFloat(inv.amount), 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === "financials" && (
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Financial Analysis
          </h3>

          {/* Date Range Picker */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={financeStartDate}
                onChange={(e) => setFinanceStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={financeEndDate}
                onChange={(e) => setFinanceEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Fetch Button */}
          <button
            onClick={handleFetchFinancials}
            disabled={isLoadingFinancials}
            className="w-full px-6 py-4 rounded-2xl bg-linear-to-r from-sand to-sage text-white font-bold hover:shadow-xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isLoadingFinancials ? "Loading..." : "Fetch Financial Data"}
          </button>

          {/* Financial Data Display */}
          {financialData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="p-6 rounded-2xl bg-linear-to-br from-success-light/20 to-success/20 border border-success">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${financialData.revenue}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-linear-to-br from-sand/20 to-sage/20 border border-sand">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Total Costs
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${financialData.costs}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-linear-to-br from-sage/20 to-linen/20 border border-sage">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Net Profit
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${financialData.profit}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-linear-to-br from-linen/40 to-cream/40 border border-linen">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Profit Margin
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {financialData.profitMargin}%
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-linear-to-br from-sand/20 to-sage/20 border border-sand">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {financialData.orders}
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-linear-to-br from-sage/20 to-linen/20 border border-sage">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Avg Order Value
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${financialData.averageOrderValue}
                  </p>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="p-12 rounded-2xl border-2 border-dashed border-gray-300 text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-gray-500 font-medium">
                  Revenue Trend Chart Placeholder
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Chart visualization will be implemented here
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SalesManagerView;
