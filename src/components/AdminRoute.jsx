// src/components/AdminRoute.jsx
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const AdminRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If logged in but not admin → show toast + redirect home
    if (isAuthenticated && user?.role !== "admin") {
      toast.error("You are not authorized to access this page.");
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // If not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in but not admin → render nothing while effect redirects
  if (user?.role !== "admin") {
    return null;
  }

  // If logged in as admin → render the child route
  return <Outlet />;
};

export default AdminRoute;
