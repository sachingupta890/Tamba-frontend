import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getDashboardStats, getRecentLeads } from "../../services/api";
import {
  Loader2,
  AlertCircle,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import toast from "react-hot-toast";

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center transition-transform transform hover:scale-105">
    <div className={`p-3 rounded-full mr-4 ${color}`}>{icon}</div>
    <div>
      <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
  </div>
);

const COLORS = ["#FF8042", "#0088FE", "#00C49F", "#FFBB28"];

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, leadsResponse] = await Promise.all([
          getDashboardStats(),
          getRecentLeads(),
        ]);
        setStats(statsResponse.data);
        setRecentLeads(leadsResponse.data);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        toast.error("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 p-4 rounded-lg">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold text-red-700">
          An Error Occurred
        </h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const chartData = stats.productsByCategory.map((item) => ({
    ...item,
    name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
  }));

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Dashboard Overview
      </h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package size={24} className="text-blue-800" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={24} className="text-green-800" />}
          color="bg-green-100"
        />
        {/* --- THIS IS THE FIX --- */}
        <StatCard
          title="New Leads"
          value={stats.totalLeads}
          icon={<ShoppingCart size={24} className="text-orange-800" />}
          color="bg-orange-100"
        />
        <StatCard
          title="Revenue"
          value="₹0"
          icon={<TrendingUp size={24} className="text-purple-800" />}
          color="bg-purple-100"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Product Categories
          </h3>
          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={150}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="name"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Leads
          </h3>
          {recentLeads.length > 0 ? (
            <ul className="space-y-4">
              {recentLeads.map((lead) => (
                <li key={lead._id} className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-full">
                    <ShoppingCart size={20} className="text-orange-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">
                      New lead for "{lead.productId?.name || "Unknown Product"}"
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(lead.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 text-center mt-8">
              No recent leads found.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
