import React, { useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  List
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const ARDecision = () => {
  const {
    memos,
    viewId,
    currentUser,
    setSignatureDataURL,
    setMemos,
    setActiveView,
  } = useAuth();

  const selectedMemo = memos?.find((memo) => memo._id === viewId);

  useEffect(() => {
    setSignatureDataURL(null);
  }, [viewId, setSignatureDataURL]);

  if (!selectedMemo) {
    return (
      <Box p={4} textAlign="center">
        <Typography color="text.secondary">No memo selected or memo not found.</Typography>
      </Box>
    );
  }

  const handleDecision = async (decision) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/memos/faculty-board/${selectedMemo._id}`,
        { decision },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMemos((prev) =>
        prev.map((memo) =>
          memo._id === selectedMemo._id ? response.data : memo
        )
      );

      alert(`Memo ${decision.toLowerCase()} successfully!`);
      setActiveView("approvedByFacultyAR");
    } catch (error) {
      console.error("Error updating decision:", error);
      alert("An error occurred while setting the decision.");
    }
  };

  return (
    <Box maxWidth="md" mx="auto" mt={4} p={2}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Memo Details
        </Typography>

        <Grid container spacing={2} sx={{ fontSize: "0.9rem" }}>
          <Grid item xs={12} sm={6}>
                    <strong>Memo Id:</strong> {selectedMemo.memo_id}
                  </Grid>
          <Grid item xs={12} sm={6}>
            <strong>Title:</strong> {selectedMemo.title}
          </Grid>
          <Grid item xs={12} sm={6}>
            <strong>Status:</strong> {selectedMemo.status}
          </Grid>
          <Grid item xs={12} sm={6}>
            <strong>Created By:</strong> {selectedMemo.createdBy?.email} (
            {selectedMemo.createdBy?.role})
          </Grid>
          <Grid item xs={12} sm={6}>
            <strong>Created At:</strong>{" "}
            {new Date(selectedMemo.createdAt).toLocaleString()}
          </Grid>
          <Grid item xs={12} sm={6}>
            <strong>Updated At:</strong>{" "}
            {new Date(selectedMemo.updatedAt).toLocaleString()}
          </Grid>
          <Grid item xs={12} sm={6}>
            <strong>Faculty Decision:</strong>{" "}
            {selectedMemo.facultyBoardDecision || "Pending"}
          </Grid>
          <Grid item xs={12} sm={6}>
            <strong>Campus Decision:</strong>{" "}
            {selectedMemo.campusBoardDecision || "Pending"}
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Content
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, whiteSpace: "pre-wrap" }}>
          {selectedMemo.content}
        </Paper>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Approval History
        </Typography>
        {selectedMemo.approvals && selectedMemo.approvals.length > 0 ? (
          <List>
            {selectedMemo.approvals.map((approval, index) => (
              <Paper key={index} sx={{ mb: 2, p: 2 }} variant="outlined">
                <Typography>
                  <strong>Role:</strong> {approval.role}
                </Typography>
                <Typography>
                  <strong>Approved By:</strong> {approval.approvedBy}
                </Typography>
                <Typography>
                  <strong>Date:</strong>{" "}
                  {new Date(approval.timestamp).toLocaleString()}
                </Typography>
                {approval.digitalSignature && (
                  <Box mt={1}>
                    <Typography>
                      <strong>Digital Signature:</strong>
                    </Typography>
                    <Box mt={1}>
                      <img
                        src={approval.digitalSignature}
                        alt="Digital Signature"
                        style={{ borderRadius: 4, width: 200, border: "1px solid #ccc" }}
                      />
                    </Box>
                  </Box>
                )}
              </Paper>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary">No approvals yet.</Typography>
        )}

        {currentUser === "AR_Faculty" && (
          <Box mt={4} display="flex" gap={2}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleDecision("Accepted")}
            >
              Accept
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDecision("Rejected")}
            >
              Reject
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ARDecision;
