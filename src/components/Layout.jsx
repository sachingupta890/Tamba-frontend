// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
  return (
    <div>
      <Header />
      {/* The main content will be pushed down to avoid overlapping with the fixed header */}
      <main className="pt-20">
        {" "}
        {/* pt-20 is padding-top to offset header height */}
        <Outlet />{" "}
        {/* This will render the child route component (e.g., HomePage) */}
      </main>
    </div>
  );
};

export default Layout;
