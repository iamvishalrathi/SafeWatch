import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { faMapMarkerAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import Piegraph from "../components/Piegraph.jsx";
import AlertCard from "../components/AlertCard.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faBell,
  faCamera,
  faTrash,
  faDownload,
  faArrowLeft,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { useAlerts, usePersonCount, useDownloadAlertImage } from "../hooks/useApi";
import API from "../utils/api";

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

  const [screenshots, setScreenshots] = useState([]);
  const [cameraInfo, setCameraInfo] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const galleryRef = useRef(null);

  // Get device's live location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDeviceLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("Unable to get device location");
          // Default to Delhi coordinates if location fails
          setDeviceLocation({ lat: 28.6139, lng: 77.209 });
        }
      );
    } else {
      setLocationError("Geolocation not supported");
      setDeviceLocation({ lat: 28.6139, lng: 77.209 });
    }
  }, []);

  // Get camera info based on ID
  useEffect(() => {
    const cameras = [
      { 
        id: 1, 
        position: "Main Entrance", 
        location: "Rohini", 
        url: "http://localhost:5000/video_feed", 
        isOnline: true 
      },
      { 
        id: 2, 
        position: "Parking Area", 
        location: "Rohini", 
        url: "http://localhost:5000/video_feed", 
        isOnline: false 
      },
      { 
        id: 3, 
        position: "Hall", 
        location: "Narela", 
        url: "http://localhost:5000/video_feed", 
        isOnline: false 
      },
      { 
        id: 4, 
        position: "Main Door", 
        location: "Narela", 
        url: "http://localhost:5000/video_feed", 
        isOnline: false 
      },
      { 
        id: 5, 
        position: "Reception", 
        location: "Dwarka", 
        url: "http://localhost:5000/video_feed", 
        isOnline: false 
      },
      { 
        id: 6, 
        position: "Emergency Exit", 
        location: "Dwarka", 
        url: "http://localhost:5000/video_feed", 
        isOnline: false 
      },
    ];
    
    const camera = cameras.find(cam => cam.id === parseInt(cameraId));
    setCameraInfo(camera);
  }, [cameraId]);

  // Get top 10 alerts
  const topAlerts = alerts.slice(0, 10);

  // Update screenshots from alerts
  useEffect(() => {
    if (alerts.length > 0) {
      const alertImages = alerts.map(alert => ({
        id: alert.id,
        url: API.getAlertImageUrl(alert.id)
      }));
      setScreenshots(alertImages);
    }
  }, [alerts]);

  // Scroll to bottom when new screenshot added
  useEffect(() => {
    if (galleryRef.current) {
      galleryRef.current.scrollTop = galleryRef.current.scrollHeight;
    }
  }, [screenshots]);

  const handleDeleteScreenshot = (index) => {
    const updated = [...screenshots];
    updated.splice(index, 1);
    setScreenshots(updated);
  };

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
      {/* Header Card */}
      <div className="bg-[#2C2C2C] rounded-2xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Back Button and Camera Info */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => navigate("/live")}
              className="bg-[#3A3A3A] hover:bg-[#4A4A4A] px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon 
                icon={faVideo} 
                className={`text-2xl ${cameraInfo.isOnline ? "text-green-400" : "text-red-400"}`} 
              />
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold">Camera #{cameraInfo.id}</h1>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="font-medium">{cameraInfo.position}</span>
                  <span>•</span>
                  <span>{cameraInfo.location}</span>
                </div>
              </div>
              {cameraInfo.isOnline ? (
                <span className="bg-green-600/90 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg">
                  Online
                </span>
              ) : (
                <span className="bg-red-600/90 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 font-semibold shadow-lg">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-xs" />
                  Offline
                </span>
              )}
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 bg-[#3A3A3A] px-4 py-2.5 rounded-lg">
            <span className="text-sm font-medium text-gray-300">
              {isCameraEnabled ? 'Camera Enabled' : 'Camera Disabled'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isCameraEnabled}
                onChange={() => setIsCameraEnabled(!isCameraEnabled)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
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
          <div className="flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faVideo} className="text-xl text-blue-400" />
            <h2 className="text-xl font-bold">Live Camera Feed</h2>
          </div>
          
          <div className="w-full aspect-video bg-[#1A1A1A] rounded-xl overflow-hidden shadow-inner">
            {isCameraEnabled ? (
              cameraInfo.isOnline && !videoError ? (
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
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <FontAwesomeIcon icon={faVideo} className="text-gray-600 text-6xl mb-4" />
                <p className="text-gray-300 text-lg font-semibold">Camera Disabled</p>
                <p className="text-gray-500 text-sm mt-1">Enable camera to view feed</p>
              </div>
            )}
          </div>
        </div>

        {/* Gender Distribution Stats */}
        <div className="lg:col-span-4 bg-[#2C2C2C] rounded-2xl shadow-xl p-6">
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
            </div>
          </div>
          
          <div className="flex items-center justify-center bg-white rounded-xl p-4">
            <div className="w-[200px] h-[200px]">
              <Piegraph male={maleCount} female={femaleCount} />
            </div>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="lg:col-span-3 bg-[#2C2C2C] rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBell} className="text-xl text-yellow-400" />
              <h2 className="text-xl font-bold">Recent Alerts</h2>
            </div>
            <span className="text-sm text-gray-400 bg-[#3A3A3A] px-2 py-1 rounded">
              {alerts.length} total
            </span>
          </div>
          
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[480px] pr-2 custom-scrollbar">
            {topAlerts.length > 0 ? (
              topAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} compact={true} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <FontAwesomeIcon icon={faBell} className="text-4xl mb-2" />
                <p>No alerts yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Screenshot Gallery */}
      <div className="bg-[#2C2C2C] rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FontAwesomeIcon icon={faCamera} className="text-xl text-green-400" />
          <h2 className="text-xl font-bold">Captured Screenshots</h2>
        </div>
        
        {screenshots.length > 0 ? (
          <div
            className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar"
            ref={galleryRef}
          >
            {screenshots.map((screenshot, index) => (
              <div
                key={index}
                className="relative bg-[#3A3A3A] rounded-xl min-w-[240px] h-[140px] overflow-hidden group shadow-lg"
              >
                <img
                  src={screenshot.url}
                  alt={`screenshot-${index}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                  onClick={() => window.open(screenshot.url, "_blank")}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    className="bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-colors shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(screenshot.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faDownload} className="text-white" />
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-colors shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteScreenshot(index);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 bg-[#3A3A3A] rounded-xl">
            <FontAwesomeIcon icon={faCamera} className="text-4xl mb-2" />
            <p>No screenshots captured yet</p>
          </div>
        )}
      </div>

      {/* Live Camera Location Map */}
      <div className="bg-[#2C2C2C] rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xl text-red-400" />
          <h2 className="text-xl font-bold">Live Camera Location</h2>
          {locationError && (
            <span className="text-xs text-yellow-400 ml-2">({locationError})</span>
          )}
        </div>
        
        <div className="h-[400px] rounded-xl overflow-hidden shadow-lg">
          {deviceLocation ? (
            <MapContainer
              center={[deviceLocation.lat, deviceLocation.lng]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* Camera Location Marker */}
              <Marker position={[deviceLocation.lat, deviceLocation.lng]}>
                <Popup>
                  <div className="text-black">
                    <strong>Camera #{cameraInfo.id}</strong><br />
                    <strong>{cameraInfo.position}</strong><br />
                    Location: {cameraInfo.location}<br />
                    Status: {cameraInfo.isOnline ? "Online" : "Offline"}<br />
                    Coordinates: {deviceLocation.lat.toFixed(6)}, {deviceLocation.lng.toFixed(6)}
                  </div>
                </Popup>
              </Marker>

              {/* Alert Circles */}
              {alerts.map((alert, index) => (
                alert.latitude && alert.longitude ? (
                  <Circle
                    key={index}
                    center={[alert.latitude, alert.longitude]}
                    radius={50}
                    pathOptions={{
                      color: "red",
                      fillColor: "red",
                      fillOpacity: 0.4,
                    }}
                  >
                    <Popup>
                      <div className="text-black">
                        <strong>Alert: {alert.alert_type}</strong><br />
                        Timestamp: {new Date(alert.timestamp).toLocaleString()}<br />
                        {alert.gesture && `Gesture: ${alert.gesture}`}
                      </div>
                    </Popup>
                  </Circle>
                ) : null
              ))}
            </MapContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-[#3A3A3A] rounded-xl">
              <div className="text-center">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-5xl text-gray-600 mb-3" />
                <p className="text-gray-400">Loading location...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraDetail;
