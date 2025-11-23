import { useState, useEffect } from "react";
import CameraGrid from "../components/CameraGrid.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faMapMarkerAlt,
  faPlus,
  faTimes,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

// Camera Modal Component
const CameraModal = ({ onSave, onClose }) => {
  const [formData, setFormData] = useState({
    id: Date.now(),
    position: "",
    location: "",
    locality: "",
    lat: 28.6139,
    lng: 77.209,
    url: "http://localhost:5000/video_feed",
    isOnline: false,
    isEnabled: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#2C2C2C] rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Add New Camera</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Camera ID
            </label>
            <input
              type="number"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: parseInt(e.target.value) })}
              className="w-full bg-[#3A3A3A] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Position
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="e.g., Main Entrance"
              className="w-full bg-[#3A3A3A] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Location (Area)
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Rohini"
              className="w-full bg-[#3A3A3A] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Locality / Building
            </label>
            <input
              type="text"
              value={formData.locality}
              onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
              placeholder="e.g., Sector 10, Mall Complex"
              className="w-full bg-[#3A3A3A] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.lat}
                onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                className="w-full bg-[#3A3A3A] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.lng}
                onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                className="w-full bg-[#3A3A3A] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-300">
              <input
                type="checkbox"
                checked={formData.isOnline}
                onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span>Camera Online</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
            >
              <FontAwesomeIcon icon={faSave} />
              Add Camera
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Live = () => {
  // Load cameras from localStorage or use defaults
  const loadCameras = () => {
    const savedCameras = localStorage.getItem('cameras');
    if (savedCameras) {
      return JSON.parse(savedCameras);
    }
    return [
      { id: 1, position: "Main Entrance", location: "Rohini", locality: "Sector 10", lat: 28.7041, lng: 77.1025, url: "http://localhost:5000/video_feed", isOnline: true, isEnabled: true },
      { id: 2, position: "Parking Area", location: "Rohini", locality: "Sector 15", lat: 28.7050, lng: 77.1030, url: "http://localhost:5000/video_feed", isOnline: false, isEnabled: true },
      { id: 3, position: "Hall", location: "Narela", locality: "Industrial Area", lat: 28.8500, lng: 77.0900, url: "http://localhost:5000/video_feed", isOnline: false, isEnabled: true },
      { id: 4, position: "Main Door", location: "Narela", locality: "Market Complex", lat: 28.8510, lng: 77.0910, url: "http://localhost:5000/video_feed", isOnline: false, isEnabled: true },
      { id: 5, position: "Reception", location: "Dwarka", locality: "Sector 21", lat: 28.5921, lng: 77.0460, url: "http://localhost:5000/video_feed", isOnline: false, isEnabled: true },
      { id: 6, position: "Emergency Exit", location: "Dwarka", locality: "Mall Road", lat: 28.5930, lng: 77.0470, url: "http://localhost:5000/video_feed", isOnline: false, isEnabled: true },
    ];
  };

  const [cameras, setCameras] = useState(loadCameras);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedLocality, setSelectedLocality] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);

  // Save cameras to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cameras', JSON.stringify(cameras));
  }, [cameras]);

  // Add new camera
  const handleAddCamera = (newCamera) => {
    setCameras([...cameras, newCamera]);
  };

  // Get unique locations and localities from current cameras
  const locations = ["All", ...new Set(cameras.map(cam => cam.location))];
  
  // Filter localities based on selected location
  const getLocalities = () => {
    if (selectedLocation === "All") {
      return ["All", ...new Set(cameras.map(cam => cam.locality))];
    }
    const filteredCameras = cameras.filter(cam => cam.location === selectedLocation);
    return ["All", ...new Set(filteredCameras.map(cam => cam.locality))];
  };
  
  const localities = getLocalities();
  
  // Reset locality when location changes
  useEffect(() => {
    setSelectedLocality("All");
  }, [selectedLocation]);

  return (
    <div className="min-h-screen w-full bg-[#2C2C2C] p-6 flex flex-col gap-6 text-white">
      {/* Header with Location Filter and Add Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FontAwesomeIcon icon={faVideo} className="text-blue-500" />
          Live Camera Monitoring
        </h1>

        <div className="flex items-center gap-3">
          {/* Add Camera Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 font-semibold"
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add Camera</span>
          </button>

          {/* Location Filter */}
          <div className="flex items-center gap-3 bg-[#3A3A3A] px-4 py-2 rounded-lg shadow-lg">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500" />
            <span className="text-sm font-semibold">Location:</span>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-[#4A4A4A] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Locality Filter */}
          <div className="flex items-center gap-3 bg-[#3A3A3A] px-4 py-2 rounded-lg shadow-lg">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-purple-500" />
            <span className="text-sm font-semibold">Locality:</span>
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="bg-[#4A4A4A] text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              {localities.map((locality) => (
                <option key={locality} value={locality}>
                  {locality}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Camera Grid - Full Width */}
      <div className="flex flex-col w-full bg-[#3A3A3A] rounded-xl p-6 shadow-lg">
        <CameraGrid 
          selectedLocation={selectedLocation}
          selectedLocality={selectedLocality}
          cameras={cameras}
          setCameras={setCameras}
          setShowAddModal={setShowAddModal}
        />
      </div>

      {/* Add Camera Modal */}
      {showAddModal && (
        <CameraModal
          onSave={handleAddCamera}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default Live;
