import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import CartItemCard from "./CartItemCard";

const createMockStore = (dispatchFn = vi.fn()) => ({
  getState: () => ({}),
  dispatch: dispatchFn,
  subscribe: () => () => {},
});

const item = {
  id: "c1",
  name: "Cart Jacket",
  model: "CJ1",
  price: 50,
  totalPrice: 50,
  quantity: 1,
  stock: 3,
  image: "img",
  category: "Jackets",
  discount_active: false,
};

describe("CartItemCard", () => {
  it("dispatches removeFromCart when remove button is clicked", async () => {
    const dispatch = vi.fn();
    const store = createMockStore(dispatch);

    render(
      <Provider store={store}>
        <CartItemCard item={item} />
      </Provider>,
    );

    await userEvent.click(screen.getByLabelText(/remove item/i));

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "cart/removeFromCart",
        payload: item.id,
      }),
    );
  });

  it("dispatches updateQuantity on valid input change", async () => {
    const dispatch = vi.fn();
    const store = createMockStore(dispatch);

    render(
      <Provider store={store}>
        <CartItemCard item={item} />
      </Provider>,
    );

    const input = screen.getByRole("spinbutton");
    await userEvent.clear(input);
    fireEvent.change(input, { target: { value: "2" } });

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "cart/updateQuantity",
        payload: { id: item.id, quantity: 2 },
      }),
    );
  });
});
