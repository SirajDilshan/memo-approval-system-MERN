import React, { useEffect, useState } from "react";
import axios from "axios";
import KPICard from "../components/cards/KPICard";
import RecentMemosTable from "../components/recent_memos/RecentMemosTable";
import { FaEnvelope, FaCheckCircle, FaClock } from "react-icons/fa";

const CAADepartmentDashboard = () => {
  const [memos, setMemos] = useState([]);

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming JWT is stored here

        const res = await axios.get("http://localhost:5000/api/memos/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(res.data);
        setMemos(res.data);
      } catch (err) {
        console.error("Failed to fetch memos:", err);
      }
    };

    fetchMemos();
  }, []);

  // KPI Calculations
  const totalMemos = memos.length;
  const pendingCount = memos.filter((memo) => memo.status === "Pending").length;
  const approvedCount = memos.filter(
    (memo) => memo.status === "Faculty Board Decision: Accepted"
  ).length;
  const rejectedCount = memos.filter(
    (memo) => memo.status === "Faculty Board Decision: Rejected"
  ).length;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome, CAA of the Department
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Memos" value={totalMemos} icon={<FaEnvelope />} />
        <KPICard
          title="Pending Approval"
          value={pendingCount}
          icon={<FaClock />}
        />
        <KPICard
          title="Faculty Board Accepted"
          value={`${approvedCount}`}
          icon={<FaCheckCircle />}
        />
        <KPICard
          title="Faculty Board Rejected"
          value={`${rejectedCount}`}
          icon={<FaCheckCircle />}
        />
      </div>

      {/* Recent Memos Table */}
      <RecentMemosTable memos={memos} />
    </div>
  );
};

export default CAADepartmentDashboard;
