import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearModal } from "../../store/slices/modalSlice";
import { clearCart } from "../../store/slices/cartSlice";
import { X, CreditCard, Lock, CheckCircle2, AlertCircle, FileText, Download, ShoppingBag } from "lucide-react";
import { createOrder } from "../../store/slices/ordersSlice";
import { generateCheckoutInvoicePDF } from "../../utils/pdfGenerator";

const BankingModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { totalAmount } = useSelector((state) => state.cart);
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user);

  const shipping = totalAmount > 0 ? (totalAmount > 100 ? 0 : 9.99) : 0;
  const tax = totalAmount * 0.08;
  const finalTotal = totalAmount + shipping + tax;

  const [step, setStep] = useState("payment"); // payment, processing, success, invoice
  const [orderId, setOrderId] = useState(null);
  const [orderDate, setOrderDate] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({});

  const handleClose = () => {
    dispatch(clearModal());
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);
    }

    // Format expiry date
    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
    }

    // Limit CVV to 3 digits
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Card number validation (16 digits)
    const cardDigits = formData.cardNumber.replace(/\s/g, "");
    if (!cardDigits || cardDigits.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    // Card name validation
    if (!formData.cardName.trim()) {
      newErrors.cardName = "Cardholder name is required";
    }

    // Expiry date validation
    if (!formData.expiryDate || formData.expiryDate.length !== 5) {
      newErrors.expiryDate = "Expiry date must be MM/YY";
    } else {
      const [month, year] = formData.expiryDate.split("/");
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;

      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = "Invalid month";
      } else if (
        parseInt(year) < currentYear ||
        (parseInt(year) === currentYear && parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = "Card has expired";
      }
    }

    // CVV validation
    if (!formData.cvv || formData.cvv.length !== 3) {
      newErrors.cvv = "CVV must be 3 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Simulate processing
    setStep("processing");

    // Mock payment processing (2 seconds delay)
    setTimeout(async () => {
      // Generate order details
      const generatedOrderId = Math.random().toString(36).substr(2, 9).toUpperCase();
      const orderDateTime = new Date();

      setOrderId(generatedOrderId);
      setOrderDate(orderDateTime);

      setStep("success");

      // After showing success, transition to invoice
      setTimeout(() => {
        setStep("invoice");
        // Create order in backend
        dispatch(createOrder(cartItems));
      }, 2000);
    }, 2000);
  };

  const handleDownloadInvoice = () => {
    const invoiceData = {
      items: cartItems,
      orderId: orderId,
      orderDate: orderDate,
      customer: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: user.address,
      },
      totals: {
        subtotal: totalAmount,
        tax: tax,
        shipping: shipping,
        total: finalTotal,
      },
    };

    generateCheckoutInvoicePDF(invoiceData);
  };

  const handleContinueShopping = () => {
    dispatch(clearCart());
    dispatch(clearModal());
    navigate("/store");
  };

  // Payment Form Step
  if (step === "payment") {
    return (
      <div className="flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sage/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-sand to-sage rounded-xl">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Payment Details
              </h2>
              <p className="text-sm text-gray-600">
                Complete your secure payment
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-linen rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {/* Order Summary */}
          <div className="bg-gradient-to-br from-cream to-linen rounded-2xl p-5 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="h-px bg-sage/30 my-2"></div>
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.cardNumber ? "border-error" : "border-sage/30"
                  } focus:border-sand focus:outline-none transition-all duration-300 hover:shadow-md`}
              />
              {errors.cardNumber && (
                <p className="text-error text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.cardNumber}
                </p>
              )}
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.cardName ? "border-error" : "border-sage/30"
                  } focus:border-sand focus:outline-none transition-all duration-300 hover:shadow-md`}
              />
              {errors.cardName && (
                <p className="text-error text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.cardName}
                </p>
              )}
            </div>

            {/* Expiry Date and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className={`w-full px-4 py-3 rounded-xl border-2 ${errors.expiryDate ? "border-error" : "border-sage/30"
                    } focus:border-sand focus:outline-none transition-all duration-300 hover:shadow-md`}
                />
                {errors.expiryDate && (
                  <p className="text-error text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.expiryDate}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className={`w-full px-4 py-3 rounded-xl border-2 ${errors.cvv ? "border-error" : "border-sage/30"
                    } focus:border-sand focus:outline-none transition-all duration-300 hover:shadow-md`}
                />
                {errors.cvv && (
                  <p className="text-error text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.cvv}
                  </p>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-2 p-3 bg-success/10 rounded-xl">
              <Lock className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                Your payment information is encrypted and secure. We never store
                your card details.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-sage/20 bg-linen/30">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl border-2 border-sand text-sand font-medium hover:bg-sand hover:text-white transition-all duration-300 hover:shadow-lg active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-success to-success text-white font-medium hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Pay ${finalTotal.toFixed(2)}
          </button>
        </div>
      </div>
    );
  }

  // Processing Step
  if (step === "processing") {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="relative mb-6">
          <div className="w-20 h-20 border-4 border-sage/30 border-t-sand rounded-full animate-spin"></div>
          <CreditCard className="w-10 h-10 text-sand absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Processing Payment
        </h3>
        <p className="text-gray-600 text-center">
          Please wait while we securely process your payment...
        </p>
      </div>
    );
  }

  // Success Step (Brief celebration before invoice)
  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center p-12 animate-fade-in">
        <div className="relative mb-6">
          {/* Animated success circle */}
          <div className="absolute inset-0 w-20 h-20 bg-success/20 rounded-full animate-ping"></div>
          <div className="relative w-20 h-20 bg-success/10 rounded-full flex items-center justify-center animate-scale-in">
            <CheckCircle2 className="w-12 h-12 text-success animate-bounce-once" />
          </div>
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-2 animate-slide-up">
          Payment Successful!
        </h3>
        <p className="text-gray-600 text-center animate-slide-up animation-delay-100">
          Preparing your invoice...
        </p>
      </div>
    );
  }

  // Invoice Step
  if (step === "invoice") {
    return (
      <div className="flex flex-col max-h-[90vh] animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-sage/20 bg-linear-to-r from-sand/10 to-sage/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-linear-to-br from-success to-success/80 rounded-xl shadow-lg animate-scale-in">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Order Invoice
              </h2>
              <p className="text-sm text-gray-600">
                Order #{orderId}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-linen rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Invoice Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Success Badge */}
          <div className="flex items-center justify-center mb-6 animate-slide-down">
            <div className="flex items-center gap-2 px-4 py-2 bg-success/10 border-2 border-success/30 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <span className="font-semibold text-success">Payment Confirmed</span>
            </div>
          </div>

          {/* Order & Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Order Details */}
            <div className="bg-linear-to-br from-cream to-linen rounded-2xl p-5 animate-slide-right">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Order Details
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono font-semibold">#{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-semibold">
                    {orderDate?.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Time:</span>
                  <span className="font-semibold">
                    {orderDate?.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-linear-to-br from-linen to-sage/10 rounded-2xl p-5 animate-slide-left animation-delay-100">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Customer Details
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-semibold">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-semibold text-xs">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="font-semibold text-xs text-right max-w-[180px]">
                    {user.address || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-2xl border-2 border-sand/20 overflow-hidden mb-6 animate-slide-up animation-delay-200">
            <div className="bg-linear-to-r from-sand/20 to-sage/20 px-5 py-3 border-b border-sand/20">
              <h3 className="font-bold text-gray-800">Order Items</h3>
            </div>
            <div className="p-5">
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 hover:bg-linen/30 px-2 rounded-lg transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-linear-to-br from-sand/10 via-cream to-linen rounded-2xl p-6 animate-slide-up animation-delay-300">
            <h3 className="font-bold text-gray-800 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({cartItems.length} items)</span>
                <span className="font-semibold">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? (
                    <span className="text-success">FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (8%)</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="h-px bg-sand/30 my-3"></div>
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total Paid</span>
                <span className="text-success">${finalTotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <Lock className="w-4 h-4 text-success" />
                <span>Payment processed securely</span>
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="mt-6 text-center p-4 bg-linear-to-r from-success/5 to-success/10 rounded-2xl animate-fade-in animation-delay-400">
            <p className="text-gray-700 font-medium">
              Thank you for your purchase! 🎉
            </p>
            <p className="text-sm text-gray-600 mt-1">
              A confirmation email has been sent to {user.email}
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-sage/20 bg-linen/30 animate-slide-up animation-delay-500">
          <button
            onClick={handleDownloadInvoice}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-sand text-sand font-semibold hover:bg-sand hover:text-white transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Invoice
          </button>
          <button
            onClick={handleContinueShopping}
            className="flex-1 px-6 py-3 rounded-xl bg-linear-to-r from-success to-success/90 text-white font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Error Step
  if (step === "error") {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center animate-scale-in">
            <AlertCircle className="w-12 h-12 text-error" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Failed
        </h3>
        <p className="text-gray-600 text-center mb-6">
          We could not process your payment. Please check your card details and
          try again.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-xl border-2 border-sand text-sand font-medium hover:bg-sand hover:text-white transition-all duration-300 hover:shadow-lg active:scale-95"
          >
            Cancel
          </button>
          <button
            onClick={() => setStep("payment")}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sand to-sage text-white font-medium hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
};

export default BankingModal;
