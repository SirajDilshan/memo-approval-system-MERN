// routes/notificationRoutes.js
const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { createNotification , getNotificationsByRole , deleteNotificationByMemoId} = require('../controllers/NotificationController');

const router = express.Router();

router.post('/create', authMiddleware, createNotification);
router.get("/role/:role", authMiddleware, getNotificationsByRole);
router.delete("/delete/:memoId", authMiddleware, deleteNotificationByMemoId);

module.exports = router;
