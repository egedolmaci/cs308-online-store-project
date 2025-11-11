import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../api";

// Async thunk for login
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await authAPI.login(credentials.email, credentials.password);
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

// Async thunk for register
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      return await authAPI.register(userData);
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      return await authAPI.logout();
    } catch (error) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

// Async thunk for refresh token
export const refreshToken = createAsyncThunk(
  "user/refresh",
  async (_, { rejectWithValue }) => {
    try {
      return await authAPI.refresh();
    } catch (error) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

// Async thunk for refresh token
export const me = createAsyncThunk(
  "user/me",
  async (_, { rejectWithValue }) => {
    try {
      return await authAPI.me();
    } catch (error) {
      return rejectWithValue(error.message || "Authentication failed");
    }
  }
);

const initialState = {
  id: null,
  email: null,
  role: null,
  firstName: null,
  lastName: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { id, email, role } = action.payload;
      state.id = id;
      state.email = email;
      state.role = role;
      state.isAuthenticated = true;
      state.error = null;
    },

    clearUser: (state) => {
      state.id = null;
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    updateUserEmail: (state, action) => {
      state.email = action.payload;
    },

    updateUserRole: (state, action) => {
      state.role = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.id = action.payload.user_id;
        state.firstName = action.payload.first_name;
        state.lastName = action.payload.last_name;
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log("Register fulfilled action:", action);
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.id = null;
        state.email = null;
        state.role = null;
        state.isAuthenticated = false;
        state.firstName = null;
        state.lastName = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(me.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(me.fulfilled, (state, action) => {
        state.isLoading = false;
        state.id = action.payload.user_id;
        state.firstName = action.payload.first_name;
        state.lastName = action.payload.last_name;
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(me.rejected, (state) => {
        state.isLoading = false;
        state.id = null;
        state.email = null;
        state.role = null;
        state.isAuthenticated = false;
        state.firstName = null;
        state.lastName = null;
        state.error = null;
      });
  },
});

export const {
  setUser,
  clearUser,
  updateUserEmail,
  updateUserRole,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
