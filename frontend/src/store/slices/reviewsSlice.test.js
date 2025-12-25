import reducer, {
  approveReview,
  getPendingReviews,
} from "./reviewsSlice";

const initialState = reducer(undefined, { type: "@@INIT" });

describe("reviewsSlice reducer", () => {
  it("loads pending reviews on getPendingReviews fulfilled", () => {
    const payload = [{ id: 1, text: "Great!" }];
    const state = reducer(
      { ...initialState, loading: true },
      { type: getPendingReviews.fulfilled.type, payload },
    );

    expect(state.loading).toBe(false);
    expect(state.pendingReviews).toEqual(payload);
    expect(state.error).toBeNull();
  });

  it("removes review on approveReview fulfilled", () => {
    const existingState = {
      ...initialState,
      loading: true,
      pendingReviews: [
        { id: 1, text: "Great!" },
        { id: 2, text: "Ok" },
      ],
    };

    const state = reducer(existingState, {
      type: approveReview.fulfilled.type,
      payload: { reviewId: 1 },
    });

    expect(state.loading).toBe(false);
    expect(state.pendingReviews.map((r) => r.id)).toEqual([2]);
    expect(state.error).toBeNull();
  });
});
