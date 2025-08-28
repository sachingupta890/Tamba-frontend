import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-100 font-sans">
      {/* Sidebar Component */}
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      {/* lg:pl-64 desktop par sidebar ke liye jagah banata hai */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-20">
          <Link to="/" className="text-xl font-bold text-orange-600">
            Tamba<span className="text-gray-800">Bottles</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
