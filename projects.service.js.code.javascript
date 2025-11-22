/**
 * Projects Service
 * مدیریت پروژه‌ها
 */

class ProjectsService {
    /**
     * Get All Projects
     */
    async getProjects(filters = {}) {
        try {
            const response = await apiService.get(
                API_CONFIG.ENDPOINTS.PROJECTS.LIST,
                {
                    page: filters.page || 1,
                    limit: filters.limit || 10,
                    status: filters.status || '',
                    search: filters.search || '',
                    sortBy: filters.sortBy || 'createdAt',
                    order: filters.order || 'desc',
                }
            );

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در دریافت لیست پروژه‌ها',
            };
        }
    }

    /**
     * Get Single Project
     */
    async getProject(projectId) {
        try {
            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.PROJECTS.GET,
                { id: projectId }
            );
            
            const response = await apiService.get(endpoint);
            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در دریافت اطلاعات پروژه',
            };
        }
    }

    /**
     * Create New Project
     */
    async createProject(projectData) {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.PROJECTS.CREATE,
                projectData
            );

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در ایجاد پروژه',
            };
        }
    }

    /**
     * Update Project
     */
    async updateProject(projectId, updates) {
        try {
            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.PROJECTS.UPDATE,
                { id: projectId }
            );
            
            const response = await apiService.put(endpoint, updates);
            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در بروزرسانی پروژه',
            };
        }
    }

    /**
     * Delete Project
     */
    async deleteProject(projectId) {
        try {
            const endpoint = replaceUrlParams(
                API_CONFIG.ENDPOINTS.PROJECTS.DELETE,
                { id: projectId }
            );
            
            const response = await apiService.delete(endpoint);
            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در حذف پروژه',
            };
        }
    }

    /**
     * Get Project Statistics
     */
    async getStatistics() {
        try {
            const response = await apiService.get(
                API_CONFIG.ENDPOINTS.PROJECTS.STATISTICS
            );
            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در دریافت آمار پروژه‌ها',
            };
        }
    }
}

// Create singleton instance
const projectsService = new ProjectsService();