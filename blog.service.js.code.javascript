/**
 * Blog Service
 * مدیریت مقالات و بلاگ
 */

class BlogService {
    /**
     * Get All Blog Posts
     */
    async getPosts(filters = {}) {
        try {
            const response = await apiService.get(
                API_CONFIG.ENDPOINTS.BLOG.LIST,
                {
                    page: filters.page || 1,
                    limit: filters.limit || 12,
                    category: filters.category || '',
                    search: filters.search || '',
                    sortBy: filters.sortBy || 'createdAt',
                    order: filters.order || 'desc',
                }
            );

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در دریافت مقالات',
            };
        }
    }

    /**
     * Get Single Blog Post
     */
    async getPost(postId) {
        try {
            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.BLOG.GET,
                { id: postId }
            );
            
            const response = await apiService.get(endpoint);
            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در دریافت مقاله',
            };
        }
    }

    /**
     * Create New Post
     */
    async createPost(postData) {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.BLOG.CREATE,
                postData
            );

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در ایجاد مقاله',
            };
        }
    }

    /**
     * Update Post
     */
    async updatePost(postId, updates) {
        try {
            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.BLOG.UPDATE,
                { id: postId }
            );
            
            const response = await apiService.put(endpoint, updates);
            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در بروزرسانی مقاله',
            };
        }
    }

    /**
     * Delete Post
     */
    async deletePost(postId) {
        try {
            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.BLOG.DELETE,
                { id: postId }
            );
            
            const response = await apiService.delete(endpoint);
            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در حذف مقاله',
            };
        }
    }

    /**
     * Get Blog Categories
     */
    async getCategories() {
        try {
            const response = await apiService.get(
                API_CONFIG.ENDPOINTS.BLOG.CATEGORIES
            );
            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در دریافت دسته‌بندی‌ها',
            };
        }
    }

    /**
     * Search Posts
     */
    async searchPosts(query, filters = {}) {
        try {
            const response = await apiService.get(
                API_CONFIG.ENDPOINTS.BLOG.SEARCH,
                {
                    q: query,
                    category: filters.category || '',
                    page: filters.page || 1,
                    limit: filters.limit || 12,
                }
            );

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در جستجو',
            };
        }
    }
}

// Create singleton instance
const blogService = new BlogService();