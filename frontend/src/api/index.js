import axios from "axios";
import { API_URL, API_ENDPOINTS } from "../constants";

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable sending cookies (for HttpOnly JWT cookies)
});

// Request interceptor - runs before every request
apiClient.interceptors.request.use(
  (config) => {
    // You can add authorization headers here if needed
    // For HttpOnly cookies, the browser automatically sends them
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

export const productsAPI = {
  // Fetch all products with optional filters
  fetchProducts: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PRODUCTS);
    return response.data;
  },
};

// Auth API methods
export const authAPI = {
  // Login with credentials
  login: async (email, password) => {
    const response = await apiClient.post(API_ENDPOINTS.LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  // Register new user
  register: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.REGISTER, userData);
    return response.data;
  },

  // Logout current user
  logout: async () => {
    const response = await apiClient.post(API_ENDPOINTS.LOGOUT);
    return response.data;
  },

  // Refresh authentication token
  refresh: async () => {
    const response = await apiClient.post(API_ENDPOINTS.REFRESH);
    return response.data;
  },

  me: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },
};

// Export the configured axios instance for custom requests
export default apiClient;
