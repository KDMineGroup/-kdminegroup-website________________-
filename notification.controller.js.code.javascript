/**
 * Notification Controller
 */

const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all notifications
// @route   GET /api/v1/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const query = { user: req.user._id };

    if (unreadOnly === 'true') {
        query.isRead = false;
    }

    const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

    const count = await Notification.countDocuments(query);

    res.status(200).json({
        success: true,
        data: {
            notifications,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit),
            },
        },
    });
});

// @desc    Mark notification as read
// @route   POST /api/v1/notifications/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
    const notification = await Notification.markAsRead(
        req.params.id,
        req.user._id
    );

    if (!notification) {
        return next(new ErrorResponse('اعلان یافت نشد', 404));
    }

    res.status(200).json({
        success: true,
        message: 'اعلان به عنوان خوانده شده علامت‌گذاری شد',
        data: notification,
    });
});

// @desc    Mark all notifications as read
// @route   POST /api/v1/notifications/read-all
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
    await Notification.markAllAsRead(req.user._id);

    res.status(200).json({
        success: true,
        message: 'همه اعلان‌ها به عنوان خوانده شده علامت‌گذاری شدند',
    });
});

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
    const notification = await Notification.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id,
    });

    if (!notification) {
        return next(new ErrorResponse('اعلان یافت نشد', 404));
    }

    res.status(200).json({
        success: true,
        message: 'اعلان با موفقیت حذف شد',
        data: {},
    });
});

// @desc    Get unread count
// @route   GET /api/v1/notifications/unread-count
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res, next) => {
    const count = await Notification.countDocuments({
        user: req.user._id,
        isRead: false,
    });

    res.status(200).json({
        success: true,
        data: { count },
    });
});