import { setModal } from "../../store/slices/modalSlice";

// modalPromises.js
let modalPromise = null;

export const openModalWithPromise = (modalConfig) => (dispatch) => {
  dispatch(setModal(modalConfig));

  return new Promise((resolve, reject) => {
    modalPromise = { resolve, reject };
  });
};

export const confirmModal = () => {
  if (modalPromise) {
    modalPromise.resolve(true);
    modalPromise = null;
  }
};

export const cancelModal = () => {
  if (modalPromise) {
    modalPromise.reject(new Error("Modal cancelled"));
    modalPromise = null;
  }
};
