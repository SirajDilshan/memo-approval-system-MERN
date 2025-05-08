import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const ApprovedByHead = () => {
  const [loading, setLoading] = useState(true);
  const { setActiveView, setMemos, setViewId } = useAuth();
  const [approvedMemos, setApprovedMemos] = useState([]);
  const [showOnlyHeadApproved, setShowOnlyHeadApproved] = useState(false);

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/memos/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMemos(response.data);

        const filtered = response.data.filter(
          (memo) => memo.createdBy?.role === "CAA_Department"
        );
        setApprovedMemos(filtered);
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
      case "Approved by Head":
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

  // 🔍 Apply filter based on toggle
  const filteredMemos = showOnlyHeadApproved
    ? approvedMemos.filter((memo) => memo.status === "Approved by Head")
    : approvedMemos;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Faculty Memos
      </h2>

      {/* ✅ Toggle Button */}
      <div className="mb-4">
        <button
          onClick={() => setShowOnlyHeadApproved(!showOnlyHeadApproved)}
          className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          {showOnlyHeadApproved ? "Show All Memos" : "Show Only Head Approved"}
        </button>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase tracking-wider text-gray-600">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created By</th>
              <th className="px-4 py-3">Faculty Decision</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3">Updated At</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center px-4 py-6 text-gray-500">
                  Loading memos...
                </td>
              </tr>
            ) : filteredMemos.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center px-4 py-6 text-gray-500">
                  No memos found.
                </td>
              </tr>
            ) : (
              filteredMemos.map((memo) => (
                <tr
                  key={memo._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{memo.title}</td>
                  <td className={`px-4 py-3 ${getStatusColor(memo.status)}`}>
                    {memo.status}
                  </td>
                  <td className="px-4 py-3">
                    {memo.createdBy?.email} ({memo.createdBy?.role})
                  </td>
                  <td className="px-4 py-3">
                    {memo.facultyBoardDecision || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(memo.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(memo.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {memo.status === "Approved by Head" ? (
                      <button
                        onClick={() => {
                          setViewId(memo._id);
                          setActiveView("viewMemo");
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition duration-200"
                      >
                        Sign
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setViewId(memo._id);
                          setActiveView("viewfacultylevelmemo");
                        }}
                        className="bg-gray-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-700 transition duration-200"
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

export default ApprovedByHead;
