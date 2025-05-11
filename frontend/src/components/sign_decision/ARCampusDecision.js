import React, { useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";

const ARCampusDecision = () => {
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
      <Box p={6} textAlign="center">
        <Typography color="textSecondary">No memo selected or memo not found.</Typography>
      </Box>
    );
  }

  const handleDecision = async (decision) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/memos/campus-board/${selectedMemo._id}`,
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
      setActiveView("campusboarddecision");
    } catch (error) {
      console.error("Error updating decision:", error);
      alert("An error occurred while setting the decision.");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 1000, mx: "auto", mt: 6 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Memo Details
      </Typography>

      {/* Memo Info */}
      <Grid container spacing={2} sx={{ fontSize: 14, color: "text.secondary" }}>
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

      {/* Content */}
      <Box mt={4}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Content
        </Typography>
        <Box
          sx={{
            bgcolor: "#f5f5f5",
            p: 2,
            borderRadius: 2,
            whiteSpace: "pre-wrap",
          }}
        >
          <Typography>{selectedMemo.content}</Typography>
        </Box>
      </Box>

      {/* Approval History */}
      <Box mt={4}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Approval History
        </Typography>
        {selectedMemo.approvals && selectedMemo.approvals.length > 0 ? (
          <List>
            {selectedMemo.approvals.map((approval, index) => (
              <Paper
                key={index}
                sx={{ p: 2, mb: 2, backgroundColor: "#f9f9f9" }}
                elevation={1}
              >
                <ListItem disableGutters>
                  <ListItemText
                    primary={
                      <>
                        <div><strong>Role:</strong> {approval.role}</div>
                        <div><strong>Approved By:</strong> {approval.approvedBy}</div>
                        <div>
                          <strong>Date:</strong>{" "}
                          {new Date(approval.timestamp).toLocaleString()}
                        </div>
                        {approval.digitalSignature && (
                          <Box mt={2}>
                            <Typography variant="body2" fontWeight="bold">
                              Digital Signature:
                            </Typography>
                            <img
                              src={approval.digitalSignature}
                              alt="Digital Signature"
                              style={{
                                marginTop: 4,
                                border: "1px solid #ccc",
                                borderRadius: 4,
                                width: 192,
                              }}
                            />
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        ) : (
          <Typography color="textSecondary">No approvals yet.</Typography>
        )}
      </Box>

      {/* Decision Buttons */}
      {currentUser === "AR_Campus" && (
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
  );
};

export default ARCampusDecision;
