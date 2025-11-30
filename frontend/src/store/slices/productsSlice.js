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

export const applyDiscount = createAsyncThunk(
  "products/applyDiscount",
  async ({ productIds, discountRate }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.applyDiscount(productIds, discountRate);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to apply discount"
      );
    }
  }
);

const initialState = {
  items: [], // Array of products
  categories: [], // Available categories
  loading: false,
  error: null,
  discountStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
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
      })
      .addCase(applyDiscount.pending, (state) => {
        state.discountStatus = "loading";
        state.error = null;
      })
      .addCase(applyDiscount.fulfilled, (state, action) => {
        state.discountStatus = "succeeded";
        // Update product prices in the items array
        if (action.payload && Array.isArray(action.payload)) {
          action.payload.forEach((updatedProduct) => {
            const index = state.items.findIndex(
              (item) => item.id === updatedProduct.id
            );
            if (index !== -1) {
              state.items[index] = updatedProduct;
            }
          });
        }
        state.error = null;
      })
      .addCase(applyDiscount.rejected, (state, action) => {
        state.discountStatus = "failed";
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError, clearCurrentProduct } =
  productsSlice.actions;

// Selectors
export const selectProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectProductCategories = (state) => state.products.categories;
export const selectDiscountStatus = (state) => state.products.discountStatus;

export default productsSlice.reducer;
