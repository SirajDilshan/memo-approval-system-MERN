import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import SignaturePad from "./SignaturePad";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

const HeadApprove = () => {
  const {
    memos,
    setActiveView,
    activeView,
    viewId,
    signatureDataURL,
    setSignatureDataURL,
    setCaaNotifications,
  } = useAuth();

  const [selectedMemo, setSelectedMemo] = useState(null);
  const [notifyToCaa, setNotifyToCaa] = useState(false);
  const [caaMessage, setCaaMessage] = useState("");
  const [memo_id, setMemo_id] = useState(selectedMemo?.memo_id || "");
  const [title, setTitle] = useState(selectedMemo?.title || "");
  const [content, setContent] = useState(selectedMemo?.content || "");
  const [message, setMessage] = useState("");
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  const digitalSignature = signatureDataURL;

  useEffect(() => {
    const memo = memos.find((m) => m._id === viewId);
    setSelectedMemo(memo);
    setMemo_id(memo?.memo_id || "");
    setTitle(memo?.title || "");
    setContent(memo?.content || "");
    setSignatureDataURL(null);
  }, [viewId, setSignatureDataURL, activeView, memos]);

  if (!selectedMemo) {
    return (
      <Box p={3}>
        <Typography color="textSecondary">No memo selected or memo not found.</Typography>
      </Box>
    );
  }

  const handleSignClick = () => {
    setShowSignaturePad(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:5000/api/memos/sign/${selectedMemo._id}`,
        { memo_id,title, content, digitalSignature },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Memo signed and submitted successfully!");
      setTimeout(() => {
        setActiveView("memos");
      }, 2000);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Error signing memo.";
      setMessage(errorMsg);
    }
  };

  const handleNotify = async () => {
    if (caaMessage.trim() === "") return;

    const token = sessionStorage.getItem("token");
    const memoId = viewId;
    const role = "CAA_Department";
    const message = caaMessage;

    try {
      await axios.post(
        "http://localhost:5000/api/notifications/create",
        {
          memoId,
          role,
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCaaNotifications((prev) => [...prev, message]);
      setMessage("CAA has been notified.");
      setCaaMessage("");
      setNotifyToCaa(false);
      setActiveView("memos");
    } catch (error) {
      console.error("Failed to send notification:", error);
      setMessage("Error notifying CAA.");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Approve Memo
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
                  label="Memo Id"
                  value={memo_id}
                  fullWidth
                  variant="outlined"
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ marginBottom: "1.5rem" }}
                />
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          multiline
          rows={6}
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          margin="normal"
          required
        />

        {message && (
          <Alert severity={message.includes("Error") ? "error" : "success"} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}

        {!showSignaturePad && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSignClick}
            sx={{ mt: 2 }}
          >
            Sign Memo
          </Button>
        )}

        <Button
          variant="text"
          color="warning"
          onClick={() => setNotifyToCaa(true)}
          sx={{ mt: 2, ml: 2 }}
        >
          Send notification to CAA
        </Button>

        {notifyToCaa && (
          <Box mt={2}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={caaMessage}
              onChange={(e) => setCaaMessage(e.target.value)}
              placeholder="Enter notification message..."
            />
            <Button
              variant="contained"
              color="warning"
              onClick={handleNotify}
              sx={{ mt: 1 }}
            >
              Notify CAA
            </Button>
          </Box>
        )}

        {showSignaturePad && (
          <>
            <Box mt={4}>
              <SignaturePad />
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="success"
              sx={{ mt: 3 }}
            >
              Submit Signed Memo
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
};

export default HeadApprove;
