    import { createSlice } from "@reduxjs/toolkit";

    // Load state from sessionStorage
    const storedUser = sessionStorage.getItem("user");
    const storedAuth = sessionStorage.getItem("isAuthenticated");

    const initialState = {
    isAuthenticated: storedAuth === "true" ? true : false,
    user: storedUser ? JSON.parse(storedUser) : null,
    };

    const authSlice = createSlice({
      name: "auth",
      initialState,
      reducers: {
        loginSuccess: (state, action) => {
          state.isAuthenticated = true;
          state.user = action.payload;
          // persist in session
          sessionStorage.setItem("isAuthenticated", "true");
          sessionStorage.setItem("user", JSON.stringify(action.payload));
        },
        logoutSuccess: (state) => {
          state.isAuthenticated = false;
          state.user = null;
          // clear session
          sessionStorage.removeItem("isAuthenticated");
          sessionStorage.removeItem("user");
        },

        updateWishlist: (state, action) => {
          if (state.user) {
            state.user.wishlist = action.payload; // Update the wishlist array
            // Also update sessionStorage so it persists on refresh
            sessionStorage.setItem("user", JSON.stringify(state.user));
          }
        },
      },
    });

    export const { loginSuccess, logoutSuccess,updateWishlist } = authSlice.actions;
    export default authSlice.reducer;
