/**
 * Notifications Service
 * مدیریت اعلان‌ها
 */

class NotificationsService {
    /**
     * Get All Notifications
     */
    async getNotifications(filters = {}) {
        try {
            const response = await apiService.get(
                API_CONFIG.ENDPOINTS.NOTIFICATIONS.LIST,
                {
                    page: filters.page || 1,
                    limit: filters.limit || 20,
                    unreadOnly: filters.unreadOnly || false,
                }
            );

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در دریافت اعلان‌ها',
            };
        }
    }

    /**
     * Mark Notification as Read
     */
    async markAsRead(notificationId) {
        try {
            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.NOTIFICATIONS.READ,
                { id: notificationId }
            );
            
            const response = await apiService.post(endpoint);
            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در علامت‌گذاری اعلان',
            };
        }
    }

    /**
     * Mark All Notifications as Read
     */
    async markAllAsRead() {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.NOTIFICATIONS.READ_ALL
            );
            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در علامت‌گذاری همه اعلان‌ها',
            };
        }
    }

    /**
     * Delete Notification
     */
    async deleteNotification(notificationId) {
        try {
            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.NOTIFICATIONS.DELETE,
                { id: notificationId }
            );
            
            const response = await apiService.delete(endpoint);
            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در حذف اعلان',
            };
        }
    }

    /**
     * Get Unread Count
     */
    async getUnreadCount() {
        try {
            const response = await this.getNotifications({ 
                unreadOnly: true, 
                limit: 1 
            });
            
            return response.success ? response.data.total : 0;
        } catch (error) {
            return 0;
        }
    }
}

// Create singleton instance
const notificationsService = new NotificationsService();