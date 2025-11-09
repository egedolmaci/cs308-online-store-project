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

export const ORDER_STATUSES = {
  PROCESSING: "processing",
  IN_TRANSIT: "in-transit",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REFUND_REQUESTED: "refund_requested",
  REFUNDED: "refunded",
}

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUSES.PROCESSING]: "Processing",
  [ORDER_STATUSES.IN_TRANSIT]: "In Transit",
  [ORDER_STATUSES.DELIVERED]: "Delivered",
  [ORDER_STATUSES.CANCELLED]: "Cancelled",
  [ORDER_STATUSES.REFUND_REQUESTED]: "Refund Requested",
  [ORDER_STATUSES.REFUNDED]: "Refunded",
};