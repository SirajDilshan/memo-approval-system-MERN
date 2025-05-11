import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";

const ARApproved = () => {
  const [loading, setLoading] = useState(true);
  const { setActiveView, setMemos, setViewId } = useAuth();
  const [approvedMemos, setApprovedMemos] = useState([]);

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

        // Filter memos where status is "Approved by AR"
        const filtered = response.data.filter(
          (memo) => memo.status === "Approved by AR"
        );
        setApprovedMemos(filtered);
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
      case "Approved by Head":
        return "success";
      case "Rejected":
        return "error";
      case "Pending":
      case "Under Review":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>
        Set Faculty Boarding Decision
      </h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Approved Memos Table">
          <TableHead>
            <TableRow>
              <TableCell>Memo Id</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : approvedMemos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No memos approved by the Head yet.
                </TableCell>
              </TableRow>
            ) : (
              approvedMemos.map((memo) => (
                <TableRow key={memo._id}>
                 <TableCell>{memo.memo_id}</TableCell>
                  <TableCell>{memo.title}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        color:
                          getStatusColor(memo.status) === "success"
                            ? "green"
                            : getStatusColor(memo.status) === "error"
                            ? "red"
                            : getStatusColor(memo.status) === "warning"
                            ? "yellow"
                            : "gray",
                      }}
                    >
                      {memo.status}
                    </span>
                  </TableCell>
                  <TableCell>{memo.createdBy?.email} ({memo.createdBy?.role})</TableCell>
                  <TableCell>{new Date(memo.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(memo.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setViewId(memo._id);
                        setActiveView("arDecision");
                      }}
                      variant="contained"
                      color="success"
                      size="small"
                    >
                      Set Decision
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

export default ARApproved;
