/**
 * Contact Service
 * مدیریت فرم‌های تماس و درخواست مشاوره
 */

class ContactService {
    /**
     * Send Contact Form
     */
    async sendContactForm(formData) {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.CONTACT.SEND,
                {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: formData.subject,
                    message: formData.message,
                }
            );

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در ارسال پیام',
            };
        }
    }

    /**
     * Request Consultation
     */
    async requestConsultation(consultationData) {
        try {
            const response = await apiService.post(
                API_CONFIG.ENDPOINTS.CONTACT.CONSULTATION,
                {
                    name: consultationData.name,
                    email: consultationData.email,
                    phone: consultationData.phone,
                    company: consultationData.company,
                    serviceType: consultationData.serviceType,
                    projectDetails: consultationData.projectDetails,
                    preferredDate: consultationData.preferredDate,
                    preferredTime: consultationData.preferredTime,
                }
            );

            return response;
        } catch (error) {
            return {
                success: false,
                error: 'خطا در ثبت درخواست مشاوره',
            };
        }
    }
}

// Create singleton instance
const contactService = new ContactService();