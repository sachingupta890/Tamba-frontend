import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getWishlist } from "../services/api";
import { Loader2, Heart, Info, HeartOff } from "lucide-react";
import toast from "react-hot-toast";

// We can reuse the ProductCard from HomePage, but let's create a specific one for wishlist
const WishlistProductCard = ({ product, index }) => (
  <motion.div
    className="bg-white rounded-lg shadow-md overflow-hidden group flex flex-col"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.05 }}
  >
    <div className="relative bg-gray-100">
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-64 object-contain"
      />
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <p className="text-sm text-gray-500 capitalize">{product.category}</p>
      <h3 className="text-lg font-semibold text-gray-800 truncate flex-grow">
        {product.name}
      </h3>
      <p className="text-xl font-bold text-orange-600 mt-2">₹{product.price}</p>
      <div className="mt-4">
        <Link
          to={`/product/${product._id}`}
          className="w-full inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-orange-600 transition-colors"
        >
          <Info className="mr-2 h-4 w-4" />
          View Details
        </Link>
      </div>
    </div>
  </motion.div>
);

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await getWishlist();
        setWishlistItems(response.data);
      } catch (err) {
        setError("Could not fetch your wishlist.");
        toast.error("Failed to load wishlist.");
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
            Your Wishlist
          </h1>
          <p className="text-gray-600">Products you've saved for later.</p>
        </motion.div>

        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <>
              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {wishlistItems.map((product, index) => (
                    <WishlistProductCard
                      key={product._id}
                      product={product}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-lg shadow-md">
                  <HeartOff className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-800">
                    Your wishlist is empty.
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Browse products and add your favorites!
                  </p>
                  <Link
                    to="/"
                    className="mt-6 inline-block py-2 px-6 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700"
                  >
                    Explore Products
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
