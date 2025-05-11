import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton
} from "@mui/material";

const Notifications = () => {
  const {
    currentUser,
    setViewId,
    setActiveView,
    setMemos,
    deleteNotificationByMemoId,setShowNotifications,notifications
  } = useAuth();
const [allMemos, setAllMemos]= useState([]);

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/memos/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

setAllMemos(response.data);
        setMemos(response.data);
      } catch (error) {
        console.error("Error fetching memos:", error);
      }
    };

    fetchMemos();
  }, [setMemos]);



  return (
    < Box>
      {notifications.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No notifications
        </Typography>
      ) : (
        <List>
          {notifications.map((note) => {
  // Find the corresponding memo based on the _id
  const relatedMemo = allMemos.find((memo) => memo._id === note.memoId);

  return (
    <ListItem key={note._id} sx={{ mb: 2 }}>
  <Card
    sx={{
      width: "100%",
      borderRadius: 2,
      background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
      border: "1px solid #90caf9",
      boxShadow: 3,
    }}
  >
    <CardContent>
      {relatedMemo && (
        <Typography variant="body2" color="textSecondary">
          {relatedMemo.memo_id}
        </Typography>
      )}
      <Typography variant="body1">{note.message}</Typography>

      <Typography variant="body2" color="textSecondary">
        {new Date(note.createdAt).toLocaleString()}
      </Typography>

      <ListItemButton
        onClick={() => {
          setViewId(note.memoId);
          deleteNotificationByMemoId(note.memoId);
          setShowNotifications(false);
          if (currentUser === "Head_Department") {
            setActiveView("signMemo");
          }
          if (currentUser === "CAA_Department") {
            setActiveView("editMemo");
          }
          if (currentUser === "AR_Faculty") {
            setActiveView("EditMemoFaculty");
          }
          if (currentUser === "CAA_Faculty") {
            setActiveView("caaeditmemo");
          }
        }}
        sx={{
          mt: 2,
          px: 3,
          py: 1,
          backgroundColor: "primary.main",
          color: "white",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
      >
        View Memo
      </ListItemButton>
    </CardContent>
  </Card>
</ListItem>

  );
})}

        </List>
      )}
    </ Box>
  );
};

export default Notifications;
