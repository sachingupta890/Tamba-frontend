import React from "react";
import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  BarChart,
  X,
  FileText,
} from "lucide-react"; // FileText ko import karein

const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-3 text-gray-200 transition-colors duration-200 transform rounded-md hover:bg-gray-700 ${
      isActive ? "bg-gray-700" : ""
    }`;

  return (
    <>
      {/* Overlay for mobile view */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 px-4 py-8 overflow-y-auto bg-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white">
            Tamba<span className="text-orange-500">Bottles</span>
          </Link>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-8 space-y-2">
          <NavLink
            to="/admin/dashboard"
            className={navLinkClasses}
            onClick={() => setSidebarOpen(false)}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="mx-4 font-medium">Dashboard</span>
          </NavLink>
          <NavLink
            to="/admin/products"
            className={navLinkClasses}
            onClick={() => setSidebarOpen(false)}
          >
            <Package className="w-5 h-5" />
            <span className="mx-4 font-medium">Products</span>
          </NavLink>

          {/* --- YEH NAYA LINK ADD KIYA HAI --- */}
          <NavLink
            to="/admin/leads"
            className={navLinkClasses}
            onClick={() => setSidebarOpen(false)}
          >
            <FileText className="w-5 h-5" />
            <span className="mx-4 font-medium">Leads</span>
          </NavLink>

          <NavLink
            to="/admin/users"
            className={navLinkClasses}
            onClick={() => setSidebarOpen(false)}
          >
            <Users className="w-5 h-5" />
            <span className="mx-4 font-medium">Users</span>
          </NavLink>
          <NavLink
            to="/admin/analytics"
            className={navLinkClasses}
            onClick={() => setSidebarOpen(false)}
          >
            <BarChart className="w-5 h-5" />
            <span className="mx-4 font-medium">Analytics</span>
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
