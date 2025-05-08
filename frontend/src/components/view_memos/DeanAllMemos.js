import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const DeanAllMemos = () => {
  const [loading, setLoading] = useState(true);
  const { setActiveView, setMemos, setViewId } = useAuth();
  const [allMemos, setAllMemos] = useState([]);
  const [filteredMemos, setFilteredMemos] = useState([]);
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/memos/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMemos(response.data);

        const caaFacultyMemos = response.data.filter(
          (memo) => memo.createdBy?.role === "CAA_Faculty"
        );

        setAllMemos(caaFacultyMemos);
        setFilteredMemos(caaFacultyMemos); // Initially show all
      } catch (error) {
        console.error("Error fetching memos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemos();
  }, [setMemos]);

  // Handle filter button clicks
  const handleFilterChange = (type) => {
    setFilterType(type);
    if (type === "All") {
      setFilteredMemos(allMemos);
    } else if (type === "Sign") {
      setFilteredMemos(allMemos.filter(memo => memo.status === "Approved by Faculty AR"));
    } else if (type === "View Only") {
      setFilteredMemos(allMemos.filter(memo => memo.status !== "Approved by Faculty AR"));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Finalized":
      case "Approved":
      case "Approved by Head":
      case "Approved by Faculty AR":
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
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Memos Created by CAA Faculty
      </h2>

      {/* Filter Buttons */}
      <div className="mb-4 flex gap-3">
        {["All", "Sign", "View Only"].map((type) => (
          <button
            key={type}
            onClick={() => handleFilterChange(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filterType === type
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

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
            ) : filteredMemos.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center px-4 py-6 text-gray-500">
                  No memos found for selected filter.
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
                    <button
                      onClick={() => {
                        setViewId(memo._id);
                        setActiveView(
                          memo.status === "Approved by Faculty AR"
                            ? "deansign"
                            : "viewcampuslevelmemo"
                        );
                      }}
                      className={`${
                        memo.status === "Approved by Faculty AR"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      } text-white px-3 py-1 rounded-lg text-sm transition duration-200`}
                    >
                      {memo.status === "Approved by Faculty AR" ? "Sign" : "View"}
                    </button>
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

export default DeanAllMemos;
