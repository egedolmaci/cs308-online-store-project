import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Array of cart items
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        // If item exists, increase quantity only if under stock limit
        if (existingItem.quantity < existingItem.stock) {
          existingItem.quantity++;
          existingItem.totalPrice = existingItem.quantity * existingItem.price;
          state.totalQuantity++;
          state.totalAmount += existingItem.price;
          state.totalAmount = Math.max(0, state.totalAmount);
        }
      } else {
        // Add new item to cart only if there is stock
        if (newItem.stock > 0) {
          state.items.push({
            id: newItem.id,
            name: newItem.name,
            price: newItem.price,
            quantity: 1,
            totalPrice: newItem.price,
            image: newItem.image,
            model: newItem.model,
            stock: newItem.stock,
            category: newItem.category,
          });
          state.totalQuantity++;
          state.totalAmount += newItem.price;
          state.totalAmount = Math.max(0, state.totalAmount);
        }
      }
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.totalAmount -= existingItem.totalPrice;
        state.items = state.items.filter((item) => item.id !== id);
        state.totalAmount = Math.max(0, state.totalAmount);
      }
    },

    increaseQuantity: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem && existingItem.quantity < existingItem.stock) {
        existingItem.quantity++;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
        state.totalQuantity++;
        state.totalAmount += existingItem.price;
        state.totalAmount = Math.max(0, state.totalAmount);
      }
    },

    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        if (existingItem.quantity === 1) {
          // Remove item if quantity becomes 0
          state.totalQuantity--;
          state.totalAmount -= existingItem.price;
          state.items = state.items.filter((item) => item.id !== id);
          state.totalAmount = Math.max(0, state.totalAmount);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice = existingItem.quantity * existingItem.price;
          state.totalQuantity--;
          state.totalAmount -= existingItem.price;
          state.totalAmount = Math.max(0, state.totalAmount);
        }
      }
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem && quantity > 0 && quantity <= existingItem.stock) {
        const quantityDiff = quantity - existingItem.quantity;
        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.price;
        state.totalQuantity += quantityDiff;
        state.totalAmount += quantityDiff * existingItem.price;
        state.totalAmount = Math.max(0, state.totalAmount);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
