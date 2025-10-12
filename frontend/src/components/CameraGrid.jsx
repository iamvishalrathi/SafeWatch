import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faExclamationTriangle, faExpand, faMapMarkerAlt, faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

// Dummy camera to show when camera is not available
const DummyCamera = ({ cameraId, position, location }) => {
    const navigate = useNavigate();

    return (
        <div
            className="relative bg-[#4A4A4A] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300 group"
            onClick={() => navigate(`/camera/${cameraId}`)}
        >
            {/* Camera Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-3 z-10">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faVideo} className="text-gray-400" />
                            <span className="text-white font-medium">Camera #{cameraId}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 text-gray-300 text-xs ml-5">
                            <div className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faDoorOpen} className="text-xs" />
                                <span>{position}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
                                <span>{location}</span>
                            </div>
                        </div>
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
    position: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
};

// Live camera feed component
const LiveCamera = ({ cameraId, position, location, videoFeedUrl, isEnabled, onToggle }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);

    const handleCardClick = (e) => {
        // Only navigate if not clicking the toggle switch
        if (!e.target.closest('.toggle-switch')) {
            navigate(`/camera/${cameraId}`);
        }
    };

    return (
        <div
            className="relative bg-[#4A4A4A] rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300 group"
            onClick={handleCardClick}
        >
            {/* Camera Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-3 z-10">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faVideo} className={isEnabled ? "text-green-400" : "text-gray-400"} />
                            <span className="text-white font-medium">Camera #{cameraId}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 text-gray-300 text-xs ml-5">
                            <div className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faDoorOpen} className="text-xs" />
                                <span>{position}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-xs" />
                                <span>{location}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Toggle Switch */}
                    <div className="toggle-switch flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isEnabled}
                                onChange={() => onToggle(cameraId)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Video Feed or Disabled State */}
            {isEnabled ? (
                imageError ? (
                    <div className="w-full h-64 flex flex-col items-center justify-center bg-[#3A3A3A]">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-6xl mb-4" />
                        <p className="text-gray-400 text-lg">Feed Error</p>
                    </div>
                ) : (
                    <img
                        src={videoFeedUrl}
                        alt={`Camera ${cameraId} Feed`}
                        className="w-full h-64 object-cover"
                        onError={() => setImageError(true)}
                    />
                )
            ) : (
                <div className="w-full h-64 flex flex-col items-center justify-center bg-[#3A3A3A]">
                    <FontAwesomeIcon icon={faVideo} className="text-gray-600 text-6xl mb-4" />
                    <p className="text-gray-400 text-lg">Camera Disabled</p>
                    <p className="text-gray-500 text-sm mt-2">Turn on to view feed</p>
                </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/20">
                    <FontAwesomeIcon icon={faExpand} className="text-white text-2xl" />
                </div>
            </div>
        </div>
    );
};

LiveCamera.propTypes = {
    cameraId: PropTypes.number.isRequired,
    position: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    videoFeedUrl: PropTypes.string.isRequired,
    isEnabled: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
};

// Main CameraGrid component
const CameraGrid = ({ selectedLocation = "All" }) => {
    // Define initial cameras with id, position (specific place), and location (area)
    const initialCameras = [
        { 
            id: 1, 
            position: "Main Entrance", 
            location: "Rohini", 
            url: "http://localhost:5000/video_feed", 
            isOnline: true,
            isEnabled: true  // Controls if camera is turned on/off
        },
        { 
            id: 2, 
            position: "Parking Area", 
            location: "Rohini", 
            url: "http://localhost:5000/video_feed", 
            isOnline: false,
            isEnabled: true
        },
        { 
            id: 3, 
            position: "Hall", 
            location: "Narela", 
            url: "http://localhost:5000/video_feed", 
            isOnline: false,
            isEnabled: true
        },
        { 
            id: 4, 
            position: "Main Door", 
            location: "Narela", 
            url: "http://localhost:5000/video_feed", 
            isOnline: false,
            isEnabled: true
        },
        { 
            id: 5, 
            position: "Reception", 
            location: "Dwarka", 
            url: "http://localhost:5000/video_feed", 
            isOnline: false,
            isEnabled: true
        },
        { 
            id: 6, 
            position: "Emergency Exit", 
            location: "Dwarka", 
            url: "http://localhost:5000/video_feed", 
            isOnline: false,
            isEnabled: true
        },
    ];

    // State to manage camera enabled status
    const [cameras, setCameras] = useState(initialCameras);

    // Toggle camera enabled/disabled
    const toggleCamera = (cameraId) => {
        setCameras(prevCameras =>
            prevCameras.map(camera =>
                camera.id === cameraId
                    ? { ...camera, isEnabled: !camera.isEnabled }
                    : camera
            )
        );
    };

    // Filter cameras based on selected location
    const filteredCameras =
        selectedLocation === "All"
            ? cameras
            : cameras.filter((camera) => camera.location === selectedLocation);

    const enabledCameras = filteredCameras.filter(cam => cam.isEnabled).length;

    return (
        <div className="w-full">
            {/* Header Stats */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faVideo} className="text-green-400" />
                        <span className="text-lg font-medium">
                            {enabledCameras} / {filteredCameras.length} Cameras Enabled
                            {selectedLocation !== "All" && ` in ${selectedLocation}`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Camera Grid */}
            {filteredCameras.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCameras.map((camera) => (
                        camera.isOnline ? (
                            <LiveCamera
                                key={camera.id}
                                cameraId={camera.id}
                                position={camera.position}
                                location={camera.location}
                                videoFeedUrl={camera.url}
                                isEnabled={camera.isEnabled}
                                onToggle={toggleCamera}
                            />
                        ) : (
                            <DummyCamera
                                key={camera.id}
                                cameraId={camera.id}
                                position={camera.position}
                                location={camera.location}
                            />
                        )
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-400">
                    <FontAwesomeIcon icon={faVideo} className="text-6xl mb-4" />
                    <p className="text-xl">No cameras found for {selectedLocation}</p>
                </div>
            )}
        </div>
    );
};

CameraGrid.propTypes = {
    selectedLocation: PropTypes.string,
};

export default CameraGrid;
