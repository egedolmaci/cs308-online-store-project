import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, selectOrders, selectOrdersLoading } from "../../../store/slices/ordersSlice";
import { ORDER_STATUS_LABELS } from "../../../constants";
import jsPDF from "jspdf";

const InvoicesManagement = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersLoading);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  // Filter orders by date range and search
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesDateRange =
      (!start || orderDate >= start) && (!end || orderDate <= end);

    const matchesSearch =
      searchTerm === "" ||
      order.id.toString().includes(searchTerm) ||
      order.user_name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDateRange && matchesSearch;
  });

  const generateSingleInvoice = (order) => {
    const doc = new jsPDF();

    // Colors
    const primaryColor = [182, 174, 159];
    const textColor = [31, 41, 55];
    const lightGray = [156, 163, 175];

    // Header
    doc.setFontSize(24);
    doc.setTextColor(...textColor);
    doc.text("Fashion Store", 20, 20);

    doc.setFontSize(16);
    doc.text("INVOICE", 20, 35);

    // Order Info
    doc.setFontSize(10);
    doc.setTextColor(...lightGray);
    doc.text("Order ID:", 20, 50);
    doc.text("Order Date:", 20, 58);
    doc.text("Status:", 20, 66);
    doc.text("Customer:", 20, 74);

    doc.setTextColor(...textColor);
    doc.setFontSize(11);
    doc.text(order.id.toString(), 50, 50);
    doc.text(order.created_at || "N/A", 50, 58);
    doc.text(ORDER_STATUS_LABELS[order.status] || order.status, 50, 66);
    doc.text(order.customer_name || order.user_name || "N/A", 50, 74);

    // Delivery Address
    if (order.delivery_address) {
      doc.setFontSize(10);
      doc.setTextColor(...lightGray);
      doc.text("Delivery Address:", 20, 88);
      doc.setTextColor(...textColor);
      doc.setFontSize(11);
      const addressLines = doc.splitTextToSize(order.delivery_address, 80);
      doc.text(addressLines, 20, 96);
    }

    // Items Table
    const tableTop = order.delivery_address ? 115 : 90;
    doc.setFillColor(...primaryColor);
    doc.rect(20, tableTop, 170, 10, "F");

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("Item", 25, tableTop + 7);
    doc.text("Qty", 120, tableTop + 7);
    doc.text("Price", 145, tableTop + 7);
    doc.text("Total", 170, tableTop + 7);

    let yPos = tableTop + 18;
    doc.setTextColor(...textColor);

    order.items.forEach((item, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      const itemName = item.product_name || item.product?.name || `Product #${item.product_id}`;
      const itemLines = doc.splitTextToSize(itemName, 85);

      doc.setFontSize(10);
      doc.text(itemLines, 25, yPos);
      doc.text(item.quantity.toString(), 120, yPos);
      doc.text(`$${item.product_price.toFixed(2)}`, 145, yPos);
      doc.text(`$${(item.product_price * item.quantity).toFixed(2)}`, 170, yPos);

      yPos += itemLines.length * 5 + 8;

      if (index < order.items.length - 1) {
        doc.setDrawColor(...lightGray);
        doc.line(20, yPos - 4, 190, yPos - 4);
      }
    });

    // Totals
    yPos += 10;
    doc.setDrawColor(...textColor);
    doc.setLineWidth(0.5);
    doc.line(130, yPos, 190, yPos);

    yPos += 10;
    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.text("Subtotal:", 130, yPos);
    doc.text(`$${(order.total_amount - order.tax_amount - order.shipping_amount).toFixed(2)}`, 170, yPos);

    yPos += 8;
    doc.text("Tax:", 130, yPos);
    doc.text(`$${order.tax_amount.toFixed(2)}`, 170, yPos);

    yPos += 8;
    doc.text("Shipping:", 130, yPos);
    doc.text(`$${order.shipping_amount.toFixed(2)}`, 170, yPos);

    yPos += 10;
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text("Total Amount:", 130, yPos);
    doc.text(`$${order.total_amount.toFixed(2)}`, 170, yPos);

    // Footer
    doc.setFontSize(8);
    doc.setFont(undefined, "normal");
    doc.setTextColor(...lightGray);
    doc.text("Thank you for your purchase!", 105, 280, { align: "center" });

    doc.save(`invoice-${order.id}.pdf`);
  };

  const generateBatchInvoices = () => {
    if (filteredOrders.length === 0) {
      alert("No invoices to generate for the selected date range");
      return;
    }

    filteredOrders.forEach((order) => {
      generateSingleInvoice(order);
    });

    alert(`Generated ${filteredOrders.length} invoice(s)`);
  };

  const printInvoice = (order) => {
    // Open invoice in new window for printing
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #B6AE9F; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #B6AE9F; color: white; }
            .total { text-align: right; font-weight: bold; font-size: 18px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Fashion Store</h1>
          <h2>INVOICE</h2>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Date:</strong> ${order.created_at}</p>
          <p><strong>Status:</strong> ${ORDER_STATUS_LABELS[order.status]}</p>
          <p><strong>Customer:</strong> ${order.customer_name || order.user_name || "N/A"}</p>
          ${order.delivery_address ? `<p><strong>Address:</strong> ${order.delivery_address}</p>` : ""}

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.product_name || item.product?.name || `Product #${item.product_id}`}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.product_price.toFixed(2)}</td>
                  <td>$${(item.product_price * item.quantity).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="total">
            <div><strong>Subtotal:</strong> $${(order.total_amount - order.tax_amount - order.shipping_amount).toFixed(2)}</div>
            <div><strong>Tax:</strong> $${order.tax_amount.toFixed(2)}</div>
            <div><strong>Shipping:</strong> $${order.shipping_amount.toFixed(2)}</div>
            <div style="margin-top:6px;"><strong>Total:</strong> $${order.total_amount.toFixed(2)}</div>
          </div>

          <script>window.print(); window.onafterprint = function(){ window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Invoices Management
        </h2>
        <p className="text-gray-600">View, print, and save invoices as PDF</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-sand/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Orders
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Order ID or customer name..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-sand focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            {filteredOrders.length} invoice(s) found
          </p>
          <button
            onClick={generateBatchInvoices}
            disabled={filteredOrders.length === 0}
            className="px-6 py-2 rounded-xl bg-linear-to-r from-sand to-sage text-white font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download All PDFs
          </button>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-sand/20">
        {isLoading ? (
          <p className="text-center text-gray-500 py-8">Loading invoices...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No invoices found for the selected criteria
          </p>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-2xl border-2 border-gray-200 hover:border-sand/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-gray-900 text-lg">
                        Invoice #{order.id}
                      </h4>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sand/20 text-sand">
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      {order.user_name && (
                        <p>
                          <span className="font-semibold">Customer:</span>{" "}
                          {order.user_name}
                        </p>
                      )}
                      <p>
                        <span className="font-semibold">Date:</span>{" "}
                        {order.created_at}
                      </p>
                      <p>
                        <span className="font-semibold">Items:</span>{" "}
                        {order.items.length}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-2xl font-bold text-gray-900">
                        ${order.total_amount.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => printInvoice(order)}
                        className="p-3 rounded-xl border-2 border-sand text-sand hover:bg-sand hover:text-white transition-all duration-300"
                        title="Print Invoice"
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
                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => generateSingleInvoice(order)}
                        className="px-4 py-3 rounded-xl bg-linear-to-r from-sand to-sage text-white font-semibold hover:shadow-lg transition-all duration-300"
                      >
                        <svg
                          className="w-5 h-5 inline mr-2"
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
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicesManagement;
