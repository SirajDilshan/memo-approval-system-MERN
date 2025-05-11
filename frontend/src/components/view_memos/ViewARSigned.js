import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Avatar,
} from "@mui/material";

const ViewARSigned = () => {
  const {
    memos,
    viewId,
    setSignatureDataURL,
    setActiveView,
  } = useAuth();

  const selectedMemo = memos?.find((memo) => memo._id === viewId);

  useEffect(() => {
    setSignatureDataURL(null); // Clear signature when a new memo is selected
  }, [viewId, setSignatureDataURL]);

  if (!selectedMemo) {
    return (
      <Box p={4} textAlign="center">
        <Typography color="text.secondary">No memo selected or memo not found.</Typography>
      </Box>
    );
  }


  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 900, mx: "auto", mt: 6 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Memo Details
      </Typography>

      {/* Memo Info */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Memo Id:</strong> {selectedMemo.memo_id}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Title:</strong> {selectedMemo.title}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Status:</strong> {selectedMemo.status}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Created By:</strong> {selectedMemo.createdBy?.email} ({selectedMemo.createdBy?.role})
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Created At:</strong> {new Date(selectedMemo.createdAt).toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Updated At:</strong> {new Date(selectedMemo.updatedAt).toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography>
            <strong>Campus Decision:</strong> {selectedMemo.campusBoardDecision || "Pending"}
          </Typography>
        </Grid>
      </Grid>

      {/* Memo Content */}
      <Box mb={4}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Content
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, whiteSpace: "pre-wrap" }}>
          <Typography>{selectedMemo.content}</Typography>
        </Paper>
      </Box>

      {/* Approval History */}
      <Box>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Approval History
        </Typography>
        {selectedMemo.approvals && selectedMemo.approvals.length > 0 ? (
          selectedMemo.approvals.map((approval, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{ p: 2, mb: 2, backgroundColor: "#f9f9f9" }}
            >
              <Typography><strong>Role:</strong> {approval.role}</Typography>
              <Typography>
                <strong>Date:</strong> {new Date(approval.timestamp).toLocaleString()}
              </Typography>
              {approval.digitalSignature && (
                <Box mt={2}>
                  <Typography><strong>Signature:</strong></Typography>
                  <Avatar
                    src={approval.digitalSignature}
                    alt="Digital Signature"
                    variant="square"
                    sx={{ width: 200, height: "auto", mt: 1 }}
                  />
                </Box>
              )}
            </Paper>
          ))
        ) : (
          <Typography color="text.secondary">No approvals yet.</Typography>
        )}
      </Box>

      {/* OK Button */}
      <Box mt={4} textAlign="right">
        <Button
          variant="contained"
          color="success"
          onClick={() => setActiveView("rectormemos")}
        >
          OK
        </Button>
      </Box>
    </Paper>
  );
};

export default ViewARSigned;
