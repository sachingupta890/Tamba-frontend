import React from "react";
import { motion } from "framer-motion";

const AnalyticsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics</h1>
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-600">
          Product and sales analytics charts will be displayed here.
        </p>
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;
