import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../store/authSlice";
import {
  logoutUser,
  getNotifications,
  markNotificationsAsRead,
} from "../services/api";
import toast from "react-hot-toast";
import { Heart, Bell, ShoppingBag } from "lucide-react";
import io from "socket.io-client";

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Fetch initial notifications on login
  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifications = async () => {
        try {
          const res = await getNotifications();
          setNotifications(res.data);
        } catch (error) {
          console.error("Failed to fetch notifications");
        }
      };
      fetchNotifications();
    }
  }, [isAuthenticated]);

  // Setup Socket.IO for real-time notifications
  useEffect(() => {
    if (isAuthenticated && user?._id) {
      // Use your deployed backend URL
      const socket = io("https://tamba-backend.onrender.com");

      socket.on("connect", () => {
        socket.emit("join", user._id); // Join a room specific to this user
      });

      socket.on("notification", (newNotification) => {
        toast.success(newNotification.message, {
          icon: "🔔",
        });
        // Add the new notification at the top of the list
        setNotifications((prev) => [
          {
            ...newNotification,
            read: false,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated, user?._id]);

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

  const handleBellClick = async () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen && unreadCount > 0) {
      try {
        await markNotificationsAsRead();
        // To give instant feedback, we can optimistically update the UI
        const updatedNotifications = notifications.map((n) => ({
          ...n,
          read: true,
        }));
        setNotifications(updatedNotifications);
      } catch (error) {
        console.error("Failed to mark notifications as read");
      }
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
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Tamba<span className="text-orange-500">Bottles</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" className={navLinkClasses}>
            Home
          </NavLink>
          <NavLink to="/contact" className={navLinkClasses}>
            Contact Us
          </NavLink>
        </div>

        {/* Auth Links & Icons */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/wishlist"
                className="relative text-gray-600 hover:text-orange-500"
              >
                <Heart />
                {user?.wishlist?.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {user.wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                to="/my-requests"
                className="text-gray-600 hover:text-orange-500"
              >
                <ShoppingBag />
              </Link>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={handleBellClick}
                  className="text-gray-600 hover:text-orange-500"
                >
                  <Bell />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-4 font-semibold border-b">
                      Notifications
                    </div>
                    <ul className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <li
                            key={n._id}
                            className={`p-4 border-b hover:bg-gray-50 ${
                              !n.read ? "bg-orange-50" : ""
                            }`}
                          >
                            <p className="text-sm text-gray-700">{n.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(n.createdAt).toLocaleString()}
                            </p>
                          </li>
                        ))
                      ) : (
                        <p className="p-4 text-center text-gray-500">
                          No new notifications.
                        </p>
                      )}
                    </ul>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 font-medium text-gray-700 rounded-md hover:bg-gray-100"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-md shadow-lg hover:shadow-xl"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
};

export default Header;
