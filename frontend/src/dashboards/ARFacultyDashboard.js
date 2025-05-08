import React, { useEffect, useState } from "react";
import axios from "axios";
import KPICard from "../components/cards/KPICard";
import RecentFaculty from "../components/recent_memos/RecentFaculty";
import RecentCampus from "../components/recent_memos/RecentCampus";
import { FaEnvelope, FaCheckCircle, FaClock } from "react-icons/fa";

const ARFacultyDashboard = () => {
  const [allMemos, setAllMemos] = useState([]);
  const [filteredMemos, setFilteredMemos] = useState([]);
  const [level, setLevel] = useState("Faculty");

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/memos/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllMemos(res.data);
      } catch (err) {
        console.error("Failed to fetch memos:", err);
      }
    };

    fetchMemos();
  }, []);

  // Filter memos when level or allMemos change
  useEffect(() => {
    if (level === "Faculty") {
      setFilteredMemos(
        allMemos.filter((memo) => memo.createdBy?.role === "CAA_Department")
      );
    } else if (level === "Campus") {
      setFilteredMemos(
        allMemos.filter((memo) => memo.createdBy?.role === "CAA_Faculty")
      );
    }
  }, [level, allMemos]);

  const totalMemos = filteredMemos.length;
  const pendingCount = filteredMemos.filter(
    (memo) => memo.status === "Pending"
  ).length;
  const approvedCount = filteredMemos.filter(
    (memo) => memo.status === `${level} Board Decision: Accepted`
  ).length;
  const rejectedCount = filteredMemos.filter(
    (memo) => memo.status === `${level} Board Decision: Rejected`
  ).length;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome, AR of the faculty
      </h1>

      <div className="space-x-2">
        <button
          onClick={() => setLevel("Faculty")}
          className={`px-4 py-2 rounded-lg ${
            level === "Faculty" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Faculty Level
        </button>
        <button
          onClick={() => setLevel("Campus")}
          className={`px-4 py-2 rounded-lg ${
            level === "Campus" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Campus Level
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Memos" value={totalMemos} icon={<FaEnvelope />} />
        <KPICard
          title="Pending Approval"
          value={pendingCount}
          icon={<FaClock />}
        />
        <KPICard
          title= {`${level} Board Accepted`}
          value={`${approvedCount}`}
          icon={<FaCheckCircle />}
        />
        <KPICard
          title={`${level} Board Rejected`}
          value={`${rejectedCount}`}
          icon={<FaCheckCircle />}
        />
      </div>

      {level === "Faculty" ? (
        <RecentFaculty memos={filteredMemos} />
      ) : (
        <RecentCampus memos={filteredMemos} />
      )}
    </div>
  );
};

export default ARFacultyDashboard;
