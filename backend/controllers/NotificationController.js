// controllers/notificationController.js
const Notification = require('../models/NotificationModel');

const createNotification = async (req, res) => {
  const { memoId, role, message } = req.body;

  try {
    const newNotification = await Notification.create({ memoId, role, message });
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
};


const getNotificationsByRole = async (req, res) => {
  const { role } = req.params;

  try {
    const notifications = await Notification.find({ role }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Failed to fetch notifications by role:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// DELETE notification by memoId
const deleteNotificationByMemoId = async (req, res) => {
  try {
    const { memoId } = req.params;

    const result = await Notification.deleteMany({ memoId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No notifications found for this memoId" });
    }

    res.status(200).json({ message: "Notification(s) deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { 
  createNotification,
  getNotificationsByRole,
  deleteNotificationByMemoId
 };
