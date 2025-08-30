import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// --- CORE COMPONENTS ---
import Layout from "./components/Layout";
import AdminRoute from "./components/AdminRoute";
import PublicRoute from "./components/PublicRoute";
import AdminLayout from "./components/admin/AdminLayout"; // Admin Layout
import PrivateRoute from "./components/PrivateRoute";
import NotificationHandler from "./components/NotificationHandler";

// --- LAZY LOADING PAGES ---
// Public Pages
const HomePage = React.lazy(() => import("./pages/HomePage"));
const Register = React.lazy(() => import("./pages/Register"));
const Login = React.lazy(() => import("./pages/Login"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const ProductDetailPage = React.lazy(() => import("./pages/ProductDetailPage"))
const ContactPage = React.lazy(()=> import("./pages/ContactPage"))

// Admin Pages
const DashboardPage = React.lazy(() => import("./pages/admin/DashboardPage"));
const ProductsPage = React.lazy(() => import("./pages/admin/ProductsPage"));
const AddProductPage = React.lazy(() => import("./pages/admin/AddProductPage"));
const UsersPage = React.lazy(() => import("./pages/admin/UsersPage"));
const AnalyticsPage = React.lazy(() =>
  import("./pages/admin/AnalyticsPage")
);

const EditProductPage = React.lazy(() => import("./pages/admin/EditProductPage"))

const WishlistPage = React.lazy(() => import("./pages/WishlistPage"))

const MyRequestsPage = React.lazy(() => import("./pages/MyRequestsPage"));
const LeadsPage = React.lazy(()=> import("./pages/admin/LeadsPage"))

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen bg-gray-100">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
  </div>
);

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          success: {
            duration: 3000, // Toast will disappear after 3 seconds
          },
          error: {
            duration: 5000, // Error messages can stay a bit longer
          },
        }}
      />
      <NotificationHandler />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />
            <Route element={<PublicRoute />}>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/my-requests" element={<MyRequestsPage />} />
          </Route>

          {/* --- ADMIN ROUTES --- */}
          <Route element={<AdminRoute />}>
            {/* Step 2: Layout Layer for all admin pages */}
            <Route path="/admin" element={<AdminLayout />}>
              {/* Step 3: All admin pages will now render inside AdminLayout's <Outlet /> */}
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/add" element={<AddProductPage />} />
              <Route
                path="products/edit/:productId"
                element={<EditProductPage />}
              />
              <Route path="users" element={<UsersPage />} />
              <Route path="leads" element={<LeadsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
