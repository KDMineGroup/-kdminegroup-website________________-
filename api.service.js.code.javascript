/**
 * API Service - HTTP Request Handler
 * کاویان توسعه معدن
 */

class ApiService {
    constructor() {
        this.baseUrl = getApiUrl();
        this.timeout = API_CONFIG.TIMEOUT;
    }

    /**
     * Generic HTTP Request
     */
    async request(method, endpoint, data = null, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = buildHeaders(options.headers || {});
        
        const config = {
            method: method.toUpperCase(),
            headers: headers,
            signal: this.createAbortSignal(),
        };

        // Add body for POST, PUT, PATCH
        if (data && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, config);
            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * GET Request
     */
    async get(endpoint, params = {}, options = {}) {
        const queryString = this.buildQueryString(params);
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;
        return this.request('GET', url, null, options);
    }

    /**
     * POST Request
     */
    async post(endpoint, data, options = {}) {
        return this.request('POST', endpoint, data, options);
    }

    /**
     * PUT Request
     */
    async put(endpoint, data, options = {}) {
        return this.request('PUT', endpoint, data, options);
    }

    /**
     * PATCH Request
     */
    async patch(endpoint, data, options = {}) {
        return this.request('PATCH', endpoint, data, options);
    }

    /**
     * DELETE Request
     */
    async delete(endpoint, options = {}) {
        return this.request('DELETE', endpoint, null, options);
    }

    /**
     * Upload File
     */
    async uploadFile(endpoint, file, additionalData = {}) {
        const formData = new FormData();
        formData.append('file', file);
        
        Object.keys(additionalData).forEach(key => {
            formData.append(key, additionalData[key]);
        });

        const headers = buildHeaders();
        delete headers['Content-Type']; // Let browser set it

        const url = `${this.baseUrl}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: formData,
            });
            return await this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Download File
     */
    async downloadFile(endpoint, filename) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = buildHeaders();

        try {
            const response = await fetch(url, { headers });
            
            if (!response.ok) {
                throw new Error('Download failed');
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

            return { success: true };
        } catch (error) {
            return this.handleError(error);
        }
    }

    /**
     * Handle Response
     */
    async handleResponse(response) {
        const contentType = response.headers.get('content-type');
        
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            // Handle specific error codes
            if (response.status === 401) {
                this.handleUnauthorized();
            }
            
            throw {
                status: response.status,
                message: data.message || 'خطا در برقراری ارتباط با سرور',
                data: data,
            };
        }

        return {
            success: true,
            data: data,
            status: response.status,
        };
    }

    /**
     * Handle Error
     */
    handleError(error) {
        console.error('API Error:', error);

        if (error.name === 'AbortError') {
            return {
                success: false,
                error: 'درخواست لغو شد',
                code: 'TIMEOUT',
            };
        }

        return {
            success: false,
            error: error.message || 'خطای غیرمنتظره رخ داد',
            status: error.status || 500,
            data: error.data || null,
        };
    }

    /**
     * Handle Unauthorized (401)
     */
    handleUnauthorized() {
        clearAuthToken();
        window.location.href = '/auth.html?redirect=' + encodeURIComponent(window.location.pathname);
    }

    /**
     * Create Abort Signal for Timeout
     */
    createAbortSignal() {
        const controller = new AbortController();
        setTimeout(() => controller.abort(), this.timeout);
        return controller.signal;
    }

    /**
     * Build Query String from Object
     */
    buildQueryString(params) {
        return Object.keys(params)
            .filter(key => params[key] !== null && params[key] !== undefined)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
    }
}

// Create singleton instance
const apiService = new ApiService();