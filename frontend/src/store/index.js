import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import modalSlice from "./slices/modalSlice";
import userSlice from "./slices/userSlice";
import productsReducer from "./slices/productsSlice";
import ordersReducer from "./slices/ordersSlice";
import categoriesReducer from "./slices/categoriesSlice";
import reviewsReducer from "./slices/reviewsSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const cartPersistConfig = {
  key: "cart",
  storage,
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    modal: modalSlice,
    user: userSlice,
    products: productsReducer,
    orders: ordersReducer,
    categories: categoriesReducer,
    reviews: reviewsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
