import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Card, CardContent, Typography, Icon } from "@mui/material";
import { FaEnvelope, FaCheckCircle } from "react-icons/fa";
import RecentCampus from "../components/recent_memos/RecentCampus"; // Assuming this is the correct component

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
    <div style={{ padding: "24px" }}>
      <Typography variant="h4" gutterBottom>
        Welcome, Campus AR
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
                Approved
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "text.primary" }}>
                {pendingCount}
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
                Campus Board Accepted
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
                Campus Board Rejected
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
      <RecentCampus memos={memos} />
    </div>
  );
};

export default ARCampusDashboard;
