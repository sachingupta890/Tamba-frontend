import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { UploadCloud, X, PackageCheck, Loader2, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../../services/api";

// Zod Schema
const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long."),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be a positive number."),
  category: z.enum(["copper", "steel", "customized", "plastic"]),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative."),
  customizable: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

const EditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [existingImages, setExistingImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await getProductById(productId);
        const product = response.data;
        reset(product); // Pre-fill the form
        setExistingImages(product.images);
      } catch (err) {
        setError("Failed to load product data.");
        toast.error("Could not find product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [productId, reset]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImageFiles(files);
    setNewImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const removeExistingImage = (index) =>
    setExistingImages(existingImages.filter((_, i) => i !== index));
  const removeNewImage = (index) => {
    setNewImageFiles(newImageFiles.filter((_, i) => i !== index));
    setNewImagePreviews(newImagePreviews.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Updating product...");
    const formData = new FormData();
    Object.keys(data).forEach((key) => formData.append(key, data[key]));
    existingImages.forEach((image) => formData.append("images", image));
    newImageFiles.forEach((file) => formData.append("newImages", file));

    try {
      await updateProduct(productId, formData);
      toast.success("Product updated successfully!", { id: toastId });
      navigate("/admin/products");
    } catch (error) {
      toast.error("Failed to update product.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const FormField = ({ name, label, type = "text", placeholder, children }) => (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      {children || (
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={`w-full px-3 py-2 border ${
            errors[name] ? "border-red-500" : "border-gray-300"
          } rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500`}
        />
      )}
      {errors[name] && (
        <p className="mt-1 text-xs text-red-600">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <header className="mb-8">
        <Link
          to="/admin/products"
          className="inline-flex items-center text-sm text-gray-600 hover:text-orange-600 mb-4"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-lg"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <FormField
              name="name"
              label="Product Name"
              placeholder="e.g., Engraved Copper Bottle"
            />
            <FormField name="description" label="Description">
              <textarea
                id="description"
                {...register("description")}
                rows={4}
                className={`w-full px-3 py-2 border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } rounded-md`}
                placeholder="Product details..."
              />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                name="price"
                label="Price (INR)"
                type="number"
                placeholder="e.g., 799"
              />
              <FormField
                name="stock"
                label="Stock Quantity"
                type="number"
                placeholder="e.g., 150"
              />
            </div>
            <FormField name="category" label="Category">
              <select
                id="category"
                {...register("category")}
                className={`w-full px-3 py-2 border ${
                  errors.category ? "border-red-500" : "border-gray-300"
                } rounded-md`}
              >
                <option value="steel">Steel</option>
                <option value="copper">Copper</option>
                <option value="plastic">Plastic</option>
                <option value="customized">Customized</option>
              </select>
            </FormField>
          </div>
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Existing Images
              </label>
              {existingImages.length > 0 ? (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {existingImages.map((src, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={src}
                        alt={`Existing ${index + 1}`}
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 mt-2">
                  No existing images.
                </p>
              )}
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Add New Images
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {newImagePreviews.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {newImagePreviews.map((src, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={src}
                      alt={`New ${index + 1}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                <span className="font-medium text-gray-800">Customizable?</span>
                <label
                  htmlFor="customizable"
                  className="relative inline-flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="customizable"
                    className="sr-only peer"
                    {...register("customizable")}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 peer-checked:bg-orange-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                <span className="font-medium text-gray-800">
                  Feature on Homepage?
                </span>
                <label
                  htmlFor="isFeatured"
                  className="relative inline-flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="isFeatured"
                    className="sr-only peer"
                    {...register("isFeatured")}
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 peer-checked:bg-orange-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-5 border-t">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <PackageCheck className="mr-2 h-5 w-5" />
              )}
              {isSubmitting ? "Saving..." : "Update Product"}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default EditProductPage;
