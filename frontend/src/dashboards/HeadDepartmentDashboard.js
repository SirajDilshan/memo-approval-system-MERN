import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Card, CardContent, Typography, Icon, Box } from "@mui/material";
import { FaEnvelope, FaCheckCircle, FaClock } from "react-icons/fa";
import RecentMemosTable from "../components/recent_memos/RecentMemosTable"; // Assuming this is the correct component

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
        // Filter memos created by CAA_Department
        const filtered = res.data.filter(
          (memo) => memo.createdBy?.role === "CAA_Department"
        );

        setMemos(filtered);
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
    <Box sx={{ padding: "24px" }}>
      <Typography variant="h4" gutterBottom>
        Welcome, Head of the Department
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Memos
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "text.primary" }}>
                {totalMemos}
              </Typography>
              <Icon sx={{ color: "primary.main", fontSize: "2rem" }}>
                <FaEnvelope />
              </Icon>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Pending Approval
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "text.primary" }}>
                {pendingCount}
              </Typography>
              <Icon sx={{ color: "primary.main", fontSize: "2rem" }}>
                <FaClock />
              </Icon>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Faculty Board: Accepted
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "text.primary" }}>
                {approvedCount}
              </Typography>
              <Icon sx={{ color: "primary.main", fontSize: "2rem" }}>
                <FaCheckCircle />
              </Icon>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Faculty Board: Rejected
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "text.primary" }}>
                {rejectedCount}
              </Typography>
              <Icon sx={{ color: "primary.main", fontSize: "2rem" }}>
                <FaCheckCircle />
              </Icon>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Memos Table */}
      <RecentMemosTable memos={memos} />
    </Box>
  );
};

export default CAADepartmentDashboard;
