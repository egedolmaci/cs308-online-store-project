import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearModal } from "../../store/slices/modalSlice";
import { TriangleAlert, X, AlertCircle } from "lucide-react";
import { ICON_NAMES, ICONS } from "../../constants";
import { cancelModal, confirmModalWithData } from "./modalPromises";

const ConfirmActionWithReasonModal = () => {
  const dispatch = useDispatch();
  const modalData = useSelector((state) => state.modal.modal);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  // Extract props from modal data
  const {
    iconName = null,
    title = "Confirm Action",
    message = "Please provide a reason:",
    confirmText = "Confirm",
    cancelText = "Cancel",
    placeholder = "Enter your reason here...",
    inputLabel = "Reason",
    errorMessage = "Please provide a reason",
    confirmButtonStyle = "bg-gradient-to-r from-sand to-sage",
    cancelButtonStyle = "border-2 border-sand text-sand hover:bg-sand hover:text-white",
    iconColor = "text-sand",
    iconBgColor = "bg-gradient-to-br from-sand to-sage",
    minLength = 10,
  } = modalData?.data || {};

  const IconComponent = ICON_NAMES[iconName] ? ICONS[iconName] : TriangleAlert;

  const handleClose = () => {
    cancelModal();
    dispatch(clearModal());
  };

  const handleConfirm = () => {
    // Validate input
    if (!inputValue.trim()) {
      setError(errorMessage);
      return;
    }

    if (inputValue.trim().length < minLength) {
      setError(`${inputLabel} must be at least ${minLength} characters`);
      return;
    }

    // Call confirmModalWithData with the input value
    confirmModalWithData(inputValue.trim());
    dispatch(clearModal());
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-sage/20">
        <div className="flex items-center gap-3">
          {iconName && (
            <div className={`p-2 ${iconBgColor} rounded-xl`}>
              <IconComponent className={`w-6 h-6 ${iconColor === "text-sand" ? "text-white" : iconColor}`} />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
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
      <div className="p-8">
        <p className="text-gray-700 mb-4 leading-relaxed">{message}</p>

        {/* Input Field */}
        <div>
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border-2 ${
              error ? "border-error" : "border-sage/30"
            } focus:border-sand focus:outline-none transition-all duration-300 hover:shadow-md resize-none`}
          />
          {error && (
            <p className="text-error text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            {inputValue.length}/{minLength} characters minimum
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 p-6 border-t border-sage/20 bg-linen/30">
        <button
          onClick={handleClose}
          className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 hover:shadow-lg active:scale-95 ${cancelButtonStyle}`}
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={`px-6 py-2.5 rounded-xl text-white font-medium hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${confirmButtonStyle}`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default ConfirmActionWithReasonModal;
