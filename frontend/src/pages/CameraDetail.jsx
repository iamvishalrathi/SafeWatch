import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HotspotMap from "../components/HotspotMap";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import Piegraph from "../components/Piegraph.jsx";
import AlertCard from "../components/AlertCard.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faBell,
  faCamera,
  faTrash,
  faDownload,
  faArrowRight,
  faArrowLeft,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { useAlerts, usePersonCount, useDownloadAlertImage } from "../hooks/useApi";
import API from "../utils/api";

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
  const galleryRef = useRef(null);

  // Get camera info based on ID
  useEffect(() => {
    const cameras = [
      { id: 1, name: "Main Entrance", url: "http://localhost:5000/video_feed", isOnline: true },
      { id: 2, name: "Parking Area", url: "http://localhost:5000/video_feed", isOnline: false },
      { id: 3, name: "Corridor A", url: "http://localhost:5000/video_feed", isOnline: false },
      { id: 4, name: "Emergency Exit", url: "http://localhost:5000/video_feed", isOnline: false },
      { id: 5, name: "Lobby", url: "http://localhost:5000/video_feed", isOnline: false },
      { id: 6, name: "Stairwell B", url: "http://localhost:5000/video_feed", isOnline: false },
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
    <div className="min-h-screen w-full bg-[#2C2C2C] p-6 flex flex-col gap-6 text-white">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/live")}
          className="bg-[#3A3A3A] hover:bg-[#4A4A4A] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to Camera Grid</span>
        </button>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faVideo} className={cameraInfo.isOnline ? "text-green-400" : "text-red-400"} />
          <h1 className="text-2xl font-bold">{cameraInfo.name}</h1>
          {cameraInfo.isOnline ? (
            <span className="bg-green-600/80 px-3 py-1 rounded text-sm">Online</span>
          ) : (
            <span className="bg-red-600/80 px-3 py-1 rounded text-sm flex items-center gap-1">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-xs" />
              Offline
            </span>
          )}
        </div>
      </div>

      {/* Show error messages if any */}
      {alertsError && (
        <div className="bg-red-600 p-4 rounded-lg">
          Error loading alerts: {alertsError}
        </div>
      )}

      {/* Top 3 Columns */}
      <div className="flex gap-4">
        {/* Video */}
        <div className="flex flex-col items-center w-1/3 bg-[#3A3A3A] rounded-xl p-4 shadow-lg">
          <div className="w-full mb-4 text-xl font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faVideo} />
            <span>Live Camera Feed</span>
          </div>
          
          {/* Video Feed or Dummy */}
          {cameraInfo.isOnline && !videoError ? (
            <img
              src={cameraInfo.url}
              alt={`${cameraInfo.name} Feed`}
              style={{
                width: "664px",
                height: "450px",
                borderRadius: "8px",
                boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
              }}
              onError={() => setVideoError(true)}
            />
          ) : (
            <div 
              className="w-[664px] h-[450px] bg-[#4A4A4A] rounded-lg flex flex-col items-center justify-center"
              style={{ boxShadow: "0px 0px 10px rgba(0,0,0,0.5)" }}
            >
              <FontAwesomeIcon icon={faVideo} className="text-gray-600 text-6xl mb-4" />
              <p className="text-gray-500 text-lg">Camera Unavailable</p>
              <p className="text-gray-600 text-sm mt-2">Feed currently offline</p>
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button 
              onClick={() => navigate("/live")}
              className="px-4 py-2 rounded-md bg-red-600 font-medium hover:bg-red-700"
            >
              Camera List
            </button>
            <button 
              onClick={() => navigate("/all-alerts")}
              className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-900"
            >
              All Alerts
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col items-center w-1/3 bg-[#3A3A3A] rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Gender Distribution</h2>
          <div className="bg-[#4A4A4A] rounded-lg w-full p-4 text-lg flex flex-col gap-2">
            <div>Total People: {totalCount}</div>
            <div>Men: {maleCount}</div>
            <div>Women: {femaleCount}</div>
          </div>
          <div className="mt-6 w-[250px] h-[250px] bg-white rounded-lg p-2">
            <Piegraph male={maleCount} female={femaleCount} />
          </div>
        </div>

        {/* Alerts */}
        <div className="flex flex-col items-center w-[20%] bg-[#3A3A3A] rounded-xl p-4 shadow-lg">
          <div className="w-full mb-4 text-xl font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBell} />
              <span>Recent Alerts</span>
            </div>
            <span className="text-sm font-normal text-gray-400">
              {alerts.length} total
            </span>
          </div>
          <div className="flex flex-col gap-3 w-full overflow-y-auto h-[400px] pr-2">
            {topAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} compact={true} />
            ))}
          </div>
          {alerts.length > 10 && (
            <button
              onClick={() => navigate("/all-alerts")}
              className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>Show All Alerts</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          )}
        </div>
      </div>

      {/* Screenshot Gallery Below */}
      <div className="w-full bg-[#3A3A3A] rounded-xl p-4 shadow-lg">
        <div className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faCamera} />
          <span>Captured Screenshots</span>
        </div>
        <div
          className="flex gap-4 overflow-x-auto max-w-full scrollbar-hide"
          ref={galleryRef}
        >
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg w-[300px] h-[150px] overflow-hidden group"
            >
              <img
                src={screenshot.url}
                alt={`screenshot-${index}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                onClick={() => window.open(screenshot.url, "_blank")}
              />
              <div className="absolute top-1 right-1 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  className="bg-black bg-opacity-60 p-1 rounded"
                  onClick={() => handleDownload(screenshot.id)}
                >
                  <FontAwesomeIcon icon={faDownload} className="text-white" />
                </button>
                <button
                  className="bg-black bg-opacity-60 p-1 rounded"
                  onClick={() => handleDeleteScreenshot(index)}
                >
                  <FontAwesomeIcon icon={faTrash} className="text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hotspot Map Section */}
      <div className="w-full bg-[#3A3A3A] rounded-xl p-4 shadow-lg">
        <div className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <span>Hotspot Locations Map</span>
        </div>
        <HotspotMap Alerts={alerts} />
      </div>
    </div>
  );
};

export default CameraDetail;
