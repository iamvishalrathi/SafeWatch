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
  faInfoCircle,
  faTrash,
  faTrashAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import EmptyState from "../components/EmptyState";
import { useAlerts } from "../hooks/useApi";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { getGestureEmoji, getGestureName } from "../utils/gestureUtils";

// Alert Card with Screenshot Component
const AlertCardWithScreenshot = ({ alert, onDownload, onDelete }) => {
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

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete Alert #${alert.id}?`)) {
      onDelete(alert.id);
    }
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
              <button
                onClick={handleDelete}
                className="bg-red-600/70 hover:bg-red-700 text-white p-2 rounded-lg backdrop-blur-sm"
                title="Delete alert"
              >
                <FontAwesomeIcon icon={faTrash} />
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
  onDelete: PropTypes.func.isRequired,
};

const AllAlerts = () => {
  const { alerts, loading, error, refetch } = useAlerts(5000); // Poll every 5 seconds
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [localAlerts, setLocalAlerts] = useState([]);
  const [deleting, setDeleting] = useState(false);

  // Update local alerts when API alerts change
  useEffect(() => {
    if (alerts) {
      setLocalAlerts(alerts);
    }
  }, [alerts]);

  useEffect(() => {
    if (localAlerts && localAlerts.length > 0) {
      let filtered = [...localAlerts];

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
  }, [localAlerts, searchTerm, filterType, sortOrder]);

  const downloadAlertImage = async (alertId) => {
    try {
      await API.downloadAlertImage(alertId);
    } catch (err) {
      console.error("Failed to download alert image:", err);
    }
  };

  const deleteAlert = async (alertId) => {
    setDeleting(true);
    try {
      await API.deleteAlert(alertId);
      // Refetch alerts from backend to get updated list
      await refetch();
    } catch (err) {
      console.error("Failed to delete alert:", err);
      alert("Failed to delete alert. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const deleteAllAlerts = async () => {
    if (window.confirm(`Are you sure you want to delete ALL ${localAlerts.length} alerts? This action cannot be undone.`)) {
      setDeleting(true);
      try {
        await API.deleteAllAlerts();
        // Refetch alerts from backend to get updated (empty) list
        await refetch();
      } catch (err) {
        console.error("Failed to delete all alerts:", err);
        alert("Failed to delete all alerts. Please try again.");
      } finally {
        setDeleting(false);
      }
    }
  };

  const alertTypesInfo = [
    {
      type: "distress",
      icon: faExclamationTriangle,
      color: "text-red-500",
      title: "Distress Signal",
      description: "Detected when a person makes a distress hand gesture (thumb inside palm/fist). This indicates someone may need immediate help.",
      priority: "CRITICAL",
      priorityColor: "text-red-500"
    },
    {
      type: "lone_woman_night",
      icon: faClock,
      color: "text-yellow-500",
      title: "Lone Woman at Night",
      description: "Triggered when a woman is detected alone during nighttime hours (after 8 PM), which may pose safety risks.",
      priority: "MEDIUM",
      priorityColor: "text-yellow-500"
    },
    {
      type: "woman_surrounded",
      icon: faUserGroup,
      color: "text-orange-500",
      title: "Woman Surrounded by Men",
      description: "Alert triggered when a woman is detected surrounded by multiple men in close proximity, indicating a potentially unsafe situation.",
      priority: "HIGH",
      priorityColor: "text-orange-500"
    },
    {
      type: "woman_surrounded_spatial",
      icon: faUserGroup,
      color: "text-orange-500",
      title: "Spatial Risk Detection",
      description: "Advanced spatial analysis detected a woman in close proximity to men based on position and movement patterns, indicating potential risk.",
      priority: "HIGH",
      priorityColor: "text-orange-500"
    },
  ];

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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-blue-500 text-3xl"
              />
              <h1 className="text-4xl font-bold text-white">
                All Alerts
              </h1>
              <button
                onClick={() => setShowInfoModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                title="Alert Types Information"
              >
                <FontAwesomeIcon icon={faInfoCircle} />
              </button>
            </div>

            {localAlerts.length > 0 && (
              <button
                onClick={deleteAllAlerts}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                title="Delete all alerts"
              >
                <FontAwesomeIcon icon={faTrashAlt} />
                <span>Delete All</span>
              </button>
            )}
          </div>

          <p className="text-gray-400">
            Showing all alerts • Total: {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''}
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
            type={searchTerm || filterType !== "all" ? "filtered" : (localAlerts && localAlerts.length === 0 ? "safe" : "alerts")}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlerts.map((alert) => (
              <AlertCardWithScreenshot
                key={alert.id}
                alert={alert}
                onDownload={downloadAlertImage}
                onDelete={deleteAlert}
              />
            ))}
          </div>
        )}

        {/* Alert Types Info Modal */}
        {showInfoModal && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowInfoModal(false)}
          >
            <div
              className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 text-2xl" />
                  <h2 className="text-2xl font-bold text-white">Alert Types Information</h2>
                </div>
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="text-gray-400 hover:text-white transition-colors p-2"
                >
                  <FontAwesomeIcon icon={faTimes} size="lg" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                <p className="text-gray-300 text-lg">
                  Our AI-powered system monitors for various safety scenarios. Here&apos;s what each alert type means:
                </p>

                {alertTypesInfo.map((alertInfo) => (
                  <div
                    key={alertInfo.type}
                    className="bg-gray-700/50 rounded-lg p-6 border border-gray-600 hover:border-gray-500 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`${alertInfo.color} bg-gray-800 p-4 rounded-xl`}>
                        <FontAwesomeIcon icon={alertInfo.icon} className="text-2xl" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-white">{alertInfo.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${alertInfo.priority === 'CRITICAL'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : alertInfo.priority === 'HIGH'
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}>
                            {alertInfo.priority} PRIORITY
                          </span>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{alertInfo.description}</p>

                        {/* Example indicators */}
                        <div className="mt-4 pt-4 border-t border-gray-600">
                          <div className="flex flex-wrap gap-2 text-sm">
                            <span className="text-gray-400">Detected by:</span>
                            {alertInfo.type === 'distress' && (
                              <>
                                <span className="bg-gray-800 px-2 py-1 rounded text-blue-400">Hand Gesture Detection</span>
                                <span className="bg-gray-800 px-2 py-1 rounded text-blue-400">Real-time Monitoring</span>
                              </>
                            )}
                            {alertInfo.type === 'lone_woman_night' && (
                              <>
                                <span className="bg-gray-800 px-2 py-1 rounded text-yellow-400">Gender Detection</span>
                                <span className="bg-gray-800 px-2 py-1 rounded text-yellow-400">Time Analysis</span>
                                <span className="bg-gray-800 px-2 py-1 rounded text-yellow-400">Person Count</span>
                              </>
                            )}
                            {(alertInfo.type === 'woman_surrounded' || alertInfo.type === 'woman_surrounded_spatial') && (
                              <>
                                <span className="bg-gray-800 px-2 py-1 rounded text-orange-400">Gender Detection</span>
                                <span className="bg-gray-800 px-2 py-1 rounded text-orange-400">Spatial Analysis</span>
                                <span className="bg-gray-800 px-2 py-1 rounded text-orange-400">Proximity Detection</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Additional Info */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-blue-400 text-xl mt-1" />
                    <div>
                      <h4 className="text-white font-semibold mb-2">How it works</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Our system uses advanced computer vision and AI to analyze video feeds in real-time.
                        It detects people, identifies gender, recognizes hand gestures, and analyzes spatial
                        relationships to identify potentially unsafe situations. When a risk is detected,
                        an alert is immediately generated with a captured frame and relevant details.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6">
                <button
                  onClick={() => setShowInfoModal(false)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAlerts;
