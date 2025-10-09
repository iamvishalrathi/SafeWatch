// Custom React Hooks for SheSafe API
// Provides reusable hooks for data fetching with loading and error states

import { useState, useEffect, useCallback } from 'react';
import API from '../utils/api';

/**
 * Hook to fetch alerts with auto-refresh
 * @param {number} refreshInterval - Refresh interval in milliseconds (default: 5000)
 * @returns {Object} { alerts, loading, error, refetch }
 */
export const useAlerts = (refreshInterval = 5000) => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAlerts = useCallback(async () => {
        try {
            setError(null);
            const data = await API.getAlerts();
            setAlerts(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch alerts');
            console.error('Error in useAlerts:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAlerts();

        if (refreshInterval > 0) {
            const interval = setInterval(fetchAlerts, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [fetchAlerts, refreshInterval]);

    return { alerts, loading, error, refetch: fetchAlerts };
};

/**
 * Hook to fetch gender count with auto-refresh
 * @param {number} refreshInterval - Refresh interval in milliseconds (default: 1000)
 * @returns {Object} { genderCount, loading, error, refetch }
 */
export const useGenderCount = (refreshInterval = 1000) => {
    const [genderCount, setGenderCount] = useState({ male: 0, female: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGenderCount = useCallback(async () => {
        try {
            setError(null);
            const data = await API.getGenderCount();
            setGenderCount(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch gender count');
            console.error('Error in useGenderCount:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGenderCount();

        if (refreshInterval > 0) {
            const interval = setInterval(fetchGenderCount, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [fetchGenderCount, refreshInterval]);

    return { genderCount, loading, error, refetch: fetchGenderCount };
};

/**
 * Hook to get alert statistics
 * @param {number} refreshInterval - Refresh interval in milliseconds (default: 10000)
 * @returns {Object} { stats, loading, error, refetch }
 */
export const useAlertStats = (refreshInterval = 10000) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        try {
            setError(null);
            const data = await API.getAlertStats();
            setStats(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch alert stats');
            console.error('Error in useAlertStats:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();

        if (refreshInterval > 0) {
            const interval = setInterval(fetchStats, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [fetchStats, refreshInterval]);

    return { stats, loading, error, refetch: fetchStats };
};

/**
 * Hook to check backend health
 * @param {number} checkInterval - Check interval in milliseconds (default: 30000)
 * @returns {Object} { isHealthy, checking, error }
 */
export const useBackendHealth = (checkInterval = 30000) => {
    const [isHealthy, setIsHealthy] = useState(null);
    const [checking, setChecking] = useState(true);
    const [error, setError] = useState(null);

    const checkHealth = useCallback(async () => {
        try {
            setError(null);
            const healthy = await API.healthCheck();
            setIsHealthy(healthy);
        } catch (err) {
            setError(err.message || 'Health check failed');
            setIsHealthy(false);
            console.error('Error in useBackendHealth:', err);
        } finally {
            setChecking(false);
        }
    }, []);

    useEffect(() => {
        checkHealth();

        if (checkInterval > 0) {
            const interval = setInterval(checkHealth, checkInterval);
            return () => clearInterval(interval);
        }
    }, [checkHealth, checkInterval]);

    return { isHealthy, checking, error };
};

/**
 * Hook for video feed URL (doesn't need fetching, just returns URL)
 * @returns {string} Video feed URL
 */
export const useVideoFeed = () => {
    return API.getVideoFeedUrl();
};

/**
 * Hook to get alert image URL
 * @param {number} alertId - Alert ID
 * @returns {string} Alert image URL
 */
export const useAlertImage = (alertId) => {
    return alertId ? API.getAlertImageUrl(alertId) : null;
};

/**
 * Hook for downloading alert image
 * @returns {Function} downloadImage function
 */
export const useDownloadAlertImage = () => {
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState(null);

    const downloadImage = useCallback(async (alertId, filename) => {
        try {
            setDownloading(true);
            setError(null);
            await API.downloadAlertImage(alertId, filename);
        } catch (err) {
            setError(err.message || 'Failed to download image');
            console.error('Error downloading image:', err);
            throw err;
        } finally {
            setDownloading(false);
        }
    }, []);

    return { downloadImage, downloading, error };
};

/**
 * Hook to fetch a single alert by ID
 * @param {number} alertId - Alert ID to fetch
 * @returns {Object} { alert, loading, error, refetch }
 */
export const useAlert = (alertId) => {
    const [alert, setAlert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAlert = useCallback(async () => {
        if (!alertId) {
            setLoading(false);
            return;
        }

        try {
            setError(null);
            const data = await API.getAlertById(alertId);
            setAlert(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch alert');
            console.error('Error in useAlert:', err);
        } finally {
            setLoading(false);
        }
    }, [alertId]);

    useEffect(() => {
        fetchAlert();
    }, [fetchAlert]);

    return { alert, loading, error, refetch: fetchAlert };
};

/**
 * Hook to track total person count from gender count
 * @param {number} refreshInterval - Refresh interval in milliseconds (default: 1000)
 * @returns {Object} { totalCount, maleCount, femaleCount, loading, error }
 */
export const usePersonCount = (refreshInterval = 1000) => {
    const { genderCount, loading, error } = useGenderCount(refreshInterval);

    const totalCount = genderCount.male + genderCount.female;

    return {
        totalCount,
        maleCount: genderCount.male,
        femaleCount: genderCount.female,
        loading,
        error
    };
};
