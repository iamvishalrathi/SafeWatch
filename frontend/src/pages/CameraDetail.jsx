import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { faMapMarkerAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import Piegraph from "../components/Piegraph.jsx";
import GestureDetection from "../components/GestureDetection.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faBell,
  faDownload,
  faArrowLeft,
  faExclamationTriangle,
  faHandPaper,
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useAlerts, usePersonCount, useDownloadAlertImage } from "../hooks/useApi";
import API from "../utils/api";
import { getGestureEmoji } from "../utils/gestureUtils";

// Fix default marker icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const CameraDetail = () => {
  const navigate = useNavigate();
  const { cameraId } = useParams();

  // Use custom hooks for API data
  const { alerts, error: alertsError } = useAlerts(1000);
  const { totalCount, maleCount, femaleCount } = usePersonCount(1000);
  const { downloadImage } = useDownloadAlertImage();

  const [cameraInfo, setCameraInfo] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Get recent 3 alerts with screenshots
  const recentAlertsWithScreenshots = alerts.slice(0, 3);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get camera info from localStorage based on ID (setup_cameras.js as single source of truth)
  useEffect(() => {
    const savedCameras = localStorage.getItem('cameras');

    if (savedCameras) {
      const cameras = JSON.parse(savedCameras);
      const camera = cameras.find(cam => cam.id === parseInt(cameraId));
      setCameraInfo(camera);
    } else {
      // No cameras found - user needs to run setup_cameras.js
      setCameraInfo(null);
    }
  }, [cameraId]);

  const handleDownload = async (alertId) => {
    try {
      await downloadImage(alertId, `alert_${alertId}.jpg`);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  if (!cameraInfo) {
    return (
      <div className="min-h-screen w-full bg-[#2C2C2C] p-6 flex items-center justify-center text-white">
        <div className="text-xl">Loading camera information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#232323] p-6 flex flex-col gap-6 text-white">
      {/* Header Card - Back and All Alerts */}
      <div className="bg-[#2C2C2C] rounded-2xl shadow-xl p-4">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={() => navigate("/live")}
            className="bg-[#3A3A3A] hover:bg-[#4A4A4A] px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back to Camera Grid</span>
          </button>

          {/* All Alerts Button */}
          <button
            onClick={() => navigate("/all-alerts")}
            className="bg-red-600 hover:bg-red-700 px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 font-semibold"
          >
            <FontAwesomeIcon icon={faBell} />
            <span>All Alerts</span>
          </button>
        </div>
      </div>

      {/* Show error messages if any */}
      {alertsError && (
        <div className="bg-red-600/90 p-4 rounded-xl shadow-lg">
          <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
          Error loading alerts: {alertsError}
        </div>
      )}

      {/* Main Content Grid - 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Video Feed */}
        <div className="lg:col-span-5 bg-[#2C2C2C] rounded-2xl shadow-xl p-6">
          {/* Camera Details Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faVideo}
                  className={`text-2xl ${cameraInfo.isOnline ? "text-green-400" : "text-red-400"}`}
                />
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base">Camera #{cameraInfo.id}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="font-medium">{cameraInfo.position}</span>
                    <span>•</span>
                    <span>{cameraInfo.locality}</span>
                    <span>•</span>
                    <span>{cameraInfo.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="font-bold text-base">
                  Model {cameraInfo.model || 'Unknown Model'}
                </div>
                <div className={`text-sm font-semibold ${cameraInfo.isOnline ? "text-green-400" : "text-red-400"}`}>
                  {cameraInfo.isOnline ? "● Online" : "● Offline"}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full aspect-video bg-[#1A1A1A] rounded-xl overflow-hidden shadow-inner mb-4">
            {cameraInfo.isOnline && !videoError ? (
              <img
                src={cameraInfo.url}
                alt={`Camera ${cameraInfo.id} Feed`}
                className="w-full h-full object-cover"
                onError={() => setVideoError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-6xl mb-4" />
                <p className="text-gray-300 text-lg font-semibold">Camera Unavailable</p>
                <p className="text-gray-500 text-sm mt-1">Feed currently offline</p>
              </div>
            )}
          </div>

          {/* Time Widget Below Video */}
          <div className="flex flex-col items-center justify-center">
            {/* Time Display */}
            <div className="flex items-center justify-center w-full">
              <div className="text-center">
                <div className="text-5xl font-bold text-white tracking-wider font-mono px-8 py-4">
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                  })}
                </div>
              </div>
            </div>

            {/* Date Display */}
            <div className="flex items-center justify-center w-full px-6">
              <div className="text-center">
                <span className="text-lg font-semibold text-gray-300">
                  {currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Gender Distribution Stats */}
        <div className="lg:col-span-3 bg-[#2C2C2C] rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faUser} className="text-xl text-purple-400" />
            <h2 className="text-xl font-bold">Gender Distribution</h2>
          </div>

          <div className="bg-[#3A3A3A] rounded-xl p-4 mb-4">
            <div className="flex flex-col gap-2 text-base">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total People:</span>
                <span className="font-bold text-white text-lg">{totalCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Men:</span>
                <span className="font-bold text-blue-400 text-lg">{maleCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Women:</span>
                <span className="font-bold text-pink-400 text-lg">{femaleCount}</span>
              </div>
              <div className="h-px bg-gray-600 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Men/Women Ratio:</span>
                <span className="font-bold text-green-400 text-lg">
                  {femaleCount > 0 ? (maleCount / femaleCount).toFixed(2) : maleCount > 0 ? '∞' : '0'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center bg-white rounded-xl p-4">
            <div className="w-[200px] h-[200px]">
              <Piegraph male={maleCount} female={femaleCount} />
            </div>
          </div>
        </div>

        {/* Hand Gesture Detection */}
        <div className="lg:col-span-4 bg-[#2C2C2C] rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faHandPaper} className="text-xl text-yellow-400" />
              <h2 className="text-xl font-bold">Hand Gestures</h2>
            </div>
            <span className="text-xs text-gray-400 bg-[#3A3A3A] px-2 py-1 rounded">
              Live
            </span>
          </div>

          <div className="h-[480px]">
            <GestureDetection />
          </div>
        </div>
      </div>

      {/* Recent 3 Alerts with Screenshots */}
      <div className="bg-[#2C2C2C] rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faBell} className="text-xl text-yellow-400" />
            <h2 className="text-xl font-bold">Recent Alerts with Screenshots</h2>
          </div>
          <button
            onClick={() => navigate("/all-alerts")}
            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
          >
            View All →
          </button>
        </div>

        {recentAlertsWithScreenshots.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentAlertsWithScreenshots.map((alert) => (
              <div
                key={alert.id}
                className="bg-[#3A3A3A] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/alert/${alert.id}`)}
              >
                {/* Alert Screenshot */}
                <div className="relative h-48 bg-[#1A1A1A] overflow-hidden">
                  <img
                    src={API.getAlertImageUrl(alert.id)}
                    alt={`Alert ${alert.id}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>

                  {/* Alert Type Badge */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-600/90 px-3 py-1 rounded-lg text-xs font-semibold shadow-lg">
                      {alert.alert_type || 'Alert'}
                    </span>
                  </div>

                  {/* Download Button */}
                  <button
                    className="absolute top-2 right-2 bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(alert.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faDownload} className="text-white text-sm" />
                  </button>
                </div>

                {/* Alert Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-300">Alert #{alert.id}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-blue-400">♂</span>
                      <span className="text-gray-300">{alert.male_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-pink-400">♀</span>
                      <span className="text-gray-300">{alert.female_count || 0}</span>
                    </div>
                    {alert.gesture && (
                      <div className="flex items-center gap-1 ml-auto">
                        <span className="text-lg">{getGestureEmoji(alert.gesture)}</span>
                        <span className="text-yellow-400 text-xs capitalize">{alert.gesture.replace('_', ' ')}</span>
                      </div>
                    )}
                  </div>

                  {alert.latitude && alert.longitude && (
                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      <span>{alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500 bg-[#3A3A3A] rounded-xl">
            <FontAwesomeIcon icon={faBell} className="text-5xl mb-3" />
            <p className="text-lg">No recent alerts</p>
            <p className="text-sm text-gray-600 mt-1">Alerts will appear here when detected</p>
          </div>
        )}
      </div>

      {/* Live Camera Location Map */}
      <div className="bg-[#2C2C2C] rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl text-red-400" />
            <h2 className="text-xl font-bold">Camera Location</h2>
            <p className="text-sm text-gray-400 flex items-center gap-2">
              (Click on the marker to see detailed location information)
            </p>
          </div>
          <button
            onClick={() => {
              const locationText = `Camera #${cameraInfo.id}\nLocation: ${cameraInfo.location}\nLocality: ${cameraInfo.locality || 'N/A'}\nCoordinates: ${cameraInfo.lat.toFixed(6)}, ${cameraInfo.lng.toFixed(6)}\nGoogle Maps: https://www.google.com/maps?q=${cameraInfo.lat},${cameraInfo.lng}`;
              if (navigator.share) {
                navigator.share({
                  title: `Camera #${cameraInfo.id} Location`,
                  text: locationText,
                }).catch(() => {
                  navigator.clipboard.writeText(locationText);
                  alert('Location details copied to clipboard!');
                });
              } else {
                navigator.clipboard.writeText(locationText);
                alert('Location details copied to clipboard!');
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 text-sm"
          >
            <FontAwesomeIcon icon={faShareAlt} />
            <span>Share Location</span>
          </button>
        </div>

        <div className="h-[400px] rounded-xl overflow-hidden shadow-lg">
          {cameraInfo.lat && cameraInfo.lng ? (
            <MapContainer
              center={[cameraInfo.lat, cameraInfo.lng]}
              zoom={18}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {/* Camera Location Marker */}
              <Marker position={[cameraInfo.lat, cameraInfo.lng]}>
                <Popup>
                  <div className="text-black">
                    <div className="mt-2">
                      <strong>Location:</strong> {cameraInfo.location}<br />
                      <strong>Locality:</strong> {cameraInfo.locality || 'N/A'}<br />
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <strong>Coordinates:</strong><br />
                      {cameraInfo.lat.toFixed(6)}, {cameraInfo.lng.toFixed(6)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-[#3A3A3A] rounded-xl">
              <div className="text-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-5xl text-gray-600 mb-3" />
                <p className="text-gray-400">Camera location not available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraDetail;
