import reducer, {
  applyDiscount,
  clearError,
  fetchProducts,
  updateProduct,
} from "./productsSlice";

const initialState = reducer(undefined, { type: "@@INIT" });

describe("productsSlice reducer", () => {
  it("marks loading on fetchProducts pending", () => {
    const state = reducer(initialState, { type: fetchProducts.pending.type });

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("stores items and categories on fetchProducts fulfilled", () => {
    const payload = [
      { id: 1, name: "Hat", category: "Hats" },
      { id: 2, name: "Cap", category: "Hats" },
      { id: 3, name: "Shoe", category: "Shoes" },
    ];

    const state = reducer(initialState, {
      type: fetchProducts.fulfilled.type,
      payload,
    });

    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(3);
    expect(state.categories).toEqual(["Hats", "Shoes"]);
    expect(state.error).toBeNull();
  });

  it("updates a product on updateProduct fulfilled", () => {
    const existingState = {
      ...initialState,
      loading: false,
      items: [
        { id: 1, name: "Hat", category: "Hats" },
        { id: 2, name: "Shoe", category: "Shoes" },
      ],
    };

    const state = reducer(existingState, {
      type: updateProduct.fulfilled.type,
      payload: { id: 2, name: "Boot", category: "Shoes" },
    });

    expect(state.items.find((p) => p.id === 2)?.name).toBe("Boot");
    expect(state.error).toBeNull();
  });

  it("applies discount updates and status", () => {
    const existingState = {
      ...initialState,
      items: [
        { id: 1, name: "Hat", category: "Hats", price: 20 },
        { id: 2, name: "Shoe", category: "Shoes", price: 50 },
      ],
      discountStatus: "idle",
    };

    const updatedProducts = [
      { id: 2, name: "Shoe", category: "Shoes", price: 40, discount: true },
    ];

    const state = reducer(existingState, {
      type: applyDiscount.fulfilled.type,
      payload: updatedProducts,
    });

    expect(state.discountStatus).toBe("succeeded");
    expect(state.items.find((p) => p.id === 2)?.price).toBe(40);
    expect(state.error).toBeNull();
  });

  it("clears error", () => {
    const errored = { ...initialState, error: "Boom" };
    const state = reducer(errored, clearError());
    expect(state.error).toBeNull();
  });
});
