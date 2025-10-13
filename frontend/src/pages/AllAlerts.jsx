import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faSortAmountDown,
  faDownload,
  faExclamationTriangle,
  faClock,
  faMapMarkerAlt,
  faUserGroup,
  faExpand,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import EmptyState from "../components/EmptyState";
import { useAlerts } from "../hooks/useApi";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { getGestureEmoji, getGestureName } from "../utils/gestureUtils";

// Alert Card with Screenshot Component
const AlertCardWithScreenshot = ({ alert, onDownload }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getAlertIcon = (type) => {
    switch (type) {
      case "distress":
        return faExclamationTriangle;
      case "lone_woman_night":
        return faClock;
      case "woman_surrounded":
      case "woman_surrounded_spatial":
        return faUserGroup;
      default:
        return faExclamationTriangle;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case "distress":
        return "from-red-600 to-red-700";
      case "lone_woman_night":
        return "from-yellow-600 to-yellow-700";
      case "woman_surrounded":
      case "woman_surrounded_spatial":
        return "from-orange-600 to-orange-700";
      default:
        return "from-red-600 to-red-700";
    }
  };

  const getAlertTitle = (type) => {
    switch (type) {
      case "distress":
        return "Distress Signal";
      case "lone_woman_night":
        return "Lone Woman at Night";
      case "woman_surrounded":
        return "Woman Surrounded";
      case "woman_surrounded_spatial":
        return "Spatial Risk Detected";
      default:
        return "Alert";
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN", {
      timeZone: 'Asia/Kolkata',
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short"
    });
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  const handleCardClick = () => {
    navigate(`/alert/${alert.id}`);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    onDownload(alert.id);
  };

  const openFullscreen = (e) => {
    e.stopPropagation();
    const imageUrl = API.getAlertImageUrl(alert.id);
    window.open(imageUrl, '_blank');
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-[#3A3A3A] rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
    >
      {/* Screenshot/Image Section */}
      <div className="relative h-48 bg-gray-800">
        {!imageError ? (
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
            <img
              src={API.getAlertImageUrl(alert.id)}
              alt={`Alert ${alert.id}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={`w-full h-full object-cover ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            />
            {/* Image overlay buttons */}
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={openFullscreen}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg backdrop-blur-sm"
                title="View fullscreen"
              >
                <FontAwesomeIcon icon={faExpand} />
              </button>
              <button
                onClick={handleDownload}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg backdrop-blur-sm"
                title="Download screenshot"
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <FontAwesomeIcon icon={faCamera} className="text-4xl mb-2" />
            <p className="text-sm">Screenshot not available</p>
          </div>
        )}
      </div>

      {/* Alert Info Section */}
      <div className={`p-4 bg-gradient-to-r ${getAlertColor(alert.alert_type)}`}>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-2 rounded-full">
            <FontAwesomeIcon
              icon={getAlertIcon(alert.alert_type)}
              className="text-white text-lg"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">
              {getAlertTitle(alert.alert_type)}
            </h3>
          </div>
        </div>

        <div className="space-y-2 text-white/90 text-sm">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faClock} className="text-white/70" />
            <span>{formatDate(alert.timestamp)}</span>
          </div>

          {alert.gesture && (
            <div className="flex items-center gap-2">
              <span className="text-lg">{getGestureEmoji(alert.gesture)}</span>
              <span className="capitalize font-medium">{getGestureName(alert.gesture)}</span>
            </div>
          )}

          {(alert.male_count >= 0 || alert.female_count >= 0) && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUserGroup} className="text-white/70" />
              <span>
                {alert.male_count} Male • {alert.female_count} Female
              </span>
            </div>
          )}

          {(alert.latitude && alert.longitude) && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white/70" />
              <span className="truncate">
                {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-white/20">
          <span className="text-white/60 text-xs">
            Alert ID: #{alert.id}
          </span>
        </div>
      </div>
    </div>
  );
};

AlertCardWithScreenshot.propTypes = {
  alert: PropTypes.shape({
    id: PropTypes.number.isRequired,
    alert_type: PropTypes.string.isRequired,
    timestamp: PropTypes.string,
    gesture: PropTypes.string,
    male_count: PropTypes.number,
    female_count: PropTypes.number,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }).isRequired,
  onDownload: PropTypes.func.isRequired,
};

const AllAlerts = () => {
  const { alerts, loading, error } = useAlerts(5000); // Poll every 5 seconds
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    if (alerts && alerts.length > 0) {
      let filtered = [...alerts];

      // Filter by type
      if (filterType !== "all") {
        filtered = filtered.filter((alert) => alert.alert_type === filterType);
      }

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(
          (alert) =>
            alert.alert_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (alert.gesture && alert.gesture.toLowerCase().includes(searchTerm.toLowerCase())) ||
            alert.id.toString().includes(searchTerm)
        );
      }

      // Sort
      if (sortOrder === "newest") {
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      } else {
        filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      }

      setFilteredAlerts(filtered);
    } else {
      setFilteredAlerts([]);
    }
  }, [alerts, searchTerm, filterType, sortOrder]);

  const downloadAlertImage = async (alertId) => {
    try {
      await API.downloadAlertImage(alertId);
    } catch (err) {
      console.error("Failed to download alert image:", err);
    }
  };

  const alertTypes = [
    { value: "all", label: "All Alerts" },
    { value: "distress", label: "Distress" },
    { value: "lone_woman_night", label: "Lone Woman Night" },
    { value: "woman_surrounded", label: "Woman Surrounded" },
    { value: "woman_surrounded_spatial", label: "Spatial Risk" },
  ];

  if (loading && !alerts) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading alerts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">Error loading alerts: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2C2C2C] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-blue-500 text-3xl"
            />
            <h1 className="text-4xl font-bold text-white">
              Recent Alerts
            </h1>
          </div>

          <p className="text-gray-400">
            Showing recent alerts • Total: {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by ID, type, or gesture..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faFilter}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              {alertTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faSortAmountDown}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="pl-10 pr-8 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Content Grid */}
        {filteredAlerts.length === 0 ? (
          <EmptyState
            type={searchTerm || filterType !== "all" ? "filtered" : (alerts && alerts.length === 0 ? "safe" : "alerts")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlerts.map((alert) => (
              <AlertCardWithScreenshot
                key={alert.id}
                alert={alert}
                onDownload={downloadAlertImage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAlerts;
