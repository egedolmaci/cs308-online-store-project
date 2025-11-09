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
