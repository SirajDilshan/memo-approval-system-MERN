import React, { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import SignaturePad from "./SignaturePad";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
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
      <Box p={4} textAlign="center">
        <Typography variant="body1" color="textSecondary">
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
        `http://localhost:5000/api/memos/signDean/${selectedMemo._id}`,
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
      setActiveView("viewarsigned");
    } catch (error) {
      console.error("Error approving memo:", error);
      alert("An error occurred while approving the memo.");
    }
  };

  return (
    <Box maxWidth="lg" mx="auto" mt={6}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Memo Details
          </Typography>

          <Grid container spacing={2} sx={{ fontSize: 14 }}>
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
          <Box
            sx={{
              backgroundColor: "#f9f9f9",
              padding: 2,
              borderRadius: 1,
              whiteSpace: "pre-wrap",
              fontSize: 14,
            }}
          >
            {selectedMemo.content}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Approval History
          </Typography>

          {selectedMemo.approvals && selectedMemo.approvals.length > 0 ? (
            <List>
              {selectedMemo.approvals.map((approval, index) => (
                <ListItem
                  key={index}
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 1,
                    mb: 2,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <ListItemText
                    primary={
                      <>
                        <div>
                          <strong>Role:</strong> {approval.role}
                        </div>
                        <div>
                          <strong>Approved By:</strong> {approval.approvedBy}
                        </div>
                        <div>
                          <strong>Date:</strong>{" "}
                          {new Date(approval.timestamp).toLocaleString()}
                        </div>
                        {approval.digitalSignature && (
                          <Box mt={1}>
                            <strong>Digital Signature:</strong>
                            <Box
                              component="img"
                              src={approval.digitalSignature}
                              alt="Signature"
                              sx={{
                                mt: 1,
                                width: 200,
                                border: "1px solid #ccc",
                                borderRadius: 1,
                              }}
                            />
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No approvals yet.
            </Typography>
          )}

          {currentUser === "Dean_Faculty" && (
            <Box mt={4}>
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
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewMemo;
