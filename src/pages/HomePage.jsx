import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { getPublicProducts } from "../services/api";
import { Loader2, Heart, Info, SlidersHorizontal, X } from "lucide-react";
import toast from "react-hot-toast";

// --- Product Card Component ---
const ProductCard = ({ product, index }) => (
  <motion.div
    className="bg-white rounded-lg shadow-md overflow-hidden group flex flex-col"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.05 }}
  >
    <div className="relative bg-gray-100">
      {/* --- IMAGE FIX IS HERE --- */}
      <img
        src={product.images[0]}
        alt={product.name}
        className="w-full h-64 object-contain transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
        <Heart className="text-red-500" />
      </div>
      {product.stock === 0 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          OUT OF STOCK
        </div>
      )}
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
          More Info
        </Link>
      </div>
    </div>
  </motion.div>
);

// --- Filters Sidebar Component ---
const FiltersSidebar = ({ filters, setFilters, isOpen, setOpen }) => {
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "true" : "false") : value,
    }));
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-40 w-72 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto lg:shadow-none lg:w-1/4 lg:max-w-xs lg:mr-8 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <SlidersHorizontal className="text-orange-600 mr-2" />
              <h3 className="text-xl font-semibold">Filters</h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>
          </div>
          <div className="space-y-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Categories</option>
                <option value="copper">Copper</option>
                <option value="steel">Steel</option>
                <option value="customized">Customized</option>
                <option value="plastic">Plastic</option>
              </select>
            </div>
            {/* Price Filter (Placeholder) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <input
                type="range"
                className="mt-1 block w-full accent-orange-500"
                disabled
              />
            </div>
            {/* Stock Filter */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={filters.inStock === "true"}
                onChange={handleFilterChange}
                className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label
                htmlFor="inStock"
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                In Stock Only
              </label>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "all",
    inStock: "false",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getPublicProducts(filters);
        setProducts(response.data);
      } catch (err) {
        setError("Could not fetch products.");
        toast.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-100 text-center py-20 px-4">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Crafted Bottles, Unmatched Quality
        </motion.h1>
        <motion.p
          className="text-md md:text-lg text-gray-600 mt-4 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Discover our exclusive collection of copper, steel, and customizable
          bottles, designed for you.
        </motion.p>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8 flex">
        {/* Filters Sidebar */}
        <FiltersSidebar
          filters={filters}
          setFilters={setFilters}
          isOpen={isFilterOpen}
          setOpen={setIsFilterOpen}
        />

        {/* Products Grid */}
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="lg:hidden mb-4 w-full flex items-center justify-center p-2 bg-white rounded-md shadow"
          >
            <SlidersHorizontal className="text-orange-600 mr-2" /> Show Filters
          </button>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.length > 0 ? (
                products.map((product, index) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    index={index}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500 py-16">
                  No products match the current filters.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
