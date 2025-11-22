/**
 * Notification Model
 */

const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: [
            'project_update',
            'project_comment',
            'team_invite',
            'blog_comment',
            'blog_like',
            'system',
            'other',
        ],
        required: true,
    },
    title: {
        type: String,
        required: [true, 'عنوان اعلان الزامی است'],
        maxlength: [200, 'عنوان نمی‌تواند بیشتر از 200 کاراکتر باشد'],
    },
    message: {
        type: String,
        required: [true, 'پیام اعلان الزامی است'],
        maxlength: [500, 'پیام نمی‌تواند بیشتر از 500 کاراکتر باشد'],
    },
    link: String,
    icon: String,
    isRead: {
        type: Boolean,
        default: false,
    },
    readAt: Date,
    data: mongoose.Schema.Types.Mixed,
}, {
    timestamps: true,
});

// Indexes
NotificationSchema.index({ user: 1, isRead: 1 });
NotificationSchema.index({ createdAt: -1 });

// Static method to create notification
NotificationSchema.statics.createNotification = async function(data) {
    return await this.create(data);
};

// Static method to mark as read
NotificationSchema.statics.markAsRead = async function(notificationId, userId) {
    return await this.findOneAndUpdate(
        { _id: notificationId, user: userId },
        { isRead: true, readAt: Date.now() },
        { new: true }
    );
};

// Static method to mark all as read
NotificationSchema.statics.markAllAsRead = async function(userId) {
    return await this.updateMany(
        { user: userId, isRead: false },
        { isRead: true, readAt: Date.now() }
    );
};

module.exports = mongoose.model('Notification', NotificationSchema);