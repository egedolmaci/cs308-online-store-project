import jsPDF from "jspdf";

/**
 * Theme colors matching the application design
 */
const PDF_COLORS = {
  primary: [182, 174, 159], // sand color
  textDark: [31, 41, 55],   // gray-900
  textLight: [156, 163, 175], // gray-400
  white: [255, 255, 255],
};

/**
 * Generate a single order invoice PDF
 * @param {Object} order - The order object containing all order details
 * @param {Object} options - Additional options for PDF generation
 * @param {string} options.customerName - Customer name override
 * @param {string} options.customerEmail - Customer email for display
 */
export const generateOrderInvoicePDF = (order, options = {}) => {
  const doc = new jsPDF();

  // Set up colors and fonts
  const { primary, textDark, textLight, white } = PDF_COLORS;

  // Header - Company Name
  doc.setFontSize(24);
  doc.setTextColor(...textDark);
  doc.text("Fashion Store", 20, 20);

  // Invoice Title
  doc.setFontSize(16);
  doc.text("INVOICE", 20, 35);

  // Order Information
  doc.setFontSize(10);
  doc.setTextColor(...textLight);
  doc.text("Order ID:", 20, 50);
  doc.text("Order Date:", 20, 58);
  doc.text("Status:", 20, 66);
  doc.text("Customer:", 20, 74);

  doc.setTextColor(...textDark);
  doc.setFontSize(11);
  doc.text(order.id?.toString() || "N/A", 50, 50);
  doc.text(
    order.created_at || order.date || new Date().toLocaleDateString(),
    50,
    58
  );
  doc.text(order.status || "pending", 50, 66);
  doc.text(
    options.customerName || order.customer_name || order.user_name || "N/A",
    50,
    74
  );

  // Customer Email (if provided)
  if (options.customerEmail) {
    doc.setFontSize(10);
    doc.setTextColor(...textLight);
    doc.text("Email:", 20, 82);
    doc.setTextColor(...textDark);
    doc.setFontSize(11);
    doc.text(options.customerEmail, 50, 82);
  }

  // Delivery Address
  const addressYStart = options.customerEmail ? 90 : 80;
  if (order.delivery_address) {
    doc.setFontSize(10);
    doc.setTextColor(...textLight);
    doc.text("Delivery Address:", 20, addressYStart);
    doc.setTextColor(...textDark);
    doc.setFontSize(11);
    const addressLines = doc.splitTextToSize(order.delivery_address, 80);
    doc.text(addressLines, 20, addressYStart + 8);
  }

  // Items Table Header
  const tableTop = order.delivery_address
    ? addressYStart + 30
    : addressYStart + 5;
  doc.setFillColor(...primary);
  doc.rect(20, tableTop, 170, 10, "F");

  doc.setFontSize(10);
  doc.setTextColor(...white);
  doc.text("Item", 25, tableTop + 7);
  doc.text("Qty", 120, tableTop + 7);
  doc.text("Price", 145, tableTop + 7);
  doc.text("Total", 170, tableTop + 7);

  // Items
  let yPos = tableTop + 18;
  doc.setTextColor(...textDark);

  const items = order.items || [];
  items.forEach((item, index) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    const itemName =
      item.product_name ||
      item.name ||
      item.product?.name ||
      `Product ID: ${item.product_id || item.id}`;
    const itemLines = doc.splitTextToSize(itemName, 85);

    const itemPrice = item.product_price || item.price || 0;
    const itemQuantity = item.quantity || 1;

    doc.setFontSize(10);
    doc.text(itemLines, 25, yPos);
    doc.text(itemQuantity.toString(), 120, yPos);
    doc.text(`$${itemPrice.toFixed(2)}`, 145, yPos);
    doc.text(`$${(itemPrice * itemQuantity).toFixed(2)}`, 170, yPos);

    yPos += itemLines.length * 5 + 8;

    // Add a separator line
    if (index < items.length - 1) {
      doc.setDrawColor(...textLight);
      doc.line(20, yPos - 4, 190, yPos - 4);
    }
  });

  // Totals
  yPos += 10;
  doc.setDrawColor(...textDark);
  doc.setLineWidth(0.5);
  doc.line(130, yPos, 190, yPos);

  yPos += 10;
  doc.setFontSize(11);
  doc.setFont(undefined, "normal");

  // Calculate subtotal
  const taxAmount = order.tax_amount || 0;
  const shippingAmount = order.shipping_amount || 0;
  const totalAmount = order.total_amount || 0;
  const subtotal = totalAmount - taxAmount - shippingAmount;

  doc.text("Subtotal:", 130, yPos);
  doc.text(`$${subtotal.toFixed(2)}`, 170, yPos);

  yPos += 8;
  doc.text("Tax:", 130, yPos);
  doc.text(`$${taxAmount.toFixed(2)}`, 170, yPos);

  yPos += 8;
  doc.text("Shipping:", 130, yPos);
  doc.text(`$${shippingAmount.toFixed(2)}`, 170, yPos);

  yPos += 10;
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Total Amount:", 130, yPos);
  doc.text(`$${totalAmount.toFixed(2)}`, 170, yPos);

  // Footer
  doc.setFontSize(8);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...textLight);
  doc.text("Thank you for your purchase!", 105, 280, { align: "center" });

  // Save the PDF
  doc.save(`invoice-${order.id || "order"}.pdf`);
};

