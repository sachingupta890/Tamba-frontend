import React from "react";
import { motion } from "framer-motion";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { TbDropletHeart } from "react-icons/tb";
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../store/authSlice";
import { logoutUser } from "../services/api";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logoutSuccess());
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed!");
    }
  };

  const navLinkClasses =
    "text-gray-600 hover:text-orange-500 transition-colors";

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm shadow-md z-50"
    >
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <TbDropletHeart className="h-8 w-8 bg-gradient-to-r from-orange-500 to-amber-500 text-transparent bg-clip-text" />
          <span className="text-2xl font-bold text-gray-800">Tamba</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" className={navLinkClasses}>
            Home
          </NavLink>
          <NavLink to="/contact" className={navLinkClasses}>
            Contact Us
          </NavLink>
        </div>

        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 font-medium rounded-md hover:bg-gray-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-md shadow-lg hover:shadow-xl transition-shadow"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/my-requests"
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                My Requests
              </Link>
              <Link
                to="/wishlist"
                className="flex items-center text-gray-600 hover:text-orange-500 transition-colors"
              >
                <Heart className="w-5 h-5 mr-1" />({user?.wishlist?.length || 0}
                )
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
