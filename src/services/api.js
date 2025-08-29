// src/services/api.js
import axios from "axios";
import store from "../store/store";

// Create an instance of axios with a base URL
const api = axios.create({
  baseURL: "https://tamba-backend.onrender.com/api/",
  withCredentials: true, // Your backend URL
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.user?.token;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Function to register a user
export const registerUser = (userData) => {
  return api.post("/users/register", userData);
};


export const loginUser = (credentials) => {
  return api.post("/users/login", credentials);
};

export const addProduct = (productData) => {
  // For file uploads, we need to set the Content-Type header to multipart/form-data
  return api.post('/products', productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export const logoutUser = () => api.post("/users/logout");

export const getProducts = () => {
  return api.get("/products");
};


// --- NEW FUNCTION to get a single product ---
export const getProductById = (productId) => {
  return api.get(`/products/${productId}`);
};

// --- NEW FUNCTION to update a product ---
export const updateProduct = (productId, productData) => {
  return api.put(`/products/${productId}`, productData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteProduct = (productId) => {
  return api.delete(`/products/${productId}`);
};


export const getUsers = () => {
  return api.get("/users");
};
// You will add loginUser, getProducts, etc. here later

export const getDashboardStats = () => {
  return api.get("/dashboard/stats");
};

export const getRecentLeads = () => {
  return api.get("/leads/recent");
};

export const getPublicProducts = (filters) => {
  // Convert filters object to query string
  const queryParams = new URLSearchParams(filters).toString();
  return api.get(`/products/public?${queryParams}`);
};

export const getPublicProductById = (productId) => {
  return api.get(`/products/public/${productId}`);
};

export const toggleWishlist = (productId) => {
  return api.post("/wishlist/toggle", { productId });
};

export const getWishlist = () => {
  return api.get("/wishlist");
};



export const createLead = (formData) =>
  api.post("/leads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getMyRequests = () => api.get("/leads/my-requests");
export const getAllLeads = () => api.get("/leads/all");
export const updateLeadStatus = (leadId, status) =>
  api.put(`/leads/${leadId}/status`, { status });

export const submitQuery = (queryData) => {
  return api.post("/query", queryData);
};