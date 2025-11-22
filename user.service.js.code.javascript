/**
 * User Service
 * مدیریت پروفایل کاربر
 */

class UserService {
    /**
     * Get User Profile
     */
    async getProfile() {
        try {
            const response = await apiService.get(
                API_CONFIG.ENDPOINTS.USER.PROFILE
            );

            if (response.success) {
                authService.updateLocalProfile(response.data);
            }

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در دریافت اطلاعات پروفایل',
            };
        }
    }

    /**
     * Update User Profile
     */
    async updateProfile(updates) {
        try {
            const response = await apiService.put(
                API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE,
                updates
            );

            if (response.success) {
                authService.updateLocalProfile(response.data);
            }

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در بروزرسانی پروفایل',
            };
        }
    }

    /**
     * Change Password
     */
    async changePassword(currentPassword, newPassword) {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.USER.CHANGE_PASSWORD,
                {
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                }
            );

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در تغییر رمز عبور',
            };
        }
    }

    /**
     * Upload Avatar
     */
    async uploadAvatar(file) {
        try {
            const response = await apiService.uploadFile(
                API_CONFIG.ENDPOINTS.USER.UPLOAD_AVATAR,
                file
            );

            if (response.success) {
                authService.updateLocalProfile({ avatar: response.data.url });
            }

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در آپلود تصویر',
            };
        }
    }

    /**
     * Delete Account
     */
    async deleteAccount(password) {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.USER.DELETE_ACCOUNT,
                { password }
            );

            if (response.success) {
                authService.clearUserData();
                window.location.href = '/index.html';
            }

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در حذف حساب کاربری',
            };
        }
    }
}

// Create singleton instance
const userService = new UserService();