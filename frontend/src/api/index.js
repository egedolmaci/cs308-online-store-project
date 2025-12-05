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
  updateProduct: async (productId, productData) => {
    const response = await apiClient.put(
      `${API_ENDPOINTS.PRODUCTS}/${productId}`,
      productData
    );
    return response.data;
  },
  deleteProduct: async (productId) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.PRODUCTS}/${productId}`
    );
    return response.data;
  },
  createProduct: async (productData) => {
    const response = await apiClient.post(API_ENDPOINTS.PRODUCTS, productData);
    return response.data;
  },
  // Apply discount to multiple products
  applyDiscount: async (productIds, discountRate) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.PRODUCTS}/discount`,
      { product_ids: productIds, discount_rate: discountRate }
    );
    return response.data;
  },
  removeDiscount: async (productIds) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.PRODUCTS}/discount/clear`,
      { product_ids: productIds }
    );
    return response.data;
  },
};

export const ordersAPI = {
  // Fetch orders for the authenticated user
  fetchUserOrders: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ORDERS);
    return response.data;
  },
  fetchOrderById: async (orderId) => {
    const response = await apiClient.get(`${API_ENDPOINTS.ORDERS}/${orderId}`);
    return response.data;
  },
  createOrder: async (orderData) => {
    const response = await apiClient.post(API_ENDPOINTS.ORDERS, orderData);
    return response.data;
  },
  cancelOrder: async (orderId) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.ORDERS}/${orderId}/cancel`
    );
    return response.data;
  },
  deleteOrder: async (orderId) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.ORDERS}/${orderId}`
    );
    return response.data;
  },
  updateOrderStatus: async (orderId, status) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.ORDERS}/${orderId}/status`,
      { status: status }
    );
    return response.data;
  },
  requestRefund: async ({ orderId, reason }) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.ORDERS}/${orderId}/refund/request`,
      { reason }
    );
    return response.data;
  },
  approveRefund: async (orderId) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.ORDERS}/${orderId}/refund/approve`
    );
    return response.data;
  },
  fetchAllOrders: async () => {
    const response = await apiClient.get(`${API_ENDPOINTS.ORDERS}/all`);
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

export const categoriesAPI = {
  // Fetch all categories
  fetchCategories: async () => {
    const response = await apiClient.get(API_ENDPOINTS.CATEGORIES);
    return response.data;
  },
  createCategory: async (categoryData) => {
    const response = await apiClient.post(
      API_ENDPOINTS.CATEGORIES,
      categoryData
    );
    return response.data;
  },
  updateCategory: async (categoryId, categoryData) => {
    const response = await apiClient.put(
      `${API_ENDPOINTS.CATEGORIES}/${categoryId}`,
      categoryData
    );
    return response.data;
  },
  deleteCategory: async (categoryId) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.CATEGORIES}/${categoryId}`
    );
    return response.data;
  },
  fetchCategoryById: async (categoryId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.CATEGORIES}/${categoryId}`
    );
    return response.data;
  },
};

export const reviewsAPI = {
  fetchReviewsByProduct: async (productId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.PRODUCTS}/${productId}/reviews`
    );
    return response.data;
  },
  createReview: async (productId, reviewData) => {
    const response = await apiClient.post(
      `${API_ENDPOINTS.PRODUCTS}/${productId}/reviews`,
      reviewData
    );
    return response.data;
  },
  getPendingReviews: async () => {
    const response = await apiClient.get(`${API_ENDPOINTS.reviews}/pending`);
    return response.data;
  },
  approveReview: async (reviewId) => {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.reviews}/${reviewId}/approve`,
      {
        approved: true,
      }
    );
    return response.data;
  },
  fetchReviewById: async (reviewId) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.reviews}/${reviewId}`
    );
    return response.data;
  },
};

export const usersAPI = {
  updateUserInfo: async (userId, userData) => {
    const response = await apiClient.put(
      `${API_ENDPOINTS.USERS}/${userId}`,
      userData
    );
    return response.data;
  },
};

// Export the configured axios instance for custom requests
export default apiClient;
