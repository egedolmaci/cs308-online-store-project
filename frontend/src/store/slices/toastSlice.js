import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toasts: [],
};

let toastId = 0;

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action) => {
      const { type = "info", title, message, duration = 3000 } = action.payload;
      state.toasts.push({
        id: toastId++,
        type,
        title,
        message,
        duration,
      });
      // Limit to 3 toasts at a time
      if (state.toasts.length > 3) {
        state.toasts.shift();
      }
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearToasts } = toastSlice.actions;
export default toastSlice.reducer;
