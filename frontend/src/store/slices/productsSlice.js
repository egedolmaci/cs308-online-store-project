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

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.updateProduct(productId, productData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productsAPI.deleteProduct(productId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productsAPI.createProduct(productData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
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
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (item) => item.id !== action.payload.id
        );
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError, clearCurrentProduct } =
  productsSlice.actions;

export default productsSlice.reducer;
