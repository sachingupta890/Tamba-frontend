import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, Send, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { submitQuery } from "../services/api";
import toast from "react-hot-toast";

const contactSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Sending your message...");
    try {
      const response = await submitQuery(data);
      toast.success(response.data.message, { id: toastId });
      reset();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message.", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center">
            Get in Touch
          </h1>
          <p className="text-md md:text-lg text-gray-600 mt-4 max-w-2xl mx-auto text-center">
            We're here to help and answer any question you might have. We look
            forward to hearing from you.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-lg">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-orange-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold">Our Location</h3>
                  <p className="text-gray-600">Mathura, Uttar Pradesh, India</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-orange-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold">Phone Number</h3>
                  <p className="text-gray-600">23423232</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-orange-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold">Email Address</h3>
                  <p className="text-gray-600">manojdhangar@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <Instagram className="w-6 h-6 text-orange-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold">Instagram</h3>
                  <a href="#" className="text-gray-600 hover:text-orange-600">
                    @tamba_bottles
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* "Ask a Question" Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Ask a Question
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className={`mt-1 block w-full p-2 border ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className={`mt-1 block w-full p-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  {...register("message")}
                  className={`mt-1 block w-full p-2 border ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  } rounded-md`}
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Send className="mr-2 h-5 w-5" />
                )}
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
