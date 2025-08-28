import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import { getProducts, deleteProduct } from "../../services/api";
import toast from "react-hot-toast";

// --- Confirmation Modal Component ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
      >
        <div className="text-center">
          <ShieldAlert className="mx-auto h-16 w-16 text-red-500" />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            Are you sure?
          </h3>
          <p className="mt-2 text-gray-600">
            Do you really want to delete the product "
            <strong>{productName}</strong>"? This action cannot be undone.
          </p>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="py-2 px-6 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-6 rounded-md text-white bg-red-600 hover:bg-red-700 font-medium"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for delete confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (err) {
        setError("Failed to fetch products.");
        toast.error("Could not load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- DELETE LOGIC ---
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    const toastId = toast.loading(`Deleting "${productToDelete.name}"...`);
    try {
      await deleteProduct(productToDelete._id);
      // Update state to remove the product from the list
      setProducts(products.filter((p) => p._id !== productToDelete._id));
      toast.success("Product deleted successfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to delete product.", { id: toastId });
      console.error(err);
    } finally {
      // Close modal and reset state
      setIsModalOpen(false);
      setProductToDelete(null);
    }
  };

  const getStatus = (stock) => {
    if (stock > 0)
      return { text: "Active", className: "bg-green-100 text-green-800" };
    return { text: "Out of Stock", className: "bg-red-100 text-red-800" };
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        productName={productToDelete?.name}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
          <Link
            to="/admin/products/add"
            className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Add Product
          </Link>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stock
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.length > 0 ? (
                  products.map((product) => {
                    const status = getStatus(product.stock);
                    return (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={product.images[0]}
                                alt={product.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ₹{product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.className}`}
                          >
                            {status.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-4">
                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="text-orange-600 hover:text-orange-900"
                            >
                              <Edit size={18} />
                            </Link>
                            {/* --- UPDATED DELETE BUTTON --- */}
                            <button
                              onClick={() => handleDeleteClick(product)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">
                      No products found.{" "}
                      <Link
                        to="/admin/products/add"
                        className="text-orange-600 hover:underline"
                      >
                        Add one now!
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ProductsPage;
