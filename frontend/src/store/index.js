import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import modalSlice from "./slices/modalSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    modal: modalSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});
