import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productsAPI } from "../../api";

// Async thunks for API calls

// Fetch all products with optional filters
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsAPI.fetchProducts();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

const initialState = {
  items: [], // Array of products
  categories: [], // Available categories
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Set filters without fetching (for controlled inputs)
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Clear all filters
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear current product
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        console.log("Fetched products:", action.payload);
        state.categories = [
          ...new Set(action.payload.map((product) => product.category)),
        ];
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError, clearCurrentProduct } =
  productsSlice.actions;

export default productsSlice.reducer;
