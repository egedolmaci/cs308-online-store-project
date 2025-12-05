import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ordersAPI } from "../../api";

// Initial state
const initialState = {
  orders: [], // Array of user orders
  currentOrder: null, // Currently selected order
  loading: false, // Loading state for async operations
  fetchOrderLoading: false, // Loading state for fetching single order
  error: null, // Error message if any
  createOrderStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  cancelOrderStatus: "idle",
  deleteOrderStatus: "idle",
  updateOrderStatus: "idle",
  refundRequestStatus: "idle",
  refundApproveStatus: "idle",
};

// Async thunks for order operations

// Fetch all orders for the authenticated user
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.fetchUserOrders();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// Fetch a single order by ID
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.fetchOrderById(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order"
      );
    }
  }
);

// Create a new order
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue, getState }) => {
    try {
      // Get user address from Redux state
      const { user } = getState();
      const deliveryAddress = user.address || "No address provided";

      const orderDataAPIFormatted = orderData.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));
      const orderDataFinal = {
        items: orderDataAPIFormatted,
        delivery_address: deliveryAddress,
      };
      const response = await ordersAPI.createOrder(orderDataFinal);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
);

// Cancel an order
export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.cancelOrder(orderId);
      return { orderId, ...response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel order"
      );
    }
  }
);

// Delete an order
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      await ordersAPI.deleteOrder(orderId);
      return orderId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete order"
      );
    }
  }
);

// Update order status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.updateOrderStatus(orderId, status);
      return { orderId, ...response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

// Request refund for an order
export const requestRefund = createAsyncThunk(
  "orders/requestRefund",
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.requestRefund({ orderId, reason });
      return { orderId, ...response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to request refund"
      );
    }
  }
);

// Approve refund for an order (admin action)
export const approveRefund = createAsyncThunk(
  "orders/approveRefund",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.approveRefund(orderId);
      return { orderId, ...response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve refund"
      );
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await ordersAPI.fetchAllOrders();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all orders"
      );
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Set current order for viewing details
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },

    // Clear current order
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },

    // Clear error message
    clearError: (state) => {
      state.error = null;
    },

    // Reset all statuses to idle
    resetStatuses: (state) => {
      state.createOrderStatus = "idle";
      state.cancelOrderStatus = "idle";
      state.deleteOrderStatus = "idle";
      state.updateOrderStatus = "idle";
      state.refundRequestStatus = "idle";
      state.refundApproveStatus = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user orders
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch order by ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.fetchOrderLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.fetchOrderLoading = false;
        state.currentOrder = action.payload;
        // Update in orders array if present
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.fetchOrderLoading = false;
        state.error = action.payload;
      });

    // Create order
    builder
      .addCase(createOrder.pending, (state) => {
        state.createOrderStatus = "loading";
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createOrderStatus = "succeeded";
        state.orders.unshift(action.payload); // Add new order to the beginning
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createOrderStatus = "failed";
        state.error = action.payload;
      });

    // Cancel order
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.cancelOrderStatus = "loading";
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.cancelOrderStatus = "succeeded";
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.orderId
        );
        if (index !== -1) {
          state.orders[index] = { ...state.orders[index], ...action.payload };
        }
        if (
          state.currentOrder &&
          state.currentOrder.id === action.payload.orderId
        ) {
          state.currentOrder = { ...state.currentOrder, ...action.payload };
        }
        state.error = null;
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.cancelOrderStatus = "failed";
        state.error = action.payload;
      });

    // Delete order
    builder
      .addCase(deleteOrder.pending, (state) => {
        state.deleteOrderStatus = "loading";
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.deleteOrderStatus = "succeeded";
        state.orders = state.orders.filter(
          (order) => order.id !== action.payload
        );
        if (state.currentOrder && state.currentOrder.id === action.payload) {
          state.currentOrder = null;
        }
        state.error = null;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.deleteOrderStatus = "failed";
        state.error = action.payload;
      });

    // Update order status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.updateOrderStatus = "loading";
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updateOrderStatus = "succeeded";
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.orderId
        );
        if (index !== -1) {
          state.orders[index] = { ...state.orders[index], ...action.payload };
        }
        if (
          state.currentOrder &&
          state.currentOrder.id === action.payload.orderId
        ) {
          state.currentOrder = { ...state.currentOrder, ...action.payload };
        }
        state.error = null;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updateOrderStatus = "failed";
        state.error = action.payload;
      });

    // Request refund
    builder
      .addCase(requestRefund.pending, (state) => {
        state.refundRequestStatus = "loading";
        state.error = null;
      })
      .addCase(requestRefund.fulfilled, (state, action) => {
        state.refundRequestStatus = "succeeded";
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.orderId
        );
        if (index !== -1) {
          state.orders[index] = { ...state.orders[index], ...action.payload };
        }
        if (
          state.currentOrder &&
          state.currentOrder.id === action.payload.orderId
        ) {
          state.currentOrder = { ...state.currentOrder, ...action.payload };
        }
        state.error = null;
      })
      .addCase(requestRefund.rejected, (state, action) => {
        state.refundRequestStatus = "failed";
        state.error = action.payload;
      });

    // Approve refund
    builder
      .addCase(approveRefund.pending, (state) => {
        state.refundApproveStatus = "loading";
        state.error = null;
      })
      .addCase(approveRefund.fulfilled, (state, action) => {
        state.refundApproveStatus = "succeeded";
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.orderId
        );
        if (index !== -1) {
          state.orders[index] = { ...state.orders[index], ...action.payload };
        }
        if (
          state.currentOrder &&
          state.currentOrder.id === action.payload.orderId
        ) {
          state.currentOrder = { ...state.currentOrder, ...action.payload };
        }
        state.error = null;
      })
      .addCase(approveRefund.rejected, (state, action) => {
        state.refundApproveStatus = "failed";
        state.error = action.payload;
      });
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { setCurrentOrder, clearCurrentOrder, clearError, resetStatuses } =
  ordersSlice.actions;

// Export selectors
export const selectOrders = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectFetchOrderLoading = (state) =>
  state.orders.fetchOrderLoading;
export const selectOrdersError = (state) => state.orders.error;
export const selectCreateOrderStatus = (state) =>
  state.orders.createOrderStatus;
export const selectCancelOrderStatus = (state) =>
  state.orders.cancelOrderStatus;
export const selectDeleteOrderStatus = (state) =>
  state.orders.deleteOrderStatus;
export const selectUpdateOrderStatus = (state) =>
  state.orders.updateOrderStatus;
export const selectRefundRequestStatus = (state) =>
  state.orders.refundRequestStatus;
export const selectRefundApproveStatus = (state) =>
  state.orders.refundApproveStatus;

// Export reducer
export default ordersSlice.reducer;
