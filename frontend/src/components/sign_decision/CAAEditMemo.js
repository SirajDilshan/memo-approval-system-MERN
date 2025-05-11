import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import SignaturePad from "./SignaturePad";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
} from "@mui/material";

const CAAEditMemo = () => {
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
  const [title, setTitle] = useState("");
  const [memo_id, setMemo_id] = useState("");
  const [content, setContent] = useState("");
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
      <Box p={4}>
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
        `http://localhost:5000/api/memos/signAR2/${selectedMemo._id}`,
        {memo_id, title, content, digitalSignature },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Memo signed and submitted successfully!");
      setTimeout(() => {
        setActiveView("campuslevelmemos");
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
    const role = "CAA_Faculty";
    const message = caaMessage;

    try {
      await axios.post(
        "http://localhost:5000/api/notifications/create",
        { memoId, role, message },
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
      setActiveView("campuslevelmemos");
    } catch (error) {
      console.error("Failed to send notification:", error);
      setMessage("Error notifying CAA.");
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
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
          label="Title"
          fullWidth
          required
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Content"
          fullWidth
          required
          margin="normal"
          multiline
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {message && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}

        {!showSignaturePad && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSignClick}
            sx={{ mt: 3 }}
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
              placeholder="Enter notification message..."
              value={caaMessage}
              onChange={(e) => setCaaMessage(e.target.value)}
            />
            <Button
              variant="contained"
              color="warning"
              onClick={handleNotify}
              sx={{ mt: 2 }}
            >
              Notify CAA
            </Button>
          </Box>
        )}

        {showSignaturePad && (
          <>
            <Box mt={3}>
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

export default CAAEditMemo;
