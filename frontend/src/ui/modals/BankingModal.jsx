import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearModal } from "../../store/slices/modalSlice";
import { clearCart } from "../../store/slices/cartSlice";
import { X, CreditCard, Lock, CheckCircle2, AlertCircle } from "lucide-react";

const BankingModal = () => {
  const dispatch = useDispatch();
  const { totalAmount } = useSelector((state) => state.cart);

  const shipping = totalAmount > 0 ? (totalAmount > 100 ? 0 : 9.99) : 0;
  const tax = totalAmount * 0.08;
  const finalTotal = totalAmount + shipping + tax;

  const [step, setStep] = useState("payment"); // payment, processing, success, error
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
    setTimeout(() => {
      // Randomly succeed or fail for demo purposes (90% success rate)
      const success = Math.random() > 0.1;

      if (success) {
        setStep("success");
        // Clear cart after successful payment
        setTimeout(() => {
          dispatch(clearCart());
          handleClose();
        }, 3000);
      } else {
        setStep("error");
      }
    }, 2000);
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
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.cardNumber ? "border-error" : "border-sage/30"
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
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.cardName ? "border-error" : "border-sage/30"
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
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.expiryDate ? "border-error" : "border-sage/30"
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
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    errors.cvv ? "border-error" : "border-sage/30"
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

  // Success Step
  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center animate-scale-in">
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h3>
        <p className="text-gray-600 text-center mb-4">
          Your order has been placed successfully.
        </p>
        <div className="bg-gradient-to-br from-cream to-linen rounded-2xl p-4 w-full max-w-sm">
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span className="font-mono font-semibold">
                #{Math.random().toString(36).substr(2, 9).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Amount Paid:</span>
              <span className="font-semibold">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-6 text-center">
          Redirecting to store in a moment...
        </p>
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
