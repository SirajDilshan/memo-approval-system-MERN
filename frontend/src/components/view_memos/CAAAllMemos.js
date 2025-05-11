import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from "@mui/material";

const CAAAllMemos = () => {
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState("all"); // 'all', 'editable', 'viewOnly'
  const { setActiveView, memos, setMemos, setViewId } = useAuth();

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/memos/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = response.data.filter(
          (memo) => memo.createdBy?.role === "CAA_Faculty"
        );
        setMemos(filtered);
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
        return "yellow";
      default:
        return "gray";
    }
  };

  const filteredMemos = memos.filter((memo) => {
    if (filterMode === "editable") return memo.status === "Pending";
    if (filterMode === "viewOnly") return memo.status !== "Pending";
    return true; // all
  });

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, marginBottom: 2 }}>
        All Created Memos
      </Typography>

      {/* Toggle Filter Buttons */}
      <Box sx={{ marginBottom: 3 }}>
        {["all", "editable", "viewOnly"].map((mode) => (
          <Button
            key={mode}
            onClick={() => setFilterMode(mode)}
            variant={filterMode === mode ? "contained" : "outlined"}
            color={filterMode === mode ? "primary" : "default"}
            sx={{ marginRight: 2 }}
          >
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </Button>
        ))}
      </Box>

      {/* Memo Table */}
      <TableContainer sx={{ boxShadow: 3, borderRadius: 1 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Memo Id</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created By</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Campus Decision</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Updated At</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
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
                <TableCell colSpan={7} align="center" sx={{ color: "gray" }}>
                  No memos found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMemos.map((memo) => (
                <TableRow key={memo._id} sx={{ "&:hover": { backgroundColor: "#f5f5f5" } }}>
                  <TableCell>{memo.memo_id}</TableCell>
                  <TableCell>{memo.title}</TableCell>
                  <TableCell sx={{ color: getStatusColor(memo.status), fontWeight: "bold" }}>
                    {memo.status}
                  </TableCell>
                  <TableCell>{memo.createdBy?.email} ({memo.createdBy?.role})</TableCell>
                  <TableCell>{memo.campusBoardDecision || "N/A"}</TableCell>
                  <TableCell>{new Date(memo.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(memo.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {memo.status === "Pending" ? (
                      <Button
                        onClick={() => {
                          setViewId(memo._id);
                          setActiveView("caaeditmemo");
                        }}
                        variant="contained"
                        color="primary"
                        size="small"
                      >
                        Edit
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          setViewId(memo._id);
                          setActiveView("viewcampuslevelmemo");
                        }}
                        variant="outlined"
                        color="success"
                        size="small"
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

export default CAAAllMemos;
