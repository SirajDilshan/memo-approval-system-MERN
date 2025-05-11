import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";

const EditMemoFacultyCAA = () => {
  const { memos, viewId, setActiveView, activeView } = useAuth();
  const [selectedMemo, setSelectedMemo] = useState(null);
  const [memo_id, setMemoId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  // Load selected memo and generate memo_id
  useEffect(() => {
    const memo = memos.find((m) => m._id === viewId);
    setSelectedMemo(memo);

    if (memo) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");

      // Extract type and number from the original memo_id
      const type = memo?.memo_id?.match(/[A-Z]+/)?.[0] || "CIR";
      const num = memo?.memo_id?.match(/\d+$/)?.[0] || "001";

      const generatedMemoId = `TC/FAS/FB/${year}/${month}/${type}${num}`;

      setMemoId(generatedMemoId);
      setTitle(memo.title || "");
      setContent(memo.content || "");
    }
  }, [viewId, activeView, memos]);

  if (!selectedMemo) {
    return (
      <Box sx={{ padding: "2rem", textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          No memo selected or memo not found.
        </Typography>
      </Box>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/memos/edit/${selectedMemo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, content }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Memo updated successfully!");
        setTimeout(() => {
          setActiveView("facultycaacreatedmemos");
        }, 1000);

        // ✅ Send notification to AR_Faculty
        await axios.post(
          "http://localhost:5000/api/notifications/create",
          {
            memoId: viewId,
            role: "AR_Faculty",
            message: `Memo Updated : ${title}`,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        setMessage(data.message || "Failed to update memo.");
      }
    } catch (error) {
      setMessage("Error updating memo.");
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "white",
        boxShadow: 3,
        borderRadius: "16px",
        padding: "2rem",
        maxWidth: "600px",
        margin: "auto",
        marginTop: "3rem",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Edit Memo
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Memo Id"
          value={memo_id}
          fullWidth
          variant="outlined"
          required
          InputProps={{ readOnly: true }}
          sx={{ marginBottom: "1.5rem" }}
        />

        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          variant="outlined"
          required
          sx={{ marginBottom: "1.5rem" }}
        />

        <TextField
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          multiline
          rows={6}
          variant="outlined"
          required
          sx={{ marginBottom: "1.5rem" }}
        />

        {message && (
          <Alert severity="success" sx={{ marginBottom: "1rem" }}>
            {message}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{
            padding: "0.75rem 2rem",
            fontSize: "1rem",
            "&:hover": {
              backgroundColor: "#1976d2",
            },
          }}
        >
          Update Memo
        </Button>
      </form>
    </Box>
  );
};

export default EditMemoFacultyCAA;
