import reducer, {
  clearError,
  fetchCategories,
} from "./categoriesSlice";

const initialState = reducer(undefined, { type: "@@INIT" });

describe("categoriesSlice reducer", () => {
  it("sets loading true on fetchCategories pending", () => {
    const state = reducer(initialState, { type: fetchCategories.pending.type });

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("stores categories on fetchCategories fulfilled", () => {
    const payload = ["Shoes", "Hats"];
    const state = reducer(initialState, {
      type: fetchCategories.fulfilled.type,
      payload,
    });

    expect(state.loading).toBe(false);
    expect(state.categories).toEqual(payload);
    expect(state.error).toBeNull();
  });

  it("handles rejected fetch and clears error", () => {
    const errored = reducer(initialState, {
      type: fetchCategories.rejected.type,
      payload: "Failed",
    });
    expect(errored.error).toBe("Failed");

    const cleared = reducer(errored, clearError());
    expect(cleared.error).toBeNull();
  });
});
