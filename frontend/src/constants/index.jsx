import { TrashIcon } from "lucide-react";
import BankingModal from "../ui/modals/BankingModal";
import ConfirmActionModal from "../ui/modals/ConfirmActionModal";

export const API_VERSION = "v1";
export const API_URL = "http://localhost:8000/api/" + API_VERSION;
export const API_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  PRODUCTS: "/products",
  ORDERS: "/orders",
  // Add other endpoints here
};

export const MODAL_NAMES = {
  BANKING_MODAL: "BANKING_MODAL",
  CONFIRM_ACTION_MODAL: "CONFIRM_ACTION_MODAL",
  // Add other modal names here
};

export const MODAL_ACTIONS = {
  CLEAR_CART: "CLEAR_CART",
  // Add other modal actions here
};

export const MODALS = {
  [MODAL_NAMES.BANKING_MODAL]: <BankingModal />,
  [MODAL_NAMES.CONFIRM_ACTION_MODAL]: <ConfirmActionModal />,
  // Map other modal components here
};

export const ICON_NAMES = {
  TRASH_ICON: "TRASH_ICON",
  // Add other icons here
};

export const ICONS = {
  [ICON_NAMES.TRASH_ICON]: TrashIcon,
  // Map other icon components here
};
