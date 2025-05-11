import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button
} from "@mui/material";
import GeneratePdfButton from "../generate_pdf/GeneratePdf";
import GeneratePdf from "../generate_pdf/GeneratePdf";

const ViewCampusLevelMemo = () => {
  const {
    memos,
    viewId,
    setSignatureDataURL,
    setActiveView,
    currentUser,
  } = useAuth();

  const selectedMemo = memos?.find((memo) => memo._id === viewId);

  useEffect(() => {
    setSignatureDataURL(null);
  }, [viewId, setSignatureDataURL]);

  if (!selectedMemo) {
    return (
      <Box p={4} textAlign="center">
        <Typography color="textSecondary">
          No memo selected or memo not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="800px" mx="auto" mt={4} p={3} component={Paper} elevation={3}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Memo Details
      </Typography>

      {/* Memo Info */}
      <Grid container spacing={2} sx={{ fontSize: "0.95rem" }}>
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
          <strong>Campus Decision:</strong>{" "}
          {selectedMemo.campusBoardDecision || "Pending"}
        </Grid>
      </Grid>

      {/* Content */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Content
        </Typography>
        <Box
          bgcolor="#f5f5f5"
          p={2}
          borderRadius={1}
          sx={{ whiteSpace: "pre-wrap" }}
        >
          <Typography>{selectedMemo.content}</Typography>
        </Box>
      </Box>

      {/* Approval History */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Approval History
        </Typography>
        {selectedMemo.approvals && selectedMemo.approvals.length > 0 ? (
          <Box display="flex" flexDirection="column" gap={2}>
            {selectedMemo.approvals.map((approval, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                <Typography>
                  <strong>Role:</strong> {approval.role}
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
                    <img
                      src={approval.digitalSignature}
                      alt="Digital Signature"
                      style={{ marginTop: 8, border: "1px solid #ccc", borderRadius: 4, width: 192 }}
                    />
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        ) : (
          <Typography color="textSecondary">No approvals yet.</Typography>
        )}
      </Box>

      {/* Conditional Buttons */}
      <Box mt={4}>
        {currentUser === "AR_Faculty" && (
          <Button
            variant="contained"
            color="success"
            onClick={() => setActiveView("campuslevelmemos")}
          >
            OK
          </Button>
        )}
        {currentUser === "Dean_Faculty" && (
          <Button
            variant="contained"
            color="success"
            onClick={() => setActiveView("deanallmemos")}
          >
            OK
          </Button>
        )}
        {currentUser === "AR_Campus" && (
          <>
          <GeneratePdf />
          <Button
            variant="contained"
            color="success"
            onClick={() => setActiveView("arcampusmemos")}
          >
            OK
          </Button>
          </>
          
        )}
        {currentUser === "CAA_Faculty" && (
          <Button
            variant="contained"
            color="success"
            onClick={() => setActiveView("allMemosFacultycaa")}
          >
            OK
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ViewCampusLevelMemo;
