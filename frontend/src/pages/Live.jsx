import React, { useEffect, useState, useRef } from "react";
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
  faMapLocationDot,
} from "@fortawesome/free-solid-svg-icons";

const Live = () => {
  const [genderCounts, setGenderCounts] = useState({ male: 0, female: 0 });
  const [totalPersons, setTotalPersons] = useState(0);
  const [screenshots, setScreenshots] = useState([
    // Sample placeholders
    "https://via.placeholder.com/300x150.png?text=Alert+1",
    "https://via.placeholder.com/300x150.png?text=Alert+2",
    "https://via.placeholder.com/300x150.png?text=Alert+3",
  ]);
  const galleryRef = useRef(null);
  const [Alerts, setAlerts] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:5000/gender_count")
        .then((res) => res.json())
        .then((data) => setGenderCounts(data));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://localhost:5000/alerts")
        .then((res) => res.json())
        .then((data) => setAlerts(data));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTotalPersons(genderCounts.male + genderCounts.female);
  }, [genderCounts]);

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

  const handleDownload = (url) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = "screenshot.png";
    a.click();
  };

  const [mapError, setMapError] = useState(false);

  // Add error boundary for map
  const renderMap = (Alerts) => {
    try {
      return <HotspotMap Alerts={Alerts} />;
    } catch (error) {
      console.error("Map rendering error:", error);
      setMapError(true);
      return <div>Error loading map</div>;
    }
  };

  if (mapError) {
    return <div>Error in Live page. Please refresh.</div>;
  }

  return (
    <div className="min-h-screen w-full bg-[#2C2C2C] p-6 flex flex-col gap-6 text-white">
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
            <div>Total People: {totalPersons}</div>
            <div>Men: {genderCounts.male}</div>
            <div>Women: {genderCounts.female}</div>
          </div>
          <div className="mt-6 w-[250px] h-[250px] bg-white rounded-lg p-2">
            <Piegraph male={genderCounts.male} female={genderCounts.female} />
          </div>
        </div>

        {/* Alerts */}
        <div className="flex flex-col items-center w-[20%] bg-[#3A3A3A] rounded-xl p-4 shadow-lg">
          <div className="w-full mb-4 text-xl font-semibold flex items-center gap-2">
            <FontAwesomeIcon icon={faBell} />
            <span>Alerts</span>
          </div>
          <div className="flex flex-col gap-2 w-full overflow-y-auto h-[460px] pr-2">
            {Alerts.map((alert, i) => (
              <Alert key={i} lat={alert["lat"]} lng={alert["lng"]} />
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
          {screenshots.map((src, index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg w-[300px] h-[150px] overflow-hidden group"
            >
              <img
                src={src}
                alt={`screenshot-${index}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                onClick={() => window.open(src, "_blank")}
              />
              <div className="absolute top-1 right-1 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  className="bg-black bg-opacity-60 p-1 rounded"
                  onClick={() => handleDownload(src)}
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
        <HotspotMap Alerts={Alerts} />
      </div>
    </div>
  );
};

export default Live;
