import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const CAAAllMemos = () => {
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState("all"); // 'all', 'editable', 'viewOnly'
  const { setActiveView, memos, setMemos, setViewId } = useAuth();

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/memos/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = response.data.filter(
          (memo) => memo.createdBy?.role === "CAA_Faculty"
        );
        setMemos(filtered);
      } catch (error) {
        console.error("Error fetching memos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMemos();
  }, [setMemos]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Finalized":
      case "Approved":
        return "text-green-600 font-semibold";
      case "Rejected":
        return "text-red-600 font-semibold";
      case "Pending":
      case "Under Review":
        return "text-yellow-600 font-semibold";
      default:
        return "text-gray-600";
    }
  };

  const filteredMemos = memos.filter((memo) => {
    if (filterMode === "editable") return memo.status === "Pending";
    if (filterMode === "viewOnly") return memo.status !== "Pending";
    return true; // all
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">All Created Memos</h2>

      {/* Toggle Filter Buttons */}
      <div className="mb-4 flex gap-3">
        <button
          className={`px-4 py-1 rounded-md text-sm font-medium ${
            filterMode === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setFilterMode("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-1 rounded-md text-sm font-medium ${
            filterMode === "editable" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setFilterMode("editable")}
        >
          Editable
        </button>
        <button
          className={`px-4 py-1 rounded-md text-sm font-medium ${
            filterMode === "viewOnly" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setFilterMode("viewOnly")}
        >
          View Only
        </button>
      </div>

      {/* Memo Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created By</th>
              <th className="px-4 py-3">Campus Decision</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3">Updated At</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center px-4 py-6 text-gray-500">
                  Loading memos...
                </td>
              </tr>
            ) : filteredMemos.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center px-4 py-6 text-gray-500">
                  No memos found.
                </td>
              </tr>
            ) : (
              filteredMemos.map((memo) => (
                <tr key={memo._id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{memo.title}</td>
                  <td className={`px-4 py-3 ${getStatusColor(memo.status)}`}>
                    {memo.status}
                  </td>
                  <td className="px-4 py-3">
                    {memo.createdBy?.email} ({memo.createdBy?.role})
                  </td>
                  <td className="px-4 py-3">{memo.campusBoardDecision || "N/A"}</td>
                  <td className="px-4 py-3">
                    {new Date(memo.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(memo.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {memo.status === "Pending" ? (
                      <button
                        onClick={() => {
                          setViewId(memo._id);
                          setActiveView("caaeditmemo");
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setViewId(memo._id);
                          setActiveView("viewcampuslevelmemo");
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition"
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CAAAllMemos;
