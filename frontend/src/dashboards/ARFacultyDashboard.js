import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid, Card, CardContent, Typography, Icon, Button, Box } from "@mui/material";
import { FaEnvelope, FaCheckCircle, FaClock } from "react-icons/fa";
import RecentFaculty from "../components/recent_memos/RecentFaculty";
import RecentCampus from "../components/recent_memos/RecentCampus";

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
    <div style={{ padding: "24px" }}>
      <Typography variant="h4" gutterBottom>
        Welcome, AR of the faculty
      </Typography>

      {/* Level Selection */}
      <Box mb={4}>
        <Button
          onClick={() => setLevel("Faculty")}
          variant={level === "Faculty" ? "contained" : "outlined"}
          color="primary"
          sx={{ marginRight: "10px" }}
        >
          Faculty Level
        </Button>
        <Button
          onClick={() => setLevel("Campus")}
          variant={level === "Campus" ? "contained" : "outlined"}
          color="primary"
        >
          Campus Level
        </Button>
      </Box>

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
                {`${level} Board Accepted`}
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
                {`${level} Board Rejected`}
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
      {level === "Faculty" ? (
        <RecentFaculty memos={filteredMemos} />
      ) : (
        <RecentCampus memos={filteredMemos} />
      )}
    </div>
  );
};

export default ARFacultyDashboard;
