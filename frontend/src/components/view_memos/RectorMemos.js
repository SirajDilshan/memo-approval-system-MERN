import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Box,
  Switch,
  FormControlLabel,
} from "@mui/material";

const RectorMemos = () => {
  const [loading, setLoading] = useState(true);
  const { setActiveView, setMemos, setViewId } = useAuth();
  const [allMemos, setAllMemos] = useState([]);
  const [filteredMemos, setFilteredMemos] = useState([]);
  const [onlyARApproved, setOnlyARApproved] = useState(false); // default: show all

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/memos/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMemos(response.data);
        setAllMemos(response.data);
        filterMemos(response.data, onlyARApproved);
      } catch (error) {
        console.error("Error fetching memos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemos();
  }, [setMemos,onlyARApproved]);

  const filterMemos = (memos, filterARApproved) => {
    if (filterARApproved) {
      const filtered = memos.filter(
        (memo) => memo.status === "Approved by AR Campus"
      );
      setFilteredMemos(filtered);
    } else {
      setFilteredMemos(memos);
    }
  };

  const handleToggleChange = () => {
    const newState = !onlyARApproved;
    setOnlyARApproved(newState);
    filterMemos(allMemos, newState);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Finalized":
      case "Approved":
      case "Approved by Head":
      case "Approved by AR Campus":
        return "green";
      case "Rejected":
        return "red";
      case "Pending":
      case "Under Review":
        return "orange";
      default:
        return "gray";
    }
  };

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Memo Status
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={onlyARApproved}
              onChange={handleToggleChange}
              color="primary"
            />
          }
          label="Only Show 'Approved by AR Campus'"
        />
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Memo Id</strong></TableCell>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Created By</strong></TableCell>
              <TableCell><strong>Campus Decision</strong></TableCell>
              <TableCell><strong>Created At</strong></TableCell>
              <TableCell><strong>Updated At</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredMemos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No memos match the selected filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredMemos.map((memo) => (
                <TableRow key={memo._id} hover>
                  <TableCell>{memo.memo_id}</TableCell>
                  <TableCell>{memo.title}</TableCell>
                  <TableCell style={{ color: getStatusColor(memo.status), fontWeight: 600 }}>
                    {memo.status}
                  </TableCell>
                  <TableCell>
                    {memo.createdBy?.email} ({memo.createdBy?.role})
                  </TableCell>
                  <TableCell>{memo.campusBoardDecision || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(memo.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(memo.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => {
                        setViewId(memo._id);
                        setActiveView("viewarsigned");
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default RectorMemos;
