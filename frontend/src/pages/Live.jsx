import { useState } from "react";
import CameraGrid from "../components/CameraGrid.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

const Live = () => {
  const [selectedLocation, setSelectedLocation] = useState("All");

  // Get unique locations from cameras
  const locations = [
    "All",
    "Main Entrance",
    "Parking Lot",
    "Corridor A",
    "Corridor B",
    "Reception Area",
    "Emergency Exit",
  ];

  return (
    <div className="min-h-screen w-full bg-[#2C2C2C] p-6 flex flex-col gap-6 text-white">
      {/* Header with Location Filter */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FontAwesomeIcon icon={faVideo} className="text-blue-500" />
          Live Camera Monitoring
        </h1>

        {/* Location Filter */}
        <div className="flex items-center gap-3 bg-[#3A3A3A] px-4 py-2 rounded-lg shadow-lg">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500" />
          <span className="text-sm font-semibold">Filter by Location:</span>
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
      </div>

      {/* Camera Grid - Full Width */}
      <div className="flex flex-col w-full bg-[#3A3A3A] rounded-xl p-6 shadow-lg">
        <CameraGrid selectedLocation={selectedLocation} />
      </div>
    </div>
  );
};

export default Live;
