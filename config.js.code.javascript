/**
 * API Configuration File
 * کاویان توسعه معدن - تنظیمات اتصال به Backend
 */

const API_CONFIG = {
    // Base URL - آدرس سرور Backend
    BASE_URL: 'https://api.kavian-mining.com',
    
    // Alternative for Development
    DEV_URL: 'http://localhost:3000',
    
    // Current Environment
    ENV: 'production', // 'development' | 'production'
    
    // API Version
    API_VERSION: 'v1',
    
    // Timeout (milliseconds)
    TIMEOUT: 30000,
    
    // Endpoints
    ENDPOINTS: {
        // Authentication
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout',
            REFRESH_TOKEN: '/auth/refresh',
            FORGOT_PASSWORD: '/auth/forgot-password',
            RESET_PASSWORD: '/auth/reset-password',
            VERIFY_EMAIL: '/auth/verify-email',
            SOCIAL_LOGIN: '/auth/social',
        },
        
        // User Management
        USER: {
            PROFILE: '/user/profile',
            UPDATE_PROFILE: '/user/update',
            CHANGE_PASSWORD: '/user/change-password',
            UPLOAD_AVATAR: '/user/avatar',
            DELETE_ACCOUNT: '/user/delete',
        },
        
        // Projects
        PROJECTS: {
            LIST: '/projects',
            CREATE: '/projects/create',
            GET: '/projects/:id',
            UPDATE: '/projects/:id',
            DELETE: '/projects/:id',
            STATISTICS: '/projects/statistics',
        },
        
        // Blog
        BLOG: {
            LIST: '/blog',
            GET: '/blog/:id',
            CREATE: '/blog/create',
            UPDATE: '/blog/:id',
            DELETE: '/blog/:id',
            CATEGORIES: '/blog/categories',
            SEARCH: '/blog/search',
        },
        
        // Services
        SERVICES: {
            LIST: '/services',
            GET: '/services/:id',
            REQUEST: '/services/request',
        },
        
        // Contact
        CONTACT: {
            SEND: '/contact/send',
            CONSULTATION: '/contact/consultation',
        },
        
        // Notifications
        NOTIFICATIONS: {
            LIST: '/notifications',
            READ: '/notifications/:id/read',
            READ_ALL: '/notifications/read-all',
            DELETE: '/notifications/:id',
        },
        
        // Files
        FILES: {
            UPLOAD: '/files/upload',
            DOWNLOAD: '/files/:id',
            DELETE: '/files/:id',
        },
    },
    
    // Headers
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
};

/**
 * Get Full API URL
 */
function getApiUrl() {
    const baseUrl = API_CONFIG.ENV === 'production' 
        ? API_CONFIG.BASE_URL 
        : API_CONFIG.DEV_URL;
    return `${baseUrl}/api/${API_CONFIG.API_VERSION}`;
}

/**
 * Get Auth Token from LocalStorage
 */
function getAuthToken() {
    const userData = localStorage.getItem('kavianUser');
    if (userData) {
        const user = JSON.parse(userData);
        return user.token || null;
    }
    return null;
}

/**
 * Set Auth Token
 */
function setAuthToken(token) {
    const userData = localStorage.getItem('kavianUser');
    if (userData) {
        const user = JSON.parse(userData);
        user.token = token;
        localStorage.setItem('kavianUser', JSON.stringify(user));
    }
}

/**
 * Clear Auth Token
 */
function clearAuthToken() {
    localStorage.removeItem('kavianUser');
}

/**
 * Build Headers with Auth Token
 */
function buildHeaders(customHeaders = {}) {
    const headers = { ...API_CONFIG.HEADERS, ...customHeaders };
    const token = getAuthToken();
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}

/**
 * Replace URL Parameters
 * Example: /projects/:id -> /projects/123
 */
function replaceUrlParams(url, params = {}) {
    let finalUrl = url;
    Object.keys(params).forEach(key => {
        finalUrl = finalUrl.replace(`:${key}`, params[key]);
    });
    return finalUrl;
}