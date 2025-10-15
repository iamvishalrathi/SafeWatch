// API Service for SheSafe Backend
// Centralized API calls for all backend endpoints

import axiosInstance from './axiosInstance';

/**
 * API Service Object
 * Contains methods for all backend endpoints
 */
const API = {
    // Base URL for direct fetch calls (for streaming endpoints)
    BASE_URL: 'http://localhost:5000',

    /**
     * GET /alerts
     * Retrieves the 10 most recent safety alerts
     * @returns {Promise<Array>} Array of alert objects
     */
    getAlerts: async () => {
        try {
            const response = await axiosInstance.get('/alerts');
            return response.data;
        } catch (error) {
            console.error('Error fetching alerts:', error);
            throw error;
        }
    },

    /**
     * GET /screenshots
     * Retrieves the 10 most recent alerts with screenshots available
     * @returns {Promise<Array>} Array of alert objects with screenshots
     */
    getScreenshots: async () => {
        try {
            const response = await axiosInstance.get('/screenshots');
            return response.data;
        } catch (error) {
            console.error('Error fetching screenshots:', error);
            throw error;
        }
    },

    /**
     * GET /gender_count
     * Gets current real-time gender count
     * @returns {Promise<Object>} Object with male and female counts
     */
    getGenderCount: async () => {
        try {
            const response = await axiosInstance.get('/gender_count');
            return response.data;
        } catch (error) {
            console.error('Error fetching gender count:', error);
            throw error;
        }
    },

    /**
     * GET /alert_image/<alert_id>
     * Gets the image URL for a specific alert
     * @param {number} alertId - The ID of the alert
     * @returns {string} URL to the alert image
     */
    getAlertImageUrl: (alertId) => {
        return `${API.BASE_URL}/alert_image/${alertId}`;
    },

    /**
     * GET /video_feed
     * Gets the URL for the live video feed (MJPEG stream)
     * @returns {string} URL to the video feed
     */
    getVideoFeedUrl: () => {
        return `${API.BASE_URL}/video_feed`;
    },

    /**
     * Download alert image
     * @param {number} alertId - The ID of the alert
     * @param {string} filename - Optional filename for download
     */
    downloadAlertImage: async (alertId, filename = `alert_${alertId}.jpg`) => {
        try {
            const response = await axiosInstance.get(`/alert_image/${alertId}`, {
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Error downloading alert image:', error);
            throw error;
        }
    },

    /**
     * Get a specific alert by ID
     * @param {number} alertId - The ID of the alert
     * @returns {Promise<Object>} Alert object
     */
    getAlertById: async (alertId) => {
        try {
            // Since backend doesn't have this endpoint, we get all and filter
            const alerts = await API.getAlerts();
            const alert = alerts.find(a => a.id === alertId);
            if (!alert) {
                throw new Error('Alert not found');
            }
            return alert;
        } catch (error) {
            console.error('Error fetching alert by ID:', error);
            throw error;
        }
    },

    /**
     * Helper: Check if backend is reachable
     * @returns {Promise<boolean>} True if backend is reachable
     */
    healthCheck: async () => {
        try {
            const response = await axiosInstance.get('/alerts');
            return response.status === 200;
        } catch (error) {
            console.error('Backend health check failed:', error);
            return false;
        }
    },

    /**
     * Helper: Get alert statistics
     * @returns {Promise<Object>} Statistics about alerts
     */
    getAlertStats: async () => {
        try {
            const alerts = await API.getAlerts();

            const stats = {
                total: alerts.length,
                byType: {},
                byGesture: {},
                recentAlert: alerts[0] || null,
                oldestAlert: alerts[alerts.length - 1] || null
            };

            alerts.forEach(alert => {
                // Count by type
                stats.byType[alert.alert_type] = (stats.byType[alert.alert_type] || 0) + 1;

                // Count by gesture
                if (alert.gesture) {
                    stats.byGesture[alert.gesture] = (stats.byGesture[alert.gesture] || 0) + 1;
                }
            });

            return stats;
        } catch (error) {
            console.error('Error getting alert stats:', error);
            throw error;
        }
    },

    /**
     * Delete a specific alert
     * @param {number} alertId - The ID of the alert to delete
     * @returns {Promise<Object>} Response with success message
     */
    deleteAlert: async (alertId) => {
        try {
            const response = await axiosInstance.delete(`/alert/${alertId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting alert:', error);
            throw error;
        }
    },

    /**
     * Delete all alerts
     * @returns {Promise<Object>} Response with count of deleted alerts
     */
    deleteAllAlerts: async () => {
        try {
            const response = await axiosInstance.delete('/alerts');
            return response.data;
        } catch (error) {
            console.error('Error deleting all alerts:', error);
            throw error;
        }
    }
};

export default API;
