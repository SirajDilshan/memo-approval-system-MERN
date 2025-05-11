import { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
} from "@mui/material";

const MemoForm = () => {
  const [memo, setMemo] = useState({
    memo_id: "",
    title: "",
    content: "",
  });

  const [type, setType] = useState("DCS"); // DCS or DPS
  const [number, setNumber] = useState(""); // 01 to 99
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  // Auto-generate memo_id when type or number changes
  useEffect(() => {
    generateMemoId();
  }, [type, number]);

  const generateMemoId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const num = String(Number(number)).padStart(2, "0");

    if (!isNaN(number) && number !== "") {
      const newId = `TC/FAS/FB/${year}/${month}/${type}${num}`;
      setMemo((prev) => ({ ...prev, memo_id: newId }));
    } else {
      setMemo((prev) => ({ ...prev, memo_id: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMemo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/memos/create",
        memo,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      console.log("Memo submitted:", response.data);
      setMessage("✅ Memo created successfully!");
      setIsError(false);
      setMemo({ memo_id: "", title: "", content: "" });
      setNumber("");
      setType("DCS");

      setTimeout(() => {
        setMessage(null);
      }, 2000);
    } catch (error) {
      console.error("Error submitting memo:", error);
      setMessage("❌ Id already exists.");
      setIsError(true);
      setTimeout(() => {
        setMessage(null);
      }, 2000);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "600px",
        margin: "auto",
        padding: "2rem",
        boxShadow: 3,
        borderRadius: "8px",
        backgroundColor: "white",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Create Memo
      </Typography>

      {message && (
        <Alert severity={isError ? "error" : "success"} sx={{ marginBottom: "1rem" }}>
          {message}
        </Alert>
      )}

      {/* Memo ID Display (read-only) */}
      <TextField
        label="Memo ID"
        name="memo_id"
        value={memo.memo_id}
        fullWidth
        InputProps={{ readOnly: true }}
        variant="outlined"
        sx={{ marginBottom: "1rem" }}
      />

      {/* Dropdown for DCS/DPS */}
      <TextField
        select
        label="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        fullWidth
        variant="outlined"
        sx={{ marginBottom: "1rem" }}
      >
        <MenuItem value="DCS">DCS</MenuItem>
        <MenuItem value="DPS">DPS</MenuItem>
      </TextField>

      {/* Two-digit Number */}
      <TextField
        label="Number (01-99)"
        value={number}
        onChange={(e) => {
          const val = e.target.value;
          if (/^\d{0,2}$/.test(val)) setNumber(val);
        }}
        fullWidth
        variant="outlined"
        sx={{ marginBottom: "1rem" }}
      />

      {/* Title and Content */}
      <TextField
        label="Title"
        name="title"
        value={memo.title}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        sx={{ marginBottom: "1rem" }}
      />

      <TextField
        label="Content"
        name="content"
        value={memo.content}
        onChange={handleChange}
        fullWidth
        multiline
        rows={5}
        variant="outlined"
        sx={{ marginBottom: "1rem" }}
      />

      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        sx={{
          padding: "0.75rem 2rem",
          fontSize: "1rem",
          "&:hover": {
            backgroundColor: "#1d4ed8",
          },
        }}
      >
        Submit to Head
      </Button>
    </Box>
  );
};

export default MemoForm;
