import React, { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import SignaturePad from "../sign_decision/SignaturePad";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";

const ViewMemo = () => {
  const {
    memos,
    viewId,
    currentUser,
    signatureDataURL,
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
      <Box p={6} textAlign="center">
        <Typography color="textSecondary">
          No memo selected or memo not found.
        </Typography>
      </Box>
    );
  }

  const handleApprove = async () => {
    if (!signatureDataURL) {
      alert("Please sign before approving the memo.");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/memos/signAR/${selectedMemo._id}`,
        { digitalSignature: signatureDataURL },
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

      alert("Memo approved successfully!");
      setActiveView("approvedByHead");
    } catch (error) {
      console.error("Error approving memo:", error);
      alert("An error occurred while approving the memo.");
    }
  };

  return (
    <Paper elevation={4} sx={{ maxWidth: 900, mx: "auto", mt: 4, p: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Memo Details
      </Typography>

      {/* Memo Info */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Memo Id:</strong> {selectedMemo.memo_id}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Title:</strong> {selectedMemo.title}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Status:</strong> {selectedMemo.status}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Created By:</strong> {selectedMemo.createdBy?.email} (
            {selectedMemo.createdBy?.role})
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Created At:</strong>{" "}
            {new Date(selectedMemo.createdAt).toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Updated At:</strong>{" "}
            {new Date(selectedMemo.updatedAt).toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Faculty Decision:</strong>{" "}
            {selectedMemo.facultyBoardDecision || "Pending"}
          </Typography>
        </Grid>

      </Grid>

      {/* Content */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Content
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, whiteSpace: "pre-wrap" }}>
          <Typography>{selectedMemo.content}</Typography>
        </Paper>
      </Box>

      {/* Approval History */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Approval History
        </Typography>
        {selectedMemo.approvals && selectedMemo.approvals.length > 0 ? (
          selectedMemo.approvals.map((approval, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{ p: 2, mb: 2, backgroundColor: "#fafafa" }}
            >
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
                    <strong>Signature:</strong>
                  </Typography>
                  <Avatar
                    src={approval.digitalSignature}
                    variant="square"
                    sx={{ width: 200, height: "auto", mt: 1 }}
                  />
                </Box>
              )}
            </Paper>
          ))
        ) : (
          <Typography color="textSecondary">No approvals yet.</Typography>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Signature & Action Buttons */}
      {currentUser === "AR_Faculty" ? (
        <Box>
          <SignaturePad />
          <Button
            variant="contained"
            color="success"
            onClick={handleApprove}
            sx={{ mt: 2 }}
          >
            Approve Memo
          </Button>
        </Box>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setActiveView("memos")}
          sx={{ mt: 2 }}
        >
          OK
        </Button>
      )}
    </Paper>
  );
};

export default ViewMemo;
