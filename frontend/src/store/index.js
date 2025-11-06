import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import modalSlice from "./slices/modalSlice";
import userSlice from "./slices/userSlice";
import productsReducer, { fetchProducts } from "./slices/productsSlice";
import { me } from "./slices/userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const cartPersistConfig = {
  key: "cart",
  storage,
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);

export const initializeAuth = () => {
  store.dispatch(me());
};

export const fetchProductsOnLoad = () => {
  store.dispatch(fetchProducts());
};

export const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    modal: modalSlice,
    user: userSlice,
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
