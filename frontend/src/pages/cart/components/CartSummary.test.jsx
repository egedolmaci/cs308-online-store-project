import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userEvent from "@testing-library/user-event";
import cartReducer from "../../../store/slices/cartSlice";
import CartSummary from "./CartSummary";

const baseCartState = cartReducer(undefined, { type: "@@INIT" });

const renderWithCart = (cartStateOverrides, onCheckout = vi.fn()) => {
  const store = configureStore({
    reducer: { cart: cartReducer },
    preloadedState: {
      cart: { ...baseCartState, ...cartStateOverrides },
    },
  });

  return render(
    <Provider store={store}>
      <CartSummary onCheckout={onCheckout} />
    </Provider>,
  );
};

describe("CartSummary", () => {
  it("shows free shipping and correct totals when over $100", () => {
    renderWithCart({
      items: [
        { id: "1", name: "Dress", price: 120, quantity: 1, totalPrice: 120 },
      ],
      totalQuantity: 1,
      totalAmount: 120,
    });

    expect(screen.getByText(/Subtotal \(1 items\)/i)).toBeInTheDocument();
    expect(screen.getAllByText("FREE")).toHaveLength(2);
    expect(screen.getByText("$9.60")).toBeInTheDocument();
    expect(screen.getByText("$129.60")).toBeInTheDocument();
  });

  it("shows shipping cost and upsell message under $100", () => {
    renderWithCart({
      items: [
        { id: "1", name: "Shirt", price: 80, quantity: 1, totalPrice: 80 },
      ],
      totalQuantity: 1,
      totalAmount: 80,
    });

    expect(screen.getByText("$9.99")).toBeInTheDocument();
    const upsellMatches = screen.getAllByText((_, node) =>
      node?.textContent
        ?.replace(/\s+/g, " ")
        .includes("Add $20.00 more to get FREE shipping!"),
    );
    expect(upsellMatches.length).toBeGreaterThan(0);
    expect(screen.getByText("$96.39")).toBeInTheDocument();
  });

  it("disables checkout when empty and calls handler when enabled", async () => {
    const onCheckout = vi.fn();

    const { rerender } = renderWithCart(baseCartState, onCheckout);

    const button = screen.getByRole("button", { name: /proceed to checkout/i });
    expect(button).toBeDisabled();

    const store = configureStore({
      reducer: { cart: cartReducer },
      preloadedState: {
        cart: {
          ...baseCartState,
          items: [
            { id: "2", name: "Hat", price: 20, quantity: 1, totalPrice: 20 },
          ],
          totalQuantity: 1,
          totalAmount: 20,
        },
      },
    });

    rerender(
      <Provider store={store}>
        <CartSummary onCheckout={onCheckout} />
      </Provider>,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /proceed to checkout/i }),
    );

    expect(onCheckout).toHaveBeenCalledTimes(1);
  });
});
