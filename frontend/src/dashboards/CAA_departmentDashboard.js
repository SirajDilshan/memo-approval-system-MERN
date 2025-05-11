import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Box,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RecentMemosTable from "../components/recent_memos/RecentMemosTable";

const CAADepartmentDashboard = () => {
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/memos/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const filtered = res.data.filter(
          (memo) => memo.createdBy?.role === "CAA_Department"
        );

        setMemos(filtered);
      } catch (err) {
        console.error("Failed to fetch memos:", err);
      } finally {
        setLoading(false);
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

  const kpiCards = [
    { title: "Total Memos", value: totalMemos, icon: <MailIcon color="primary" /> },
    { title: "Pending Approval", value: pendingCount, icon: <AccessTimeIcon color="action" /> },
    { title: "Faculty Board Accepted", value: approvedCount, icon: <CheckCircleIcon color="success" /> },
    { title: "Faculty Board Rejected", value: rejectedCount, icon: <CancelIcon color="error" /> },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, CAA of the Department
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {kpiCards.map((card, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card elevation={3}>
                  <CardHeader
                    avatar={card.icon}
                    title={card.title}
                    titleTypographyProps={{ variant: "subtitle2" }}
                  />
                  <CardContent>
                    <Typography variant="h5" fontWeight="bold">
                      {card.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Memos Table */}
          <Box mt={5}>
            <RecentMemosTable memos={memos} />
          </Box>
        </>
      )}
    </Box>
  );
};

export default CAADepartmentDashboard;
