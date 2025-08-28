import React, { useState } from "react";
import { FiLogIn } from "react-icons/fi";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

// Redux imports
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Get the dispatch function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Signing in...");

    try {
      const response = await loginUser(formData);

      // Dispatch the loginSuccess action with the user data from the API
      dispatch(loginSuccess(response.data.user));

      toast.dismiss(loadingToast);
      toast.success(response.data.message || "Login successful!");
      navigate("/"); // Redirect to homepage on success
    } catch (error) {
      toast.dismiss(loadingToast);
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <FiLogIn className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Sign In to Your Account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
