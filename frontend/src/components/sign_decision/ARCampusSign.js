import React, { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import SignaturePad from "./SignaturePad";

import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
} from "@mui/material";

const ARCampusSign = () => {
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
      <Box p={6} textAlign="center" color="gray">
        No memo selected or memo not found.
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
        `http://localhost:5000/api/memos/signARCampus/${selectedMemo._id}`,
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
      setActiveView("arcampusmemos");
    } catch (error) {
      console.error("Error approving memo:", error);
      alert("An error occurred while approving the memo.");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: "900px", mx: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Memo Details
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
                  <strong>Memo Id:</strong> {selectedMemo.memo_id}
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
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Campus Decision:</strong>{" "}
            {selectedMemo.campusBoardDecision || "Pending"}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="h6" fontWeight="medium" gutterBottom>
          Content
        </Typography>
        <Typography
          sx={{
            backgroundColor: "#f9f9f9",
            p: 2,
            borderRadius: 1,
            whiteSpace: "pre-wrap",
          }}
        >
          {selectedMemo.content}
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="h6" fontWeight="medium" gutterBottom>
          Approval History
        </Typography>
        {selectedMemo.approvals && selectedMemo.approvals.length > 0 ? (
          selectedMemo.approvals.map((approval, index) => (
            <Paper
              key={index}
              elevation={1}
              sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5" }}
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
                    <strong>Digital Signature:</strong>
                  </Typography>
                  <img
                    src={approval.digitalSignature}
                    alt="Digital Signature"
                    style={{
                      marginTop: 4,
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      width: "200px",
                    }}
                  />
                </Box>
              )}
            </Paper>
          ))
        ) : (
          <Typography color="text.secondary">No approvals yet.</Typography>
        )}
      </Box>

      {currentUser === "AR_Campus" && (
        <Box mt={4}>
          <SignaturePad />
          <Button
            onClick={handleApprove}
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
          >
            Approve Memo
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default ARCampusSign;
