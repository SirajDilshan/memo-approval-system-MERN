import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const CampusLevelMemos = () => {
  const [loading, setLoading] = useState(true);
  const { setActiveView, memos, setMemos, setViewId } = useAuth();

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

  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Memos</h2>
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
                <td colSpan="9" className="text-center px-4 py-6 text-gray-500">
                  Loading memos...
                </td>
              </tr>
            ) : memos.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center px-4 py-6 text-gray-500">
                  No memos found.
                </td>
              </tr>
            ) : (
              memos.map((memo) => (
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
                    {memo.campusBoardDecision || "N/A"}
                  </td>
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
                          setActiveView("EditMemoFaculty");
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition duration-200"
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition duration-200"
                        onClick={() => {
                          setViewId(memo._id);
                          setActiveView("viewcampuslevelmemo");
                        }}
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

export default CampusLevelMemos;
