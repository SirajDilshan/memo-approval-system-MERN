import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";

const ApprovedByHead = () => {
  const [loading, setLoading] = useState(true);
  const { setActiveView, setMemos, setViewId } = useAuth();
  const [approvedMemos, setApprovedMemos] = useState([]);
  const [showOnlyHeadApproved, setShowOnlyHeadApproved] = useState(false);

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

        const filtered = response.data.filter(
          (memo) => memo.createdBy?.role === "CAA_Department"
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

  // 🔍 Apply filter based on toggle
  const filteredMemos = showOnlyHeadApproved
    ? approvedMemos.filter((memo) => memo.status === "Approved by Head")
    : approvedMemos;

  return (
    <div className="p-6">
      <Typography variant="h5" gutterBottom>
        Faculty Memos
      </Typography>

      {/* ✅ Toggle Button */}
      <FormControlLabel
        control={
          <Switch
            checked={showOnlyHeadApproved}
            onChange={() => setShowOnlyHeadApproved(!showOnlyHeadApproved)}
            color="primary"
          />
        }
        label={
          showOnlyHeadApproved ? "Show All Memos" : "Show Only Head Approved"
        }
      />

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
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
                <TableCell colSpan={7} align="center">
                  Loading memos...
                </TableCell>
              </TableRow>
            ) : filteredMemos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No memos found.
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
                  <TableCell>{memo.facultyBoardDecision || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(memo.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(memo.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {memo.status === "Approved by Head" ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setViewId(memo._id);
                          setActiveView("viewMemo");
                        }}
                      >
                        Sign
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => {
                          setViewId(memo._id);
                          setActiveView("viewfacultylevelmemo");
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
    </div>
  );
};

export default ApprovedByHead;
