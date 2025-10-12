import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faExclamationTriangle, faExpand } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

// Dummy camera to show when camera is not available
const DummyCamera = ({ cameraId, cameraName }) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="relative bg-[#4A4A4A] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300 group"
      onClick={() => navigate(`/camera/${cameraId}`)}
    >
      {/* Camera Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faVideo} className="text-gray-400" />
            <span className="text-white font-medium">{cameraName}</span>
          </div>
          <div className="flex items-center gap-2 bg-red-600/80 px-2 py-1 rounded">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-white text-xs" />
            <span className="text-white text-xs">Offline</span>
          </div>
        </div>
      </div>

      {/* Dummy Content */}
      <div className="w-full h-64 flex flex-col items-center justify-center">
        <FontAwesomeIcon icon={faVideo} className="text-gray-600 text-6xl mb-4" />
        <p className="text-gray-500 text-lg">Camera Unavailable</p>
        <p className="text-gray-600 text-sm mt-2">Click to view details</p>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
          <FontAwesomeIcon icon={faExpand} className="text-white text-2xl" />
        </div>
      </div>
    </div>
  );
};

DummyCamera.propTypes = {
  cameraId: PropTypes.number.isRequired,
  cameraName: PropTypes.string.isRequired,
};

// Live camera feed component
const LiveCamera = ({ cameraId, cameraName, videoFeedUrl, isOnline = true }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  if (imageError || !isOnline) {
    return <DummyCamera cameraId={cameraId} cameraName={cameraName} />;
  }

  return (
    <div 
      className="relative bg-[#4A4A4A] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300 group"
      onClick={() => navigate(`/camera/${cameraId}`)}
    >
      {/* Camera Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faVideo} className="text-green-400" />
            <span className="text-white font-medium">{cameraName}</span>
          </div>
          <div className="flex items-center gap-1 bg-green-600/80 px-2 py-1 rounded">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white text-xs">Live</span>
          </div>
        </div>
      </div>

      {/* Video Feed */}
      <img
        src={videoFeedUrl}
        alt={`${cameraName} Feed`}
        className="w-full h-64 object-cover"
        onError={() => setImageError(true)}
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
          <FontAwesomeIcon icon={faExpand} className="text-white text-2xl" />
        </div>
      </div>
    </div>
  );
};

LiveCamera.propTypes = {
  cameraId: PropTypes.number.isRequired,
  cameraName: PropTypes.string.isRequired,
  videoFeedUrl: PropTypes.string.isRequired,
  isOnline: PropTypes.bool,
};

// Main CameraGrid component
const CameraGrid = () => {
  // Define cameras - you can modify this to fetch from API
  const cameras = [
    { id: 1, name: "Main Entrance", url: "http://localhost:5000/video_feed", isOnline: true },
    { id: 2, name: "Parking Area", url: "http://localhost:5000/video_feed", isOnline: false },
    { id: 3, name: "Corridor A", url: "http://localhost:5000/video_feed", isOnline: false },
    { id: 4, name: "Emergency Exit", url: "http://localhost:5000/video_feed", isOnline: false },
    { id: 5, name: "Lobby", url: "http://localhost:5000/video_feed", isOnline: false },
    { id: 6, name: "Stairwell B", url: "http://localhost:5000/video_feed", isOnline: false },
  ];

  const onlineCameras = cameras.filter(cam => cam.isOnline).length;

  return (
    <div className="w-full">
      {/* Header Stats */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faVideo} className="text-green-400" />
            <span className="text-lg font-medium">
              {onlineCameras} / {cameras.length} Cameras Online
            </span>
          </div>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cameras.map((camera) => (
          camera.isOnline ? (
            <LiveCamera
              key={camera.id}
              cameraId={camera.id}
              cameraName={camera.name}
              videoFeedUrl={camera.url}
              isOnline={camera.isOnline}
            />
          ) : (
            <DummyCamera
              key={camera.id}
              cameraId={camera.id}
              cameraName={camera.name}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default CameraGrid;
