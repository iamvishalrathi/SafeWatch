// API Integration Test Page
// Test component to verify all backend API endpoints

import { useState } from 'react';
import {
    useAlerts,
    useGenderCount,
    useAlertStats,
    useBackendHealth,
    useVideoFeed,
    useDownloadAlertImage
} from '../hooks/useApi';
import API from '../utils/api';

const APITest = () => {
    const [testResults, setTestResults] = useState({});
    const [testing, setTesting] = useState(false);

    // Use hooks
    const { alerts, loading: alertsLoading, error: alertsError } = useAlerts(5000);
    const { genderCount, loading: genderLoading, error: genderError } = useGenderCount(5000);
    const { stats, loading: statsLoading, error: statsError } = useAlertStats(10000);
    const { isHealthy, checking } = useBackendHealth(30000);
    const videoFeedUrl = useVideoFeed();
    const { downloadImage, downloading } = useDownloadAlertImage();

    const runTests = async () => {
        setTesting(true);
        const results = {};

        // Test 1: GET /alerts
        try {
            const alertsData = await API.getAlerts();
            results.alerts = {
                success: true,
                data: alertsData,
                count: alertsData.length,
                message: `✅ Fetched ${alertsData.length} alerts`
            };
        } catch (error) {
            results.alerts = {
                success: false,
                error: error.message,
                message: `❌ Failed to fetch alerts: ${error.message}`
            };
        }

        // Test 2: GET /gender_count
        try {
            const genderData = await API.getGenderCount();
            results.genderCount = {
                success: true,
                data: genderData,
                message: `✅ Gender count: ${genderData.male} males, ${genderData.female} females`
            };
        } catch (error) {
            results.genderCount = {
                success: false,
                error: error.message,
                message: `❌ Failed to fetch gender count: ${error.message}`
            };
        }

        // Test 3: GET /video_feed (URL only)
        try {
            const videoUrl = API.getVideoFeedUrl();
            results.videoFeed = {
                success: true,
                data: videoUrl,
                message: `✅ Video feed URL: ${videoUrl}`
            };
        } catch (error) {
            results.videoFeed = {
                success: false,
                error: error.message,
                message: `❌ Failed to get video feed URL: ${error.message}`
            };
        }

        // Test 4: GET /alert_image/<id> (URL only, test with first alert if available)
        try {
            if (results.alerts.success && results.alerts.data.length > 0) {
                const firstAlertId = results.alerts.data[0].id;
                const imageUrl = API.getAlertImageUrl(firstAlertId);
                results.alertImage = {
                    success: true,
                    data: imageUrl,
                    message: `✅ Alert image URL for alert ${firstAlertId}: ${imageUrl}`
                };
            } else {
                results.alertImage = {
                    success: false,
                    message: `⚠️ No alerts available to test image endpoint`
                };
            }
        } catch (error) {
            results.alertImage = {
                success: false,
                error: error.message,
                message: `❌ Failed to get alert image URL: ${error.message}`
            };
        }

        // Test 5: Health Check
        try {
            const healthy = await API.healthCheck();
            results.healthCheck = {
                success: healthy,
                data: healthy,
                message: healthy ? `✅ Backend is healthy` : `❌ Backend health check failed`
            };
        } catch (error) {
            results.healthCheck = {
                success: false,
                error: error.message,
                message: `❌ Health check error: ${error.message}`
            };
        }

        // Test 6: Get Alert Stats
        try {
            const statsData = await API.getAlertStats();
            results.alertStats = {
                success: true,
                data: statsData,
                message: `✅ Alert stats: ${statsData.total} total alerts`
            };
        } catch (error) {
            results.alertStats = {
                success: false,
                error: error.message,
                message: `❌ Failed to fetch alert stats: ${error.message}`
            };
        }

        setTestResults(results);
        setTesting(false);
    };

    const testDownload = async () => {
        if (alerts.length > 0) {
            try {
                await downloadImage(alerts[0].id);
                alert('Download successful!');
            } catch (error) {
                alert(`Download failed: ${error.message}`);
            }
        } else {
            alert('No alerts available to download');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-8">SheSafe API Integration Test</h1>

            {/* Backend Health Status */}
            <div className={`p-4 rounded-lg mb-8 ${isHealthy ? 'bg-green-700' : checking ? 'bg-yellow-700' : 'bg-red-700'}`}>
                <h2 className="text-2xl font-bold">Backend Status</h2>
                <p>{checking ? 'Checking...' : isHealthy ? '✅ Online' : '❌ Offline'}</p>
            </div>

            {/* Test Button */}
            <button
                onClick={runTests}
                disabled={testing}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg font-semibold mb-8 disabled:opacity-50"
            >
                {testing ? 'Running Tests...' : 'Run All API Tests'}
            </button>

            {/* Test Results */}
            {Object.keys(testResults).length > 0 && (
                <div className="bg-gray-800 p-6 rounded-lg mb-8">
                    <h2 className="text-2xl font-bold mb-4">Test Results</h2>
                    {Object.entries(testResults).map(([key, result]) => (
                        <div key={key} className={`p-4 mb-4 rounded ${result.success ? 'bg-green-900' : 'bg-red-900'}`}>
                            <h3 className="text-xl font-bold mb-2">{key}</h3>
                            <p>{result.message}</p>
                            {result.data && (
                                <pre className="bg-black p-2 rounded mt-2 overflow-auto">
                                    {JSON.stringify(result.data, null, 2)}
                                </pre>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Live Data Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Alerts Hook */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">useAlerts Hook</h2>
                    {alertsLoading && <p>Loading alerts...</p>}
                    {alertsError && <p className="text-red-400">Error: {alertsError}</p>}
                    {!alertsLoading && !alertsError && (
                        <div>
                            <p className="mb-2">✅ {alerts.length} alerts loaded</p>
                            <div className="bg-black p-2 rounded overflow-auto max-h-60">
                                <pre>{JSON.stringify(alerts, null, 2)}</pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* Gender Count Hook */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">useGenderCount Hook</h2>
                    {genderLoading && <p>Loading gender count...</p>}
                    {genderError && <p className="text-red-400">Error: {genderError}</p>}
                    {!genderLoading && !genderError && (
                        <div>
                            <p className="mb-2">✅ Gender count loaded</p>
                            <div className="text-xl">
                                <p>Males: {genderCount.male}</p>
                                <p>Females: {genderCount.female}</p>
                                <p>Total: {genderCount.male + genderCount.female}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Alert Stats Hook */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">useAlertStats Hook</h2>
                    {statsLoading && <p>Loading stats...</p>}
                    {statsError && <p className="text-red-400">Error: {statsError}</p>}
                    {!statsLoading && !statsError && stats && (
                        <div>
                            <p className="mb-2">✅ Stats loaded</p>
                            <div className="bg-black p-2 rounded overflow-auto">
                                <pre>{JSON.stringify(stats, null, 2)}</pre>
                            </div>
                        </div>
                    )}
                </div>

                {/* Video Feed */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Video Feed</h2>
                    <p className="mb-2">URL: {videoFeedUrl}</p>
                    <img
                        src={videoFeedUrl}
                        alt="Live Feed"
                        className="w-full rounded"
                        onError={() => console.error('Video feed failed to load')}
                    />
                </div>
            </div>

            {/* Download Test */}
            <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Download Alert Image Test</h2>
                <button
                    onClick={testDownload}
                    disabled={downloading || alerts.length === 0}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50"
                >
                    {downloading ? 'Downloading...' : 'Download First Alert Image'}
                </button>
                {alerts.length === 0 && <p className="mt-2 text-yellow-400">No alerts available</p>}
            </div>

            {/* API Endpoints Documentation */}
            <div className="bg-gray-800 p-6 rounded-lg mt-8">
                <h2 className="text-2xl font-bold mb-4">Available Endpoints</h2>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="text-left p-2">Endpoint</th>
                            <th className="text-left p-2">Method</th>
                            <th className="text-left p-2">Description</th>
                            <th className="text-left p-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-gray-700">
                            <td className="p-2">/alerts</td>
                            <td className="p-2">GET</td>
                            <td className="p-2">Get 10 recent alerts</td>
                            <td className="p-2">{testResults.alerts?.success ? '✅' : '❌'}</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                            <td className="p-2">/gender_count</td>
                            <td className="p-2">GET</td>
                            <td className="p-2">Get real-time gender count</td>
                            <td className="p-2">{testResults.genderCount?.success ? '✅' : '❌'}</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                            <td className="p-2">/video_feed</td>
                            <td className="p-2">GET</td>
                            <td className="p-2">Live video stream (MJPEG)</td>
                            <td className="p-2">{testResults.videoFeed?.success ? '✅' : '❌'}</td>
                        </tr>
                        <tr className="border-b border-gray-700">
                            <td className="p-2">/alert_image/&lt;id&gt;</td>
                            <td className="p-2">GET</td>
                            <td className="p-2">Get alert frame image</td>
                            <td className="p-2">{testResults.alertImage?.success ? '✅' : '❌'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default APITest;
