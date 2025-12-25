import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { wishlistAPI } from "../../api";
import { logoutUser } from "./userSlice";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      return await wishlistAPI.fetchWishlist();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to load wishlist"
      );
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      return await wishlistAPI.addToWishlist(productId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to add to wishlist"
      );
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue }) => {
    try {
      await wishlistAPI.removeFromWishlist(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to remove from wishlist"
      );
    }
  }
);

export const clearWishlist = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, { rejectWithValue }) => {
    try {
      await wishlistAPI.clearWishlist();
      return true;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to clear wishlist"
      );
    }
  }
);

const initialState = {
  items: [],
  status: "idle", // idle | loading | succeeded | failed
  mutationStatus: "idle", // idle | loading | succeeded | failed
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addToWishlist.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        const exists = state.items.some((item) => item.id === action.payload.id);
        if (!exists) {
          state.items.push(action.payload);
        }
        state.error = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;
      })
      .addCase(removeFromWishlist.pending, (state) => {
        state.mutationStatus = "loading";
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.error = null;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = [];
        state.status = "idle";
        state.mutationStatus = "idle";
        state.error = null;
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistStatus = (state) => state.wishlist.status;
export const selectWishlistMutationStatus = (state) =>
  state.wishlist.mutationStatus;
export const selectWishlistError = (state) => state.wishlist.error;

export default wishlistSlice.reducer;
