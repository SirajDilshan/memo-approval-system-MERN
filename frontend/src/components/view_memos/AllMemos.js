import React, { useEffect, useState, useMemo } from "react";
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

const AllMemos = () => {
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState("all"); // all, editable, viewOnly
  const { setActiveView, memos, setMemos, setViewId, currentUser } = useAuth();

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/memos/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMemos(response.data);
      } catch (error) {
        console.error("Error fetching memos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemos();
  }, [setMemos]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Finalized":
      case "Approved":
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

  const caaMemos = useMemo(
    () => memos.filter((memo) => memo.createdBy?.role === "CAA_Department"),
    [memos]
  );

  const filteredMemos = useMemo(() => {
    switch (filterMode) {
      case "editable":
        return caaMemos.filter((memo) => memo.status === "Pending");
      case "viewOnly":
        return caaMemos.filter((memo) => memo.status !== "Pending");
      case "all":
      default:
        return caaMemos;
    }
  }, [caaMemos, filterMode]);

  return (
    <Box p={4}>
      <Box mb={3}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          All Memos
        </Typography>

        <Stack direction="row" spacing={2} mt={1}>
          <Button
            variant={filterMode === "all" ? "contained" : "outlined"}
            onClick={() => setFilterMode("all")}
          >
            All
          </Button>
          <Button
            variant={filterMode === "editable" ? "contained" : "outlined"}
            onClick={() => setFilterMode("editable")}
          >
            Editable
          </Button>
          <Button
            variant={filterMode === "viewOnly" ? "contained" : "outlined"}
            onClick={() => setFilterMode("viewOnly")}
          >
            View Only
          </Button>
        </Stack>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Memo Id</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Faculty Decision</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                  <Typography mt={2}>Loading memos...</Typography>
                </TableCell>
              </TableRow>
            ) : filteredMemos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  No memos found.
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
                  <TableCell>{memo.facultyBoardDecision || "N/A"}</TableCell>
                  <TableCell>{new Date(memo.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(memo.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {memo.status === "Pending" ? (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                          setViewId(memo._id);
                          setActiveView(
                            currentUser === "Head_Department"
                              ? "signMemo"
                              : "editMemo"
                          );
                        }}
                      >
                        Edit
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => {
                          setViewId(memo._id);
                          setActiveView("viewMemo");
                        }}
                      >
                        View
                      </Button>
                    )}
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

export default AllMemos;
