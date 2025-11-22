/**
 * Notification Routes
 */

const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,
} = require('../controllers/notification.controller');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// @route   GET /api/v1/notifications
router.get('/', getNotifications);

// @route   GET /api/v1/notifications/unread-count
router.get('/unread-count', getUnreadCount);

// @route   POST /api/v1/notifications/:id/read
router.post('/:id/read', markAsRead);

// @route   POST /api/v1/notifications/read-all
router.post('/read-all', markAllAsRead);

// @route   DELETE /api/v1/notifications/:id
router.delete('/:id', deleteNotification);

module.exports = router;