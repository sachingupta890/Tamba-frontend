// src/components/PublicRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // if already logged in → redirect based on role
  if (isAuthenticated) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/products" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // else render the child route (login/register)
  return <Outlet />;
};

export default PublicRoute;
