import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Toaster, toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { UploadCloud, X, PackagePlus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
// Import the centralized API function
import { addProduct } from "../../services/api.js"

// Zod Schema for validation (no changes here)
const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long."),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be a positive number."),
  category: z.enum(["copper", "steel", "customized"], {
    errorMap: () => ({ message: "Please select a valid category." }),
  }),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative."),
  customizable: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  images: z
    .any()
    .refine((files) => files?.length >= 1, "At least one image is required.")
    .refine(
      (files) => files?.length <= 5,
      "You can upload a maximum of 5 images."
    )
    .refine(
      (files) =>
        Array.from(files).every((file) => file.size <= 5 * 1024 * 1024),
      `Max file size is 5MB.`
    ),
});

const AddProduct = () => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      customizable: false,
      isFeatured: false,
      category: "steel",
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setValue("images", files, { shouldValidate: true });
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };

  const removeImage = (index) => {
    const currentFiles = Array.from(watch("images") || []);
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    setValue("images", updatedFiles, { shouldValidate: true });
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
  };

  // The onSubmit function is now cleaner
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Adding product...");

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key !== "images") {
        formData.append(key, data[key]);
      }
    });

    for (let i = 0; i < data.images.length; i++) {
      formData.append("images", data.images[i]);
    }

    try {
      // *** THE ONLY MAJOR CHANGE IS HERE ***
      // Call the imported addProduct function from api.js
      const response = await addProduct(formData);

      toast.success("Product added successfully!", { id: toastId });
      reset();
      setImagePreviews([]);

      navigate("/admin/products")
      
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add product. Please try again.";
      toast.error(errorMessage, { id: toastId });
      console.error("Product creation error:", error);
  
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper component for form fields (no changes)
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

  // The rest of the JSX remains exactly the same
  return (
    <>
      <Toaster position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8"
      >
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <PackagePlus className="w-8 h-8 mr-3 text-orange-600" />
              Add New Product
            </h1>
            <p className="text-gray-500 mt-1">
              Fill in the details below to add a new product to your catalog.
            </p>
          </header>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-8 rounded-lg shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column: Core Product Details */}
              <div className="md:col-span-2">
                <FormField
                  name="name"
                  label="Product Name"
                  placeholder="e.g., Engraved Copper Bottle (1L)"
                />

                <FormField name="description" label="Description">
                  <textarea
                    id="description"
                    {...register("description")}
                    rows={4}
                    className={`w-full px-3 py-2 border ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500`}
                    placeholder="Provide details about the material, capacity, features, etc."
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
                    } rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500`}
                  >
                    <option value="steel">Steel</option>
                    <option value="copper">Copper</option>
                    <option value="customized">Customized</option>
                  </select>
                </FormField>
              </div>

              {/* Right Column: Images and Options */}
              <div>
                {/* Image Uploader */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Images
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none"
                        >
                          <span>Upload files</span>
                          <input
                            id="file-upload"
                            type="file"
                            multiple
                            accept="image/png, image/jpeg, image/webp"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP up to 5MB each (Max 5 images)
                      </p>
                    </div>
                  </div>
                  {errors.images && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.images.message}
                    </p>
                  )}
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {imagePreviews.map((src, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={src}
                          alt={`Preview ${index + 1}`}
                          className="h-24 w-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Toggles */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md">
                    <span className="font-medium text-gray-800">
                      Customizable?
                    </span>
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
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
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
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 pt-5 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <PackagePlus className="mr-2 h-5 w-5" />
                  )}
                  {isSubmitting ? "Saving..." : "Add Product"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </>
  );
};

export default AddProduct;
