import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";

const CampusLevelMemos = () => {
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
      setFilteredMemos(allMemos.filter(memo => memo.status === "Pending"));
    } else if (type === "View Only") {
      setFilteredMemos(allMemos.filter(memo => memo.status !== "Pending"));
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
        return "yellow";
      default:
        return "gray";
    }
  };

  return (
    <Box p={6}>
      <Typography variant="h5" fontWeight="bold" mb={4}>
        Memos Created by CAA Faculty
      </Typography>

      {/* Filter Buttons */}
      <Box mb={4} display="flex" gap={2}>
        {["All", "Sign", "View Only"].map((type) => (
          <Button
            key={type}
            onClick={() => handleFilterChange(type)}
            variant={filterType === type ? "contained" : "outlined"}
            color={filterType === type ? "primary" : "default"}
          >
            {type}
          </Button>
        ))}
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table aria-label="campus level memos">
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
                </TableCell>
              </TableRow>
            ) : filteredMemos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No memos found for the selected filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredMemos.map((memo) => (
                <TableRow key={memo._id}>
                  <TableCell>{memo.memo_id}</TableCell>
                  <TableCell>{memo.title}</TableCell>
                  <TableCell
                    sx={{
                      color: getStatusColor(memo.status),
                      fontWeight: "bold",
                    }}
                  >
                    {memo.status}
                  </TableCell>
                  <TableCell>
                    {memo.createdBy?.email} ({memo.createdBy?.role})
                  </TableCell>
                  <TableCell>{memo.campusBoardDecision || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(memo.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(memo.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setViewId(memo._id);
                        setActiveView(
                          memo.status === "Pending"
                            ? "EditMemoFaculty"
                            : "viewcampuslevelmemo"
                        );
                      }}
                      variant="contained"
                      color={memo.status === "Pending" ? "success" : "primary"}
                    >
                      {memo.status === "Pending" ? "Sign" : "View"}
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

export default CampusLevelMemos;
