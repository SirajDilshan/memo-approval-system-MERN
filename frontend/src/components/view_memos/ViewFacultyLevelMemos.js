import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Avatar
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import GeneratePdf from "../generate_pdf/GeneratePdf";

const ViewFacultyLevelMemos = () => {
  const { memos, viewId, setActiveView } = useAuth();
  const selectedMemo = memos?.find((memo) => memo._id === viewId);

  if (!selectedMemo) {
    return (
      <Box p={4} textAlign="center">
        <Typography variant="body1" color="text.secondary">
          No memo selected or memo not found.
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 900, mx: "auto", mt: 4, borderRadius: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Memo Details
      </Typography>

      {/* Memo Info */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Memo Id:</strong> {selectedMemo.memo_id}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Title:</strong> {selectedMemo.title}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Status:</strong> {selectedMemo.status}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Created By:</strong> {selectedMemo.createdBy?.email} ({selectedMemo.createdBy?.role})
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Created At:</strong> {new Date(selectedMemo.createdAt).toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Updated At:</strong> {new Date(selectedMemo.updatedAt).toLocaleString()}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body2">
            <strong>Faculty Decision:</strong> {selectedMemo.facultyBoardDecision || "Pending"}
          </Typography>
        </Grid>
      </Grid>

      {/* Content */}
      <Box mt={4}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Content
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, whiteSpace: "pre-wrap", backgroundColor: "#f9f9f9" }}>
          <Typography variant="body2" color="text.primary">
            {selectedMemo.content}
          </Typography>
        </Paper>
      </Box>

      {/* Approval History */}
      <Box mt={4}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Approval History
        </Typography>
        {selectedMemo.approvals && selectedMemo.approvals.length > 0 ? (
          <Box display="flex" flexDirection="column" gap={2}>
            {selectedMemo.approvals.map((approval, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2">
                  <strong>Role:</strong> {approval.role}
                </Typography>
                <Typography variant="body2">
                  <strong>Date:</strong> {new Date(approval.timestamp).toLocaleString()}
                </Typography>
                {approval.digitalSignature && (
                  <Box mt={2}>
                    <Typography variant="body2" fontWeight="bold">
                      Signature:
                    </Typography>
                    <Avatar
                      variant="square"
                      src={approval.digitalSignature}
                      alt="Digital Signature"
                      sx={{ mt: 1, width: 150, height: "auto", border: "1px solid #ccc" }}
                    />
                  </Box>
                )}
              </Paper>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No approvals yet.
          </Typography>
        )}
      </Box>

      {/* OK Button */}
      <Box mt={4} display="flex" justifyContent="flex-end">
    <GeneratePdf />
        <Button
          variant="contained"
          color="success"
          onClick={() => setActiveView("approvedByHead")}
        >
          OK
        </Button>
      </Box>
    </Paper>
  );
};

export default ViewFacultyLevelMemos;
