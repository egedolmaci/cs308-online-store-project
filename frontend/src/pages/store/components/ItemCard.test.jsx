import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import cartReducer from "../../../store/slices/cartSlice";
import wishlistReducer from "../../../store/slices/wishlistSlice";
import ItemCard from "./ItemCard";

const renderWithStore = (ui, { preloadedState } = {}) => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      wishlist: wishlistReducer,
      user: () => ({ isAuthenticated: false }),
    },
    preloadedState,
  });

  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  };
};

const baseProduct = {
  id: "p1",
  name: "Test Jacket",
  description: "Desc",
  price: 100,
  final_price: 80,
  discount_active: true,
  discount_rate: 20,
  stock: 2,
  image: "img",
  model: "M1",
  category: "Jackets",
  rating: 4.5,
  warrantyStatus: "1 year",
};

describe("ItemCard", () => {
  it("dispatches addToCart when stock is available", async () => {
    const { store } = renderWithStore(
      <MemoryRouter>
        <ItemCard product={baseProduct} />
      </MemoryRouter>,
    );

    await userEvent.click(screen.getByRole("button", { name: /^add$/i }));

    const state = store.getState().cart;
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(baseProduct.id);
  });

  it("disables add when out of stock", async () => {
    const outOfStock = { ...baseProduct, id: "p2", stock: 0 };

    const { store } = renderWithStore(
      <MemoryRouter>
        <ItemCard product={outOfStock} />
      </MemoryRouter>,
    );

    const button = screen.getByRole("button", { name: /out of stock/i });
    expect(button).toBeDisabled();

    await userEvent.click(button);
    expect(store.getState().cart.items).toHaveLength(0);
  });
});
