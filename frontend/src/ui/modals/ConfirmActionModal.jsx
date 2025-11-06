import { useDispatch, useSelector } from "react-redux";
import { clearModal } from "../../store/slices/modalSlice";
import { TriangleAlert, X } from "lucide-react";
import { ICON_NAMES, ICONS, MODAL_ACTIONS } from "../../constants";
import { clearCart } from "../../store/slices/cartSlice";

const ConfirmActionModal = () => {
  const dispatch = useDispatch();
  const modalData = useSelector((state) => state.modal.modal);

  // Extract props from modal data
  const {
    iconName = null,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    actionType,
    confirmButtonStyle = "bg-gradient-to-r from-sand to-sage",
    cancelButtonStyle = "border-2 border-sand text-sand hover:bg-sand hover:text-white",
    iconColor = "text-sand",
    iconBgColor = "bg-gradient-to-br from-sand to-sage",
  } = modalData?.data || {};

  const IconComponent = ICON_NAMES[iconName] ? ICONS[iconName] : TriangleAlert;

  const handleClose = () => {
    dispatch(clearModal());
  };

  const handleConfirm = () => {
    switch (actionType) {
      case MODAL_ACTIONS.CLEAR_CART:
        dispatch(clearCart());
        break;
      // Add more action types as needed
      default:
        break;
    }

    dispatch(clearModal());
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
        <p className="text-gray-700 text-center leading-relaxed">{message}</p>
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

export default ConfirmActionModal;
