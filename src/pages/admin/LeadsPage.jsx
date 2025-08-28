import React, { useState, useEffect } from "react";
import { getAllLeads, updateLeadStatus } from "../../services/api";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await getAllLeads();
        setLeads(response.data);
      } catch (error) {
        toast.error("Failed to fetch leads.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const handleStatusChange = async (leadId, newStatus) => {
    const originalLeads = [...leads];
    // Optimistically update UI
    setLeads(
      leads.map((lead) =>
        lead._id === leadId ? { ...lead, status: newStatus } : lead
      )
    );

    try {
      await updateLeadStatus(leadId, newStatus);
      toast.success("Status updated!");
    } catch (error) {
      // Revert UI on error
      setLeads(originalLeads);
      toast.error("Failed to update status.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Manage Leads / Requests
      </h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Lead ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {lead.leadId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.userId?.name || "Guest User"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.productId?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <select
                    value={lead.status}
                    onChange={(e) =>
                      handleStatusChange(lead._id, e.target.value)
                    }
                    className="p-1 rounded-md border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Converted</option>
                    <option>Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsPage;