/**
 * Generate an invoice report PDF for multiple orders within a date range
 * @param {Array} orders - Array of order objects
 * @param {string} startDate - Start date for the report
 * @param {string} endDate - End date for the report
 */
export const generateInvoiceReportPDF = (orders, startDate, endDate) => {
  const doc = new jsPDF();

  // Set up colors
  const { primary, textDark, white } = PDF_COLORS;

  // Title
  doc.setFontSize(20);
  doc.setTextColor(...textDark);
  doc.text("Invoice Report", 20, 20);

  // Date Range
  doc.setFontSize(12);
  doc.text(`Period: ${startDate} to ${endDate}`, 20, 30);

  // Table Header
  doc.setFillColor(...primary);
  doc.rect(20, 40, 170, 10, "F");
  doc.setFontSize(10);
  doc.setTextColor(...white);
  doc.text("Order ID", 25, 47);
  doc.text("Customer", 60, 47);
  doc.text("Date", 110, 47);
  doc.text("Amount", 140, 47);
  doc.text("Status", 170, 47);

  // Table Rows
  let yPos = 58;
  doc.setTextColor(...textDark);

  orders.forEach((order) => {
    if (yPos > 270) {
      doc.addPage();
      yPos = 20;
    }

    doc.text(order.id?.toString() || "N/A", 25, yPos);
    doc.text((order.customer_name || "N/A").substring(0, 20), 60, yPos);
    doc.text(
      new Date(order.created_at || order.date).toLocaleDateString(),
      110,
      yPos
    );
    doc.text(`$${(order.total_amount || 0).toFixed(2)}`, 140, yPos);
    doc.text(order.status || "pending", 170, yPos);

    yPos += 10;
  });

  // Total
  yPos += 10;
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  const total = orders.reduce(
    (sum, order) => sum + parseFloat(order.total_amount || 0),
    0
  );
  doc.text(`Total: $${total.toFixed(2)}`, 140, yPos);

  doc.save(`invoices-${startDate}-to-${endDate}.pdf`);
};

/**
 * Generate an invoice from cart items (for post-checkout)
 * @param {Object} invoiceData - Invoice data object
 * @param {Array} invoiceData.items - Array of cart items
 * @param {string} invoiceData.orderId - Generated order ID
 * @param {Date} invoiceData.orderDate - Order date
 * @param {Object} invoiceData.customer - Customer information
 * @param {Object} invoiceData.totals - Totals breakdown
 */
