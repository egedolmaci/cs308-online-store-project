import reducer, {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "./wishlistSlice";
import { logoutUser } from "./userSlice";

const initialState = reducer(undefined, { type: "@@INIT" });

describe("wishlistSlice reducer", () => {
  it("sets status loading on fetchWishlist pending", () => {
    const state = reducer(initialState, { type: fetchWishlist.pending.type });

    expect(state.status).toBe("loading");
    expect(state.error).toBeNull();
  });

  it("stores items on fetchWishlist fulfilled", () => {
    const payload = [{ id: 1 }, { id: 2 }];
    const state = reducer(initialState, {
      type: fetchWishlist.fulfilled.type,
      payload,
    });

    expect(state.status).toBe("succeeded");
    expect(state.items).toEqual(payload);
    expect(state.error).toBeNull();
  });

  it("adds item on addToWishlist fulfilled without duplicates", () => {
    const existing = {
      ...initialState,
      items: [{ id: 1 }],
      mutationStatus: "idle",
    };

    const added = reducer(existing, {
      type: addToWishlist.fulfilled.type,
      payload: { id: 2 },
    });
    expect(added.items).toEqual([{ id: 1 }, { id: 2 }]);
    expect(added.mutationStatus).toBe("succeeded");

    const duplicate = reducer(added, {
      type: addToWishlist.fulfilled.type,
      payload: { id: 2 },
    });
    expect(duplicate.items).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it("removes item on removeFromWishlist fulfilled", () => {
    const existing = {
      ...initialState,
      items: [{ id: 1 }, { id: 2 }],
      mutationStatus: "idle",
    };

    const state = reducer(existing, {
      type: removeFromWishlist.fulfilled.type,
      payload: 1,
    });

    expect(state.items).toEqual([{ id: 2 }]);
    expect(state.mutationStatus).toBe("succeeded");
    expect(state.error).toBeNull();
  });

  it("resets to initial state on logoutUser fulfilled", () => {
    const populated = {
      ...initialState,
      items: [{ id: 3 }],
      status: "succeeded",
      mutationStatus: "succeeded",
      error: "err",
    };

    const state = reducer(populated, { type: logoutUser.fulfilled.type });

    expect(state).toEqual(initialState);
  });
});
