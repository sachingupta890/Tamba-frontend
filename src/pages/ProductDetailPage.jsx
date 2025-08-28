import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  getPublicProductById,
  createLead,
  toggleWishlist,
} from "../services/api";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { updateWishlist } from "../store/authSlice";
import {
  Loader2,
  X,
  Heart,
  UploadCloud,
  MessageSquare,
  Send,
  ArrowLeft,
  Package,
  ShieldCheck,
  LogIn,
  CheckCircle,
  Eye,
} from "lucide-react";

// --- Image Gallery Component ---
const ImageGallery = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0]);
  return (
    <div>
      <div className="w-full h-[50vh] lg:h-[60vh] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-4">
        <motion.img
          key={mainImage}
          src={mainImage}
          alt="Main product"
          className="w-full h-full object-contain"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="flex space-x-2">
        {images.map((img, index) => (
          <div
            key={index}
            className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border-2 ${
              mainImage === img ? "border-orange-500" : "border-transparent"
            }`}
            onClick={() => setMainImage(img)}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Request (Lead) Modal ---
const RequestModal = ({ product, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [engravingText, setEngravingText] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [customImage, setCustomImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);

  const handleImageUpload = (e) => {
    if (e.target.files[0]) setCustomImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Submitting your request...");
    const formData = new FormData();
    formData.append("productId", product._id);
    formData.append("quantity", quantity);
    if (engravingText) formData.append("engravingText", engravingText);
    if (selectedColor) formData.append("color", selectedColor);
    if (customImage) formData.append("customImage", customImage);

    try {
      const response = await createLead(formData);
      setSubmission({
        message: response.data.message,
        leadId: response.data.lead.leadId,
      });
      toast.success("Request submitted!", { id: toastId });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit request.",
        { id: toastId }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmission(null);
    setQuantity(1);
    setEngravingText("");
    setSelectedColor(null);
    setCustomImage(null);
    onClose();
  };

  const colors = ["#EF4444", "#3B82F6", "#22C55E", "#EAB308", "#000000"];
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>
        <div className="p-8">
          {submission ? (
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800">
                Request Submitted!
              </h2>
              <p className="text-gray-600 mt-2">{submission.message}</p>
              <div className="mt-4 bg-gray-100 p-3 rounded-md">
                <p className="text-sm text-gray-500">Your Request ID is:</p>
                <p className="text-lg font-bold text-orange-600">
                  {submission.leadId}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full mt-6 py-3 rounded-md text-white bg-orange-600 hover:bg-orange-700 font-medium"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Submit Your Design
              </h2>
              <p className="text-gray-600 mb-6">
                Enter details for{" "}
                <span className="font-semibold">{product.name}</span>.
              </p>
              <form
                onSubmit={handleSubmit}
                className="space-y-4 max-h-[60vh] overflow-y-auto pr-2"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    min="1"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                {product.customizable && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Engraving Text (Optional)
                      </label>
                      <input
                        type="text"
                        value={engravingText}
                        onChange={(e) => setEngravingText(e.target.value)}
                        placeholder="e.g., 'Happy Birthday'"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <div className="flex space-x-2">
                        {colors.map((color) => (
                          <div
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                              selectedColor === color
                                ? "border-orange-500 ring-2 ring-orange-500"
                                : "border-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Upload Image (Optional)
                      </label>
                      <label
                        htmlFor="custom-image-upload"
                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-orange-500"
                      >
                        <div className="space-y-1 text-center">
                          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="text-xs text-gray-500">
                            {customImage ? customImage.name : "Click to upload"}
                          </p>
                        </div>
                        <input
                          id="custom-image-upload"
                          name="customImage"
                          type="file"
                          className="sr-only"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 inline-flex items-center justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-5 w-5" />
                  )}
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// --- Wishlist / Auth Modal ---
const AuthModal = ({ isOpen, onClose, product, isWishlistAction }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isSuccess, setIsSuccess] = useState(false);

  const isWishlisted = user?.wishlist?.includes(product?._id);

  const handleToggleWishlist = async () => {
    const actionText = isWishlisted ? "Removing from" : "Adding to";
    const toastId = toast.loading(`${actionText} wishlist...`);
    try {
      const response = await toggleWishlist(product._id);
      dispatch(updateWishlist(response.data.wishlist));
      toast.success(`Product ${isWishlisted ? "removed" : "added"}!`, {
        id: toastId,
      });
      if (!isWishlisted) setIsSuccess(true);
      else onClose();
    } catch (error) {
      toast.error("Failed to update wishlist.", { id: toastId });
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm relative p-8 text-center"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>
        {isWishlistAction ? (
          isSuccess ? (
            <>
              <Heart className="mx-auto h-16 w-16 text-red-500 fill-current mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">
                Added to Wishlist!
              </h3>
              <div className="mt-6 flex flex-col gap-4">
                <button
                  onClick={() => navigate("/wishlist")}
                  className="w-full py-2 px-6 rounded-md text-white bg-orange-600 hover:bg-orange-700 font-medium flex items-center justify-center"
                >
                  <Eye className="mr-2 h-5 w-5" /> View Wishlist
                </button>
                <button
                  onClick={handleClose}
                  className="w-full py-2 px-6 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          ) : (
            <>
              <Heart
                className={`mx-auto h-16 w-16 mb-4 ${
                  isWishlisted ? "text-gray-500" : "text-red-500"
                }`}
              />
              <h3 className="text-xl font-semibold text-gray-800">
                {isWishlisted ? "Remove from Wishlist?" : "Add to Wishlist?"}
              </h3>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={handleClose}
                  className="py-2 px-6 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`py-2 px-6 rounded-md text-white font-medium ${
                    isWishlisted
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-orange-600 hover:bg-orange-700"
                  }`}
                >
                  {isWishlisted ? "Remove" : "Add"}
                </button>
              </div>
            </>
          )
        ) : (
          <>
            <LogIn className="mx-auto h-16 w-16 text-orange-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              Please Log In
            </h3>
            <p className="mt-2 text-gray-600">
              You need an account for this action.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/login")}
                className="w-full py-2 px-6 rounded-md text-white bg-blue-600 hover:bg-blue-700 font-medium"
              >
                Go to Login
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWishlistAction, setIsWishlistAction] = useState(false);

  const isWishlisted = user?.wishlist?.includes(productId);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getPublicProductById(productId);
        setProduct(response.data);
      } catch (err) {
        setError("Could not find the product.");
        toast.error("Product not found!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleRequestClick = () => {
    if (isAuthenticated) {
      setIsRequestModalOpen(true);
    } else {
      setIsWishlistAction(false);
      setIsAuthModalOpen(true);
    }
  };

  const handleWishlistClick = () => {
    if (isAuthenticated) {
      setIsWishlistAction(true);
      setIsAuthModalOpen(true);
    } else {
      setIsWishlistAction(false);
      setIsAuthModalOpen(true);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-orange-600" />
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 py-20">{error}</div>;

  return (
    <div className="min-h-screen bg-white">
      <RequestModal
        product={product}
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />
      <AuthModal
        product={product}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        isAuthenticated={isAuthenticated}
        isWishlistAction={isWishlistAction}
      />

      <div className="container mx-auto px-4 py-16">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-orange-600 mb-8"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to All Products
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <ImageGallery images={product.images} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col space-y-6"
          >
            <div>
              <span className="text-orange-600 font-semibold uppercase tracking-wider">
                {product.category}
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 my-2">
                {product.name}
              </h1>
              <p className="text-4xl font-bold text-gray-800">
                ₹{product.price}
              </p>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed pb-6 border-b border-gray-200">
              {product.description}
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <Package className="w-6 h-6 text-green-600 mr-3" />
                <span className="font-medium text-gray-700">
                  {product.stock > 0
                    ? `${product.stock} units in stock`
                    : "Currently out of stock"}
                </span>
              </div>
              {product.customizable && (
                <div className="flex items-center">
                  <ShieldCheck className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="font-medium text-gray-700">
                    Customization Available
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4 pt-6">
              <button
                onClick={handleRequestClick}
                className="flex-1 inline-flex items-center justify-center py-4 px-8 border border-transparent shadow-lg text-lg font-semibold rounded-md text-white bg-orange-600 hover:bg-orange-700 transition-transform transform hover:scale-105"
              >
                <MessageSquare className="mr-3 h-6 w-6" />
                Submit Your Design
              </button>
              <button
                onClick={handleWishlistClick}
                className="p-4 bg-gray-100 rounded-md shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105"
              >
                <Heart
                  className={`h-6 w-6 transition-colors ${
                    isWishlisted ? "text-red-500 fill-current" : "text-gray-500"
                  }`}
                />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
