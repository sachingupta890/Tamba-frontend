import { useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import toast from "react-hot-toast";

const NotificationHandler = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Backend URL se connect karein
      const socket = io("https://tamba-backend.onrender.com");

      // Connection ke baad, user ko register karein
      socket.on("connect", () => {
        socket.emit("register", user._id);
      });

      // 'notification' event listen karein
      socket.on("notification", (data) => {
        toast.success(data.message, {
          duration: 5000, // 5 seconds tak dikhaye
          icon: "🔔",
        });
      });

      // Component unmount hone par disconnect karein
      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  return null; // Yeh component UI mein kuch render nahi karega
};

export default NotificationHandler;
