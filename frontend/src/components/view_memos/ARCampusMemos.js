import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Grid,
} from "@mui/material";

const ARCampusMemos = () => {
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

  const handleFilterChange = (type) => {
    setFilterType(type);
    if (type === "All") {
      setFilteredMemos(allMemos);
    } else if (type === "Sign") {
      setFilteredMemos(allMemos.filter(memo => memo.status === "Approved by Dean"));
    } else if (type === "View Only") {
      setFilteredMemos(allMemos.filter(memo => memo.status !== "Approved by Dean"));
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
    <div className="p-6">
      <Typography variant="h5" component="h2" gutterBottom>
        Memos Created by CAA Faculty
      </Typography>

      {/* Filter Buttons */}
      <Grid container spacing={2} mb={4}>
        {["All", "Sign", "View Only"].map((type) => (
          <Grid item key={type}>
            <Button
              variant={filterType === type ? "contained" : "outlined"}
              color={filterType === type ? "primary" : "default"}
              onClick={() => handleFilterChange(type)}
            >
              {type}
            </Button>
          </Grid>
        ))}
      </Grid>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
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
                  No memos found for selected filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredMemos.map((memo) => (
                <TableRow key={memo._id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                  <TableCell>{memo.memo_id}</TableCell>
                  <TableCell>{memo.title}</TableCell>
                  <TableCell style={{ color: getStatusColor(memo.status) }}>
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
                      onClick={() => {
                        setViewId(memo._id);
                        setActiveView(
                          memo.status === "Approved by Dean"
                            ? "arcampussign"
                            : "viewcampuslevelmemo"
                        );
                      }}
                      variant="contained"
                      color={memo.status === "Approved by Dean" ? "success" : "primary"}
                    >
                      {memo.status === "Approved by Dean" ? "Sign" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ARCampusMemos;
