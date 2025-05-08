import React, { useEffect, useState } from "react";
import axios from "axios";
import KPICard from "../components/cards/KPICard";
import { FaEnvelope, FaCheckCircle, FaClock } from "react-icons/fa";
import CAARecentMemosTable from "../components/recent_memos/CAARecentMemosTable";

const CAAFacultyDashboard = () => {
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

        // Filter memos where createdBy.role === "CAA_Faculty"
        const filteredMemos = res.data.filter(
          (memo) => memo.createdBy?.role === "CAA_Faculty"
        );

        console.log(filteredMemos);
        setMemos(filteredMemos);
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
    (memo) => memo.status === "Campus Board Decision: Accepted"
  ).length;
  const rejectedCount = memos.filter(
    (memo) => memo.status === "Campus Board Decision: Rejected"
  ).length;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome, CAA of the Faculty
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
      <CAARecentMemosTable memos={memos} />
    </div>
  );
};

export default CAAFacultyDashboard;
