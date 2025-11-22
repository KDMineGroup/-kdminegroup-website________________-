/**
 * Authentication Service
 * مدیریت احراز هویت و توکن‌ها
 */

class AuthService {
    /**
     * Login User
     */
    async login(credentials) {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.AUTH.LOGIN,
                {
                    email: credentials.email,
                    password: credentials.password,
                    remember: credentials.remember || false,
                }
            );

            if (response.success) {
                this.saveUserData(response.data);
                return {
                    success: true,
                    message: 'ورود با موفقیت انجام شد',
                    user: response.data.user,
                };
            }

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در ورود به سیستم',
            };
        }
    }

    /**
     * Register New User
     */
    async register(userData) {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.AUTH.REGISTER,
                {
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    password: userData.password,
                    userType: userData.userType,
                }
            );

            if (response.success) {
                this.saveUserData(response.data);
                return {
                    success: true,
                    message: 'ثبت‌نام با موفقیت انجام شد',
                    user: response.data.user,
                };
            }

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در ثبت‌نام',
            };
        }
    }

    /**
     * Logout User
     */
    async logout() {
        try {
            await apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearUserData();
            window.location.href = '/index.html';
        }
    }

    /**
     * Social Login (Google, LinkedIn)
     */
    async socialLogin(provider, token) {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.AUTH.SOCIAL_LOGIN,
                {
                    provider: provider,
                    token: token,
                }
            );

            if (response.success) {
                this.saveUserData(response.data);
                return {
                    success: true,
                    message: 'ورود با موفقیت انجام شد',
                    user: response.data.user,
                };
            }

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در ورود با ' + provider,
            };
        }
    }

    /**
     * Refresh Access Token
     */
    async refreshToken() {
        try {
            const userData = this.getUserData();
            if (!userData || !userData.refreshToken) {
                throw new Error('No refresh token');
            }

            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN,
                {
                    refreshToken: userData.refreshToken,
                }
            );

            if (response.success) {
                userData.token = response.data.token;
                userData.refreshToken = response.data.refreshToken;
                this.saveUserData(userData);
                return true;
            }

            return false;
        } catch (error) {
            this.clearUserData();
            return false;
        }
    }

    /**
     * Forgot Password
     */
    async forgotPassword(email) {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
                { email }
            );

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در ارسال ایمیل بازیابی',
            };
        }
    }

    /**
     * Reset Password
     */
    async resetPassword(token, newPassword) {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD,
                {
                    token: token,
                    password: newPassword,
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
     * Verify Email
     */
    async verifyEmail(token) {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.AUTH.VERIFY_EMAIL,
                { token }
            );

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در تایید ایمیل',
            };
        }
    }

    /**
     * Check if User is Authenticated
     */
    isAuthenticated() {
        const userData = this.getUserData();
        return userData && userData.token;
    }

    /**
     * Get Current User
     */
    getCurrentUser() {
        const userData = this.getUserData();
        return userData ? userData.user : null;
    }

    /**
     * Save User Data to LocalStorage
     */
    saveUserData(data) {
        const userData = {
            user: data.user,
            token: data.token,
            refreshToken: data.refreshToken,
            loginTime: new Date().toISOString(),
        };
        localStorage.setItem('kavianUser', JSON.stringify(userData));
    }

    /**
     * Get User Data from LocalStorage
     */
    getUserData() {
        const data = localStorage.getItem('kavianUser');
        return data ? JSON.parse(data) : null;
    }

    /**
     * Clear User Data
     */
    clearUserData() {
        localStorage.removeItem('kavianUser');
    }

    /**
     * Update User Profile in LocalStorage
     */
    updateLocalProfile(updates) {
        const userData = this.getUserData();
        if (userData) {
            userData.user = { ...userData.user, ...updates };
            localStorage.setItem('kavianUser', JSON.stringify(userData));
        }
    }
}

// Create singleton instance
const authService = new AuthService();