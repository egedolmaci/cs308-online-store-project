import { MODAL_NAMES } from "../../constants";

export const generateConfirmActionModal = (
  iconName,
  title,
  message,
  confirmText,
  cancelText
) => {
  return {
    name: MODAL_NAMES.CONFIRM_ACTION_MODAL,
    data: {
      iconName: iconName,
      title: title,
      message: message,
      confirmText: confirmText,
      cancelText: cancelText,
    },
  };
};

export const generateConfirmActionWithReasonModal = (
  iconName,
  title,
  message,
  placeholder = "Enter your reason here...",
  inputLabel = "Reason",
  errorMessage = "Please provide a reason",
  confirmText = "Confirm",
  cancelText = "Cancel",
  minLength = 10
) => {
  return {
    name: MODAL_NAMES.CONFIRM_ACTION_WITH_REASON_MODAL,
    data: {
      iconName: iconName,
      title: title,
      message: message,
      placeholder: placeholder,
      inputLabel: inputLabel,
      errorMessage: errorMessage,
      confirmText: confirmText,
      cancelText: cancelText,
      minLength: minLength,
    },
  };
};
