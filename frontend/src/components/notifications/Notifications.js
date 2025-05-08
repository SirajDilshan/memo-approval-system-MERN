import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
  const {
    currentUser,
    setViewId,
    setActiveView,
    setMemos,
    setNotificationCount,
    deleteNotificationByMemoId,
  } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchMemos = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/memos/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMemos(response.data);
      } catch (error) {
        console.error("Error fetching memos:", error);
      } finally {
      }
    };

    fetchMemos();
  }, []);

  useEffect(() => {
    let intervalId;

    const fetchNotifications = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/notifications/role/${currentUser}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotifications(res.data);
        setNotificationCount(res.data.length);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    if (currentUser) {
      fetchNotifications(); // initial fetch
      intervalId = setInterval(fetchNotifications, 4000); // fetch every 5 sec
    }

    return () => clearInterval(intervalId); // clean up
  }, [currentUser]);

  return (
    <div className="p-4 space-y-4">
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications available.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((note) => (
            <li
              key={note._id}
              className="p-4 bg-white rounded shadow border border-gray-200"
            >
              <p>{note.message}</p>
              <p>{new Date(note.createdAt).toLocaleString()}</p>

              <button
                onClick={() => {
                  setViewId(note.memoId);
                  deleteNotificationByMemoId(note.memoId);
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
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View Memo
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