export const generateCheckoutInvoicePDF = (invoiceData) => {
  const {
    items,
    orderId,
    orderDate,
    customer,
    totals,
  } = invoiceData;

  const doc = new jsPDF();

  // Set up colors
  const { primary, textDark, textLight, white } = PDF_COLORS;

  // Header - Company Name
  doc.setFontSize(24);
  doc.setTextColor(...textDark);
  doc.text("Fashion Store", 20, 20);

  // Invoice Title
  doc.setFontSize(16);
  doc.text("INVOICE", 20, 35);

  // Order Information
  doc.setFontSize(10);
  doc.setTextColor(...textLight);
  doc.text("Order ID:", 20, 50);
  doc.text("Order Date:", 20, 58);
  doc.text("Order Time:", 20, 66);

  doc.setTextColor(...textDark);
  doc.setFontSize(11);
  doc.text(`#${orderId}`, 50, 50);
  doc.text(
    orderDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    50,
    58
  );
  doc.text(
    orderDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    50,
    66
  );

  // Customer Information
  doc.setFontSize(10);
  doc.setTextColor(...textLight);
  doc.text("Customer Name:", 20, 78);
  doc.text("Email:", 20, 86);

  doc.setTextColor(...textDark);
  doc.setFontSize(11);
  doc.text(`${customer.firstName} ${customer.lastName}`, 55, 78);
  doc.text(customer.email, 55, 86);

  // Delivery Address
  if (customer.address) {
    doc.setFontSize(10);
    doc.setTextColor(...textLight);
    doc.text("Delivery Address:", 20, 94);
    doc.setTextColor(...textDark);
    doc.setFontSize(11);
    const addressLines = doc.splitTextToSize(customer.address, 80);
    doc.text(addressLines, 20, 102);
  }

  // Items Table Header
  const tableTop = customer.address ? 120 : 100;
  doc.setFillColor(...primary);
  doc.rect(20, tableTop, 170, 10, "F");

  doc.setFontSize(10);
  doc.setTextColor(...white);
  doc.text("Item", 25, tableTop + 7);
  doc.text("Qty", 120, tableTop + 7);
  doc.text("Price", 145, tableTop + 7);
  doc.text("Total", 170, tableTop + 7);

  // Items
  let yPos = tableTop + 18;
  doc.setTextColor(...textDark);

  items.forEach((item, index) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    const itemLines = doc.splitTextToSize(item.name, 85);

    doc.setFontSize(10);
    doc.text(itemLines, 25, yPos);
    doc.text(item.quantity.toString(), 120, yPos);
    doc.text(`$${item.price.toFixed(2)}`, 145, yPos);
    doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 170, yPos);

    yPos += itemLines.length * 5 + 8;

    if (index < items.length - 1) {
      doc.setDrawColor(...textLight);
      doc.line(20, yPos - 4, 190, yPos - 4);
    }
  });

  // Totals
  yPos += 10;
  doc.setDrawColor(...textDark);
  doc.setLineWidth(0.5);
  doc.line(130, yPos, 190, yPos);

  yPos += 10;
  doc.setFontSize(11);
  doc.setFont(undefined, "normal");

  doc.text("Subtotal:", 130, yPos);
  doc.text(`$${totals.subtotal.toFixed(2)}`, 170, yPos);

  yPos += 8;
  doc.text("Tax (8%):", 130, yPos);
  doc.text(`$${totals.tax.toFixed(2)}`, 170, yPos);

  yPos += 8;
  doc.text("Shipping:", 130, yPos);
  doc.text(
    totals.shipping === 0 ? "FREE" : `$${totals.shipping.toFixed(2)}`,
    170,
    yPos
  );

  yPos += 10;
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text("Total Paid:", 130, yPos);
  doc.text(`$${totals.total.toFixed(2)}`, 170, yPos);

  // Payment Confirmation
  yPos += 10;
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(...textLight);
  doc.text("Payment Status: CONFIRMED", 130, yPos);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(...textLight);
  doc.text("Thank you for your purchase!", 105, 280, { align: "center" });
  doc.text(`Order confirmation sent to ${customer.email}`, 105, 286, {
    align: "center",
  });

  // Save the PDF
  doc.save(`invoice-${orderId}.pdf`);
};
