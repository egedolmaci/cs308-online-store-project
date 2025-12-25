import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "./cartSlice";

const initialState = cartReducer(undefined, { type: "@@INIT" });

const sampleItem = {
  id: "1",
  name: "Sample Jacket",
  price: 120,
  final_price: 90,
  discount_active: true,
  stock: 2,
  image: "img",
  model: "M1",
  category: "Jackets",
};

describe("cartSlice reducer", () => {
  it("adds a discounted item and stores effective price", () => {
    const state = cartReducer(initialState, addToCart(sampleItem));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].price).toBe(90);
    expect(state.totalQuantity).toBe(1);
    expect(state.totalAmount).toBe(90);
  });

  it("stops increasing quantity when stock limit is reached", () => {
    let state = cartReducer(initialState, addToCart(sampleItem)); // quantity 1
    state = cartReducer(state, addToCart(sampleItem)); // quantity 2 (max)
    state = cartReducer(state, addToCart(sampleItem)); // should stay 2

    expect(state.items[0].quantity).toBe(2);
    expect(state.totalQuantity).toBe(2);
    expect(state.totalAmount).toBe(180);
  });

  it("updates quantity within stock and ignores invalid values", () => {
    let state = cartReducer(initialState, addToCart(sampleItem)); // quantity 1
    state = cartReducer(state, updateQuantity({ id: "1", quantity: 2 }));

    expect(state.items[0].quantity).toBe(2);
    expect(state.totalAmount).toBe(180);

    const unchanged = cartReducer(
      state,
      updateQuantity({ id: "1", quantity: 5 }),
    );

    expect(unchanged.items[0].quantity).toBe(2);
    expect(unchanged.totalAmount).toBe(180);
  });

  it("removes items and clears cart", () => {
    let state = cartReducer(initialState, addToCart(sampleItem));
    state = cartReducer(state, removeFromCart("1"));

    expect(state.items).toHaveLength(0);
    expect(state.totalAmount).toBe(0);

    const cleared = cartReducer(state, clearCart());

    expect(cleared.items).toHaveLength(0);
    expect(cleared.totalQuantity).toBe(0);
    expect(cleared.totalAmount).toBe(0);
  });
});
