import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // You can add other reducers here later (e.g., for products)
  },
});
