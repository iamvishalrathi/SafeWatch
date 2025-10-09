import { useEffect, useState, useRef } from "react";
import HotspotMap from "../components/HotspotMap";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

import VideoFeed from "../components/VideoFeed.jsx";
import Piegraph from "../components/Piegraph.jsx";
import Alert from "./Alert.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faBell,
  faCamera,
  faTrash,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import { useAlerts, usePersonCount, useDownloadAlertImage } from "../hooks/useApi";
import API from "../utils/api";

const Live = () => {
  // Use custom hooks for API data
  const { alerts, error: alertsError } = useAlerts(1000);
  const { totalCount, maleCount, femaleCount } = usePersonCount(1000);
  const { downloadImage } = useDownloadAlertImage();
  
  const [screenshots, setScreenshots] = useState([]);
  const galleryRef = useRef(null);

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

  return (
    <div className="min-h-screen w-full bg-[#2C2C2C] p-6 flex flex-col gap-6 text-white">
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
          <VideoFeed />
          <div className="flex gap-4 mt-6">
            <button className="px-4 py-2 rounded-md bg-red-600 font-medium hover:bg-red-700">
              Camera List
            </button>
            <button className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-900">
              Events
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
          <div className="w-full mb-4 text-xl font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faBell} />
            <span>Alerts</span>
          </div>
          <div className="flex flex-col gap-2 w-full overflow-y-auto h-[460px] pr-2">
            {alerts.map((alert, i) => (
              <Alert key={i} lat={alert.latitude} lng={alert.longitude} />
            ))}
          </div>
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

export default Live;
