import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress } from '@mui/material';
import Paper from '@mui/material/Paper';

const CampusBoardDecision = () => {
  const [loading, setLoading] = useState(true);
  const { setActiveView, setMemos, setViewId } = useAuth();
  const [approvedMemos, setApprovedMemos] = useState([]);

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

        // Filter memos where status is "Approved by AR Campus"
        const filtered = response.data.filter(
          (memo) => memo.status === "Approved by AR Campus"
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

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Set Campus Board Decision</h2>
      <TableContainer component={Paper}>
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
                </TableCell>
              </TableRow>
            ) : approvedMemos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No memos approved by the campus AR yet.
                </TableCell>
              </TableRow>
            ) : (
              approvedMemos.map((memo) => (
                <TableRow key={memo._id}>
                  <TableCell>{memo.memo_id}</TableCell>
                  <TableCell>{memo.title}</TableCell>
                  <TableCell style={{ color: getStatusColor(memo.status) }}>
                    {memo.status}
                  </TableCell>
                  <TableCell>{memo.createdBy?.email} ({memo.createdBy?.role})</TableCell>
                  <TableCell>{memo.campusBoardDecision || "N/A"}</TableCell>
                  <TableCell>{new Date(memo.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(memo.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setViewId(memo._id);
                        setActiveView("arcampusdecision");
                      }}
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

export default CampusBoardDecision;
