import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from "@mui/material";
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
          headers: { Authorization: `Bearer ${token}` },
        });

        setMemos(response.data);
        const caaFacultyMemos = response.data.filter(
          (memo) => memo.createdBy?.role === "CAA_Faculty"
        );

        setAllMemos(caaFacultyMemos);
        setFilteredMemos(caaFacultyMemos);
      } catch (error) {
        console.error("Error fetching memos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemos();
  }, [setMemos]);

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
        return "green";
      case "Rejected":
        return "red";
      case "Pending":
      case "Under Review":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Memos Created by CAA Faculty
      </Typography>

      {/* Filter Buttons */}
      <Stack direction="row" spacing={2} mb={3}>
        {["All", "Sign", "View Only"].map((type) => (
          <Button
            key={type}
            variant={filterType === type ? "contained" : "outlined"}
            color="primary"
            onClick={() => handleFilterChange(type)}
          >
            {type}
          </Button>
        ))}
      </Stack>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Memo Id</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Campus Decision</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                  <Typography mt={1} color="textSecondary">
                    Loading memos...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : filteredMemos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">
                    No memos found for selected filter.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredMemos.map((memo) => (
                <TableRow key={memo._id} hover>
                  <TableCell>{memo.memo_id}</TableCell>
                  <TableCell>{memo.title}</TableCell>
                  <TableCell sx={{ color: getStatusColor(memo.status), fontWeight: 600 }}>
                    {memo.status}
                  </TableCell>
                  <TableCell>
                    {memo.createdBy?.email} ({memo.createdBy?.role})
                  </TableCell>
                  <TableCell>{memo.campusBoardDecision || "N/A"}</TableCell>
                  <TableCell>{new Date(memo.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(memo.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="contained"
                      color={memo.status === "Approved by Faculty AR" ? "success" : "primary"}
                      onClick={() => {
                        setViewId(memo._id);
                        setActiveView(
                          memo.status === "Approved by Faculty AR"
                            ? "deansign"
                            : "viewcampuslevelmemo"
                        );
                      }}
                    >
                      {memo.status === "Approved by Faculty AR" ? "Sign" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DeanAllMemos;
