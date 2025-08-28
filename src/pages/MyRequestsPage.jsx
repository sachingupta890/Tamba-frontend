import React, { useState, useEffect } from "react";
import { getMyRequests } from "../services/api";
import { Loader2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    New: "bg-blue-100 text-blue-800",
    Contacted: "bg-yellow-100 text-yellow-800",
    Converted: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

const MyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getMyRequests();
        setRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch requests", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-gray-800 mb-8"
        >
          My Requests
        </motion.h1>
        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((req, index) => (
              <motion.div
                key={req._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between flex-wrap"
              >
                <div className="flex items-center">
                  <img
                    src={req.productId.images[0]}
                    alt={req.productId.name}
                    className="w-16 h-16 rounded-md object-contain mr-4 bg-gray-100"
                  />
                  <div>
                    <p className="font-bold text-gray-800">
                      {req.productId.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Request ID: {req.leadId}
                    </p>
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <AlertTriangle className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              You haven't made any requests yet.
            </h3>
            <Link
              to="/"
              className="mt-6 inline-block py-2 px-6 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequestsPage;
