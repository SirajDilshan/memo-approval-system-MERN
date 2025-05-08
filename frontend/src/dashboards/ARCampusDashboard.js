import React, { useEffect, useState } from "react";
import axios from "axios";
import KPICard from "../components/cards/KPICard";
import RecentCampus from "../components/recent_memos/RecentCampus"; // Assuming this is the correct component
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";

const ARCampusDashboard = () => {
  const [memos, setMemos] = useState([]);

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/memos/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Filter only memos created by CAA_Faculty
        const filtered = res.data.filter(
          (memo) => memo.createdBy?.role === "CAA_Faculty"
        );
        setMemos(filtered);
      } catch (err) {
        console.error("Failed to fetch memos:", err);
      }
    };

    fetchMemos();
  }, []);

  const totalMemos = memos.length;
  const pendingCount = memos.filter((memo) => memo.status === "Pending").length;
  const approvedCount = memos.filter(
    (memo) => memo.status === "Campus Board Decision: Accepted"
  ).length;
  const rejectedCount = memos.filter(
    (memo) => memo.status === "Campus Board Decision: Rejected"
  ).length;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome, Campus AR
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Memos" value={totalMemos} icon={<FaEnvelope />} />
        <KPICard
          title="Approved"
          value={`${pendingCount}`}
          icon={<FaCheckCircle />}
        />
        <KPICard
          title="Campus Board Accepted"
          value={`${approvedCount}`}
          icon={<FaCheckCircle />}
        />
        <KPICard
          title="Campus Board Rejected"
          value={`${rejectedCount}`}
          icon={<FaCheckCircle />}
        />
      </div>

      {/* Recent Memos Table */}
      <RecentCampus memos={memos} />
    </div>
  );
};
export default ARCampusDashboard;
