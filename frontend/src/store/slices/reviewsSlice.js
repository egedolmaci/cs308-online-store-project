import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reviewsAPI } from "../../api";

// Initial state
const initialState = {
  pendingReviews: [], // Array of pending reviews (for admin approval)
  loading: false, // Loading state for async operations
  error: null, // Error message if any
};

// Async thunks for review operations

// Fetch pending reviews (admin action)
export const getPendingReviews = createAsyncThunk(
  "reviews/getPendingReviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await reviewsAPI.getPendingReviews();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending reviews"
      );
    }
  }
);

// Approve a review (admin action)
export const approveReview = createAsyncThunk(
  "reviews/approveReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await reviewsAPI.approveReview(reviewId);
      return { reviewId, ...response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve review"
      );
    }
  }
);

export const disapproveReview = createAsyncThunk(
  "reviews/disapproveReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviewsAPI.disapproveReview(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to disapprove review"
      );
    }
  }
);
const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    // Clear error message
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get pending reviews
    builder
      .addCase(getPendingReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPendingReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingReviews = action.payload;
        state.error = null;
      })
      .addCase(getPendingReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Approve review
    builder
      .addCase(approveReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approveReview.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from pending reviews
        state.pendingReviews = state.pendingReviews.filter(
          (review) => review.id !== action.payload.reviewId
        );
        state.error = null;
      })
      .addCase(approveReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
     
    builder
      .addCase(disapproveReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(disapproveReview.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingReviews = state.pendingReviews.filter(
          (review) => review.id !== action.payload
        );
        state.error = null;
      })
      .addCase(disapproveReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearError } = reviewsSlice.actions;

// Export selectors
export const selectPendingReviews = (state) => state.reviews.pendingReviews;
export const selectReviewsLoading = (state) => state.reviews.loading;
export const selectReviewsError = (state) => state.reviews.error;

// Export reducer
export default reviewsSlice.reducer;
