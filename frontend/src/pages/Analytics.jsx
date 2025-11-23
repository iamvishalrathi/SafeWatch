import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartLine,
    faMapMarkedAlt,
    faExclamationTriangle,
    faInfoCircle,
    faFire,
    faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useAlerts } from "../hooks/useApi";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Fix default marker icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

// Component to update map center and zoom
const MapUpdater = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom || 15, {
                duration: 1.5,
                easeLinearity: 0.5
            });
        }
    }, [center, zoom, map]);
    return null;
};

MapUpdater.propTypes = {
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
};

const Analytics = () => {
    const { alerts, loading, error } = useAlerts(5000); // Poll every 5 seconds
    const [hotspots, setHotspots] = useState([]);
    const [mapCenter, setMapCenter] = useState([28.7041, 77.1025]); // Default: Delhi
    const [showLegend, setShowLegend] = useState(true);
    const [selectedHotspot, setSelectedHotspot] = useState(null);
    const [mapKey, setMapKey] = useState(0);
    const [timeRange, setTimeRange] = useState('24h'); // 24h, 7d, 30d
    const [chartData, setChartData] = useState(null);

    // Process alerts over time for chart
    useEffect(() => {
        if (alerts && alerts.length > 0) {
            // Get time range in hours
            const rangeHours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
            const now = new Date();
            const startTime = new Date(now.getTime() - rangeHours * 60 * 60 * 1000);

            // Filter alerts within time range
            const filteredAlerts = alerts.filter(alert => {
                const alertTime = new Date(alert.timestamp || alert.created_at);
                return alertTime >= startTime && alertTime <= now;
            });

            // Group alerts by time intervals
            const intervals = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
            const intervalMs = (rangeHours * 60 * 60 * 1000) / intervals;
            
            const timeGroups = {};
            const labels = [];

            // Initialize time groups
            for (let i = 0; i < intervals; i++) {
                const intervalStart = new Date(startTime.getTime() + i * intervalMs);
                let label;
                
                if (timeRange === '24h') {
                    label = intervalStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
                } else if (timeRange === '7d') {
                    label = intervalStart.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                } else {
                    label = intervalStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }
                
                labels.push(label);
                timeGroups[i] = 0;
            }

            // Count alerts in each interval
            filteredAlerts.forEach(alert => {
                const alertTime = new Date(alert.timestamp || alert.created_at);
                const timeDiff = alertTime - startTime;
                const intervalIndex = Math.floor(timeDiff / intervalMs);
                
                if (intervalIndex >= 0 && intervalIndex < intervals) {
                    timeGroups[intervalIndex]++;
                }
            });

            const data = Object.values(timeGroups);

            // Create chart data
            setChartData({
                labels,
                datasets: [
                    {
                        label: 'Alerts',
                        data,
                        fill: true,
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointBackgroundColor: 'rgb(59, 130, 246)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                    }
                ]
            });
        }
    }, [alerts, timeRange]);

    // Calculate hotspots based on alert locations
    useEffect(() => {
        if (alerts && alerts.length > 0) {
            // Group alerts by location (using camera location or alert lat/lng)
            const locationGroups = {};

            alerts.forEach(alert => {
                let lat, lng, locationName;

                // Prefer camera location if available
                if (alert.camera?.latitude && alert.camera?.longitude) {
                    lat = alert.camera.latitude;
                    lng = alert.camera.longitude;
                    locationName = alert.camera.location || alert.camera.locality || 'Unknown Location';
                } else if (alert.latitude && alert.longitude) {
                    lat = alert.latitude;
                    lng = alert.longitude;
                    locationName = 'Alert Location';
                } else {
                    return; // Skip alerts without location data
                }

                // Round coordinates to group nearby alerts (precision of ~100m)
                const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;

                if (!locationGroups[key]) {
                    locationGroups[key] = {
                        lat: lat,
                        lng: lng,
                        count: 0,
                        locationName: locationName,
                        alerts: []
                    };
                }

                locationGroups[key].count++;
                locationGroups[key].alerts.push(alert);
            });

            // Convert to array and sort by count
            const hotspotsArray = Object.values(locationGroups).sort((a, b) => b.count - a.count);
            setHotspots(hotspotsArray);

            // Set map center to the hotspot with most alerts only on initial load
            if (hotspotsArray.length > 0 && !mapCenter) {
                setMapCenter([hotspotsArray[0].lat, hotspotsArray[0].lng]);
            }
        }
    }, [alerts, mapCenter]);

    // Get color based on alert count
    const getHotspotColor = (count) => {
        if (count >= 10) return { color: '#dc2626', label: 'Critical', textColor: 'text-red-500' }; // Red
        if (count >= 5) return { color: '#ea580c', label: 'High', textColor: 'text-orange-500' }; // Orange
        if (count >= 2) return { color: '#eab308', label: 'Medium', textColor: 'text-yellow-500' }; // Yellow
        return { color: '#3b82f6', label: 'Low', textColor: 'text-blue-500' }; // Blue
    };

    // Get radius based on alert count (larger circles for more alerts)
    const getRadius = (count) => {
        return Math.min(100 + count * 20, 500); // Min 120m, max 500m radius
    };

    // Handle hotspot click to highlight and center on map
    const handleHotspotClick = (hotspot, index) => {
        setSelectedHotspot(index);
        setMapCenter([hotspot.lat, hotspot.lng]);
        setMapKey(prev => prev + 1); // Force map update
    };

    if (loading && !alerts) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading analytics...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-red-500 text-xl">Error loading data: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#2C2C2C] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faChartLine} className="text-blue-500 text-3xl" />
                            <h1 className="text-4xl font-bold text-white">Safety Analytics</h1>
                        </div>
                        <button
                            onClick={() => setShowLegend(!showLegend)}
                            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <FontAwesomeIcon icon={faInfoCircle} />
                            <span>{showLegend ? 'Hide' : 'Show'} Legend</span>
                        </button>
                    </div>
                    <p className="text-gray-400">
                        Visualizing alert hotspots across monitored locations • Total Alerts: <span className="text-white font-semibold">{alerts?.length || 0}</span>
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Total Hotspots</p>
                                <p className="text-white text-2xl font-bold">{hotspots.length}</p>
                            </div>
                            <FontAwesomeIcon icon={faMapMarkedAlt} className="text-blue-500 text-2xl" />
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Critical Areas</p>
                                <p className="text-white text-2xl font-bold">
                                    {hotspots.filter(h => h.count >= 10).length}
                                </p>
                            </div>
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-2xl animate-pulse" />
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">High Risk Areas</p>
                                <p className="text-white text-2xl font-bold">
                                    {hotspots.filter(h => h.count >= 5 && h.count < 10).length}
                                </p>
                            </div>
                            <FontAwesomeIcon icon={faFire} className="text-orange-500 text-2xl" />
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Top Hotspot</p>
                                <p className="text-white text-2xl font-bold">
                                    {hotspots.length > 0 ? `${hotspots[0].count} alerts` : 'N/A'}
                                </p>
                            </div>
                            <FontAwesomeIcon icon={faMapMarkedAlt} className="text-yellow-500 text-2xl" />
                        </div>
                    </div>
                </div>

                {/* Time Series Chart */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-white text-2xl font-bold flex items-center gap-2">
                            <FontAwesomeIcon icon={faChartLine} className="text-blue-500" />
                            Alerts Over Time
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTimeRange('24h')}
                                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                    timeRange === '24h'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                24 Hours
                            </button>
                            <button
                                onClick={() => setTimeRange('7d')}
                                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                    timeRange === '7d'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                7 Days
                            </button>
                            <button
                                onClick={() => setTimeRange('30d')}
                                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                                    timeRange === '30d'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                30 Days
                            </button>
                        </div>
                    </div>

                    <div className="h-[400px] bg-gray-900 rounded-xl p-4">
                        {chartData ? (
                            <Line
                                data={chartData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: true,
                                            position: 'top',
                                            labels: {
                                                color: '#fff',
                                                font: {
                                                    size: 14,
                                                    weight: 'bold'
                                                },
                                                padding: 15,
                                                usePointStyle: true,
                                            }
                                        },
                                        tooltip: {
                                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                            titleColor: '#fff',
                                            bodyColor: '#fff',
                                            borderColor: 'rgb(59, 130, 246)',
                                            borderWidth: 1,
                                            padding: 12,
                                            displayColors: true,
                                            callbacks: {
                                                label: function(context) {
                                                    return `Alerts: ${context.parsed.y}`;
                                                }
                                            }
                                        }
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                            ticks: {
                                                color: '#9ca3af',
                                                font: {
                                                    size: 12
                                                },
                                                stepSize: 1,
                                                precision: 0
                                            },
                                            grid: {
                                                color: 'rgba(255, 255, 255, 0.1)',
                                                drawBorder: false
                                            },
                                            title: {
                                                display: true,
                                                text: 'Number of Alerts',
                                                color: '#fff',
                                                font: {
                                                    size: 14,
                                                    weight: 'bold'
                                                }
                                            }
                                        },
                                        x: {
                                            ticks: {
                                                color: '#9ca3af',
                                                font: {
                                                    size: 11
                                                },
                                                maxRotation: 45,
                                                minRotation: 45
                                            },
                                            grid: {
                                                color: 'rgba(255, 255, 255, 0.05)',
                                                drawBorder: false
                                            },
                                            title: {
                                                display: true,
                                                text: 'Time',
                                                color: '#fff',
                                                font: {
                                                    size: 14,
                                                    weight: 'bold'
                                                }
                                            }
                                        }
                                    },
                                    interaction: {
                                        intersect: false,
                                        mode: 'index'
                                    }
                                }}
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center">
                                    <FontAwesomeIcon icon={faChartLine} className="text-5xl text-gray-600 mb-3" />
                                    <p className="text-gray-400 text-lg">No data available</p>
                                    <p className="text-gray-500 text-sm mt-2">Chart will appear when alerts are generated</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map Container */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white text-2xl font-bold flex items-center gap-2">
                            <FontAwesomeIcon icon={faMapMarkedAlt} className="text-blue-500" />
                            Alert Hotspot Map
                        </h2>
                        {showLegend && (
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-red-600"></div>
                                    <span className="text-gray-400">Critical (10+)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-orange-600"></div>
                                    <span className="text-gray-400">High (5-9)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-yellow-600"></div>
                                    <span className="text-gray-400">Medium (2-4)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                                    <span className="text-gray-400">Low (1)</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-[600px] rounded-xl overflow-hidden shadow-lg">
                        {hotspots.length > 0 ? (
                            <MapContainer
                                key={mapKey}
                                center={mapCenter}
                                zoom={13}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <MapUpdater center={mapCenter} zoom={selectedHotspot !== null ? 15 : 13} />

                                {/* Draw circles for each hotspot */}
                                {hotspots.map((hotspot, index) => {
                                    const { color, label } = getHotspotColor(hotspot.count);
                                    const isSelected = selectedHotspot === index;
                                    return (
                                        <Circle
                                            key={index}
                                            center={[hotspot.lat, hotspot.lng]}
                                            radius={getRadius(hotspot.count)}
                                            pathOptions={{
                                                fillColor: color,
                                                fillOpacity: isSelected ? 0.7 : 0.4,
                                                color: isSelected ? '#ffffff' : color,
                                                weight: isSelected ? 4 : 2,
                                                opacity: isSelected ? 1 : 0.8
                                            }}
                                            eventHandlers={{
                                                click: () => handleHotspotClick(hotspot, index)
                                            }}
                                        >
                                            <Popup>
                                                <div className="text-black min-w-[200px]">
                                                    <div className="font-bold text-lg mb-2 flex items-center gap-2">
                                                        <FontAwesomeIcon icon={faMapMarkedAlt} />
                                                        {hotspot.locationName}
                                                    </div>
                                                    <div className="space-y-1 text-sm">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-700">Alert Count:</span>
                                                            <span className="font-bold text-lg">{hotspot.count}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-gray-700">Risk Level:</span>
                                                            <span className={`font-semibold ${label === 'Critical' ? 'text-red-600' :
                                                                    label === 'High' ? 'text-orange-600' :
                                                                        label === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                                                                }`}>{label}</span>
                                                        </div>
                                                        <div className="mt-3 pt-3 border-t border-gray-300">
                                                            <p className="text-xs text-gray-600">
                                                                <strong>Coordinates:</strong><br />
                                                                {hotspot.lat.toFixed(6)}, {hotspot.lng.toFixed(6)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Popup>
                                        </Circle>
                                    );
                                })}
                            </MapContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-gray-700 rounded-xl">
                                <div className="text-center">
                                    <FontAwesomeIcon icon={faMapMarkedAlt} className="text-5xl text-gray-500 mb-3" />
                                    <p className="text-gray-400 text-lg">No alert data available</p>
                                    <p className="text-gray-500 text-sm mt-2">Hotspots will appear when alerts are generated</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Hotspot List */}
                {hotspots.length > 0 && (
                    <div className="mt-6 bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                        <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faFire} className="text-orange-500" />
                            Top Hotspots
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {hotspots.slice(0, 6).map((hotspot, index) => {
                                const { color, label, textColor } = getHotspotColor(hotspot.count);
                                const isSelected = selectedHotspot === index;
                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleHotspotClick(hotspot, index)}
                                        className={`rounded-lg p-4 transition-all cursor-pointer border-l-4 ${
                                            isSelected 
                                                ? 'bg-gray-600 ring-2 ring-white shadow-lg scale-105' 
                                                : 'bg-gray-700 hover:bg-gray-600'
                                        }`}
                                        style={{ borderLeftColor: color }}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <h3 className="text-white font-semibold text-lg truncate" title={hotspot.locationName}>
                                                    {hotspot.locationName}
                                                </h3>
                                                <p className="text-gray-400 text-sm">
                                                    {hotspot.lat.toFixed(4)}, {hotspot.lng.toFixed(4)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-white">{hotspot.count}</div>
                                                <div className="text-xs text-gray-400">alerts</div>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-600">
                                            <span className={`${textColor} font-semibold text-sm uppercase`}>
                                                {label} Risk
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <FontAwesomeIcon icon={faInfoCircle} className="text-blue-400 text-xl mt-1" />
                        <div>
                            <h3 className="text-white font-semibold mb-2">How Hotspot Detection Works</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Our system analyzes all generated alerts and groups them by location to identify areas with high alert frequency.
                                Circle size and color indicate the severity: larger, redder circles represent areas with more alerts and higher risk.
                                This helps security teams prioritize monitoring and response efforts in the most critical areas.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
