import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faSortAmountDown,
  faExclamationTriangle,
  faClock,
  faMapMarkerAlt,
  faUserGroup,
  faCamera,
  faInfoCircle,
  faTrash,
  faTrashAlt,
  faTimes,
  faHandFist,
  faHandPeace,
  faHand,
  faUser,
  faBaby,
  faChild,
  faPerson,
  faPersonCane,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";
import EmptyState from "../components/EmptyState";
import { useAlerts } from "../hooks/useApi";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import { getGestureName } from "../utils/gestureUtils";

// Helper function to get age icon based on age range
const getAgeIcon = (ageRange) => {
  if (!ageRange) return faUser;

  const match = ageRange.match(/\d+/);
  if (!match) return faUser;

  const age = parseInt(match[0]);

  if (age < 4) return faBaby;
  if (age < 13) return faChild;
  if (age < 60) return faPerson;
  return faPersonCane;
};

// Helper function to get gesture icon
const getGestureIcon = (gestureType) => {
  switch (gestureType) {
    case 'thumb_palm':
      return faHandFist;
    case 'ok_sign':
      return faHandPeace;
    case 'wave':
      return faHand;
    default:
      return faHand;
  }
};

// Helper function to get alert emoji
const getAlertEmoji = (type) => {
  switch (type) {
    case "Emergency Signal":
      return "✊";
    case "Distress":
      return "👌";
    case "Attention":
      return "👋";
    case "Lone Woman":
      return "👤";
    case "Woman Surrounded":
      return "👥";
    case "Woman Surrounded Spatial":
      return "📍";
    default:
      return "⚠️";
  }
};

// Helper function to get alert icon color
const getAlertIconColor = (type) => {
  switch (type) {
    case "Emergency Signal":
      return "text-red-500";
    case "Distress":
      return "text-orange-500";
    case "Attention":
      return "text-yellow-500";
    case "Lone Woman":
      return "text-purple-500";
    case "Woman Surrounded":
    case "Woman Surrounded Spatial":
      return "text-orange-500";
    default:
      return "text-red-500";
  }
};

// Alert Card with Screenshot Component
const AlertCardWithScreenshot = ({ alert, onDelete }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getAlertIcon = (type) => {
    switch (type) {
      case "Emergency Signal":
        return faExclamationTriangle;
      case "Distress":
        return faExclamationTriangle;
      case "Attention":
        return faInfoCircle;
      case "Lone Woman":
        return faClock;
      case "Woman Surrounded":
      case "Woman Surrounded Spatial":
        return faUserGroup;
      default:
        return faExclamationTriangle;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case "Emergency Signal":
        return "from-red-600 to-red-700";
      case "Distress":
        return "from-orange-600 to-orange-700";
      case "Attention":
        return "from-yellow-600 to-yellow-700";
      case "Lone Woman":
        return "from-purple-600 to-purple-700";
      case "Woman Surrounded":
      case "Woman Surrounded Spatial":
        return "from-orange-600 to-orange-700";
      default:
        return "from-red-600 to-red-700";
    }
  };

  const getAlertTitle = (type) => {
    switch (type) {
      case "Emergency Signal":
        return "Emergency Signal";
      case "Distress":
        return "Distress Signal";
      case "Attention":
        return "Attention Required";
      case "Lone Woman":
        return "Lone Woman Detected";
      case "Woman Surrounded":
        return "Woman Surrounded";
      case "Woman Surrounded Spatial":
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

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete Alert #${alert.id}?`)) {
      onDelete(alert.id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-[#3A3A3A] rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-gray-600"
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
            {/* Priority Badge - Top Left */}
            <div className="absolute top-2 left-2">
              {(alert.alert_type === "Emergency Signal") && (
                <span className="bg-red-600/90 px-3 py-1 rounded-lg text-xs font-bold text-white uppercase animate-pulse backdrop-blur-sm shadow-lg">
                  Critical
                </span>
              )}
              {(alert.alert_type === "Distress" || alert.alert_type === "Woman Surrounded" || alert.alert_type === "Woman Surrounded Spatial") && (
                <span className="bg-orange-600/90 px-3 py-1 rounded-lg text-xs font-semibold text-white uppercase backdrop-blur-sm shadow-lg">
                  High
                </span>
              )}
              {(alert.alert_type === "Attention" || alert.alert_type === "Lone Woman") && (
                <span className="bg-yellow-600/90 px-3 py-1 rounded-lg text-xs font-semibold text-white uppercase backdrop-blur-sm shadow-lg">
                  Medium
                </span>
              )}
            </div>
            {/* Image overlay buttons */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
      <div className={`p-4 bg-gradient-to-r ${getAlertColor(alert.alert_type)} flex-1 flex flex-col`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`${getAlertIconColor(alert.alert_type)} bg-gray-800 p-3 rounded-xl flex-shrink-0 relative`}>
            <FontAwesomeIcon
              icon={getAlertIcon(alert.alert_type)}
              className="text-xl"
            />
            <span className="absolute -top-1 -right-1 text-xl">{getAlertEmoji(alert.alert_type)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base truncate">
              {getAlertTitle(alert.alert_type)}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-white/90 text-sm mb-3">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faHashtag} className="text-white/70 flex-shrink-0" />
            <span className="truncate">
              Alert ID: {alert.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faClock} className="text-white/70 flex-shrink-0" />
            <span className="truncate">{formatDate(alert.timestamp)}</span>
          </div>

          {(alert.male_count >= 0 || alert.female_count >= 0) && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUserGroup} className="text-white/70 flex-shrink-0" />
              <span className="truncate">
                {alert.male_count} Male • {alert.female_count} Female
              </span>
            </div>
          )}

          {/* Gesture or Age Display */}
          {alert.gesture ? (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={getGestureIcon(alert.gesture)} className="text-white/70 flex-shrink-0" />
              <span className="truncate">{getGestureName(alert.gesture)}</span>
            </div>
          ) : (alert.alert_type === 'Lone Woman' || alert.alert_type === 'Woman Surrounded' || alert.alert_type === 'Woman Surrounded Spatial') && alert.age_range ? (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={getAgeIcon(alert.age_range)} className="text-white/70 flex-shrink-0" />
              <span className="truncate">Age: {alert.age_range}</span>
            </div>
          ) : <div></div>}
        </div>

        {(alert.latitude && alert.longitude) && (
          <div className="mt-auto pt-2 border-t border-white/20">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white/70 flex-shrink-0" />
                <span className="truncate">
                  {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                </span>
              </div>
              {alert.camera?.location && (
                <span className="truncate">
                  {alert.camera.location}
                </span>
              )}
            </div>
          </div>
        )}
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
    age_range: PropTypes.string,
    camera: PropTypes.shape({
      location: PropTypes.string,
      locality: PropTypes.string,
    }),
  }).isRequired,
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
            alert.id.toString().includes(searchTerm) ||
            (alert.camera?.location && alert.camera.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (alert.camera?.locality && alert.camera.locality.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const deleteAlert = async (alertId) => {
    try {
      await API.deleteAlert(alertId);
      // Refetch alerts from backend to get updated list
      await refetch();
    } catch (err) {
      console.error("Failed to delete alert:", err);
      alert("Failed to delete alert. Please try again.");
    }
  };

  const deleteAllAlerts = async () => {
    if (window.confirm(`Are you sure you want to delete ALL ${localAlerts.length} alerts? This action cannot be undone.`)) {
      try {
        await API.deleteAllAlerts();
        // Refetch alerts from backend to get updated (empty) list
        await refetch();
      } catch (err) {
        console.error("Failed to delete all alerts:", err);
        alert("Failed to delete all alerts. Please try again.");
      }
    }
  };

  const alertTypesInfo = [
    {
      type: "Emergency Signal",
      icon: faExclamationTriangle,
      color: "text-red-500",
      title: "Emergency Signal",
      description: "Detected when a person makes a Thumb-Palm gesture (✊). This indicates someone needs immediate emergency help.",
      priority: "CRITICAL",
      priorityColor: "text-red-500",
      emoji: "✊"
    },
    {
      type: "Distress",
      icon: faExclamationTriangle,
      color: "text-orange-500",
      title: "Distress Signal",
      description: "Detected when a person makes an OK Sign gesture (👌). This indicates someone may need help.",
      priority: "HIGH",
      priorityColor: "text-orange-500",
      emoji: "👌"
    },
    {
      type: "Attention",
      icon: faInfoCircle,
      color: "text-yellow-500",
      title: "Attention Required",
      description: "Detected when a person makes a Wave gesture (👋). This indicates someone needs attention.",
      priority: "MEDIUM",
      priorityColor: "text-yellow-500",
      emoji: "👋"
    },
    {
      type: "Lone Woman",
      icon: faClock,
      color: "text-purple-500",
      title: "Lone Woman Detected",
      description: "Triggered when a woman is detected alone, which may pose safety risks (works day and night).",
      priority: "MEDIUM",
      priorityColor: "text-purple-500",
      emoji: "👤"
    },
    {
      type: "Woman Surrounded",
      icon: faUserGroup,
      color: "text-orange-500",
      title: "Woman Surrounded by Men",
      description: "Alert triggered when a woman is detected surrounded by multiple men in close proximity, indicating a potentially unsafe situation.",
      priority: "HIGH",
      priorityColor: "text-orange-500",
      emoji: "👥"
    },
    {
      type: "Woman Surrounded Spatial",
      icon: faUserGroup,
      color: "text-orange-500",
      title: "Spatial Risk Detection",
      description: "Advanced spatial analysis detected a woman in close proximity to men based on position and movement patterns, indicating potential risk.",
      priority: "HIGH",
      priorityColor: "text-orange-500",
      emoji: "📍"
    },
  ];

  const alertTypes = [
    { value: "all", label: "All Alerts" },
    { value: "Emergency Signal", label: "Emergency Signal" },
    { value: "Distress", label: "Distress" },
    { value: "Attention", label: "Attention" },
    { value: "Lone Woman", label: "Lone Woman" },
    { value: "Woman Surrounded", label: "Woman Surrounded" },
    { value: "Woman Surrounded Spatial", label: "Spatial Risk" },
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

          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-gray-400">
              Showing all alerts • Total: <span className="text-white font-semibold">{filteredAlerts.length}</span> alert{filteredAlerts.length !== 1 ? 's' : ''}
            </p>
            {filterType !== "all" && (
              <span className="text-blue-400 text-sm">
                Filtered by: <span className="font-semibold">{alertTypes.find(t => t.value === filterType)?.label}</span>
              </span>
            )}
          </div>
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
              placeholder="Search by ID, location, or locality..."
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

          {/* Clear Filters Button */}
          {(searchTerm || filterType !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
              title="Clear all filters"
            >
              <FontAwesomeIcon icon={faTimes} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Alert Statistics Summary */}
        {localAlerts.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold flex items-center gap-2">
                <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />
                Alert Statistics
              </h2>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="text-gray-400">Critical</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span className="text-gray-400">High</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <span className="text-gray-400">Medium</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {alertTypesInfo.map((alertType) => {
                const count = localAlerts.filter(a => a.alert_type === alertType.type).length;
                if (count === 0) return null;
                return (
                  <div
                    key={alertType.type}
                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer relative overflow-hidden group"
                    onClick={() => setFilterType(alertType.type)}
                  >
                    {/* Priority indicator */}
                    <div className={`absolute top-0 right-0 w-1 h-full ${alertType.priority === 'CRITICAL' ? 'bg-red-500' :
                      alertType.priority === 'HIGH' ? 'bg-orange-500' : 'bg-yellow-500'
                      } ${alertType.priority === 'CRITICAL' ? 'animate-pulse' : ''}`}></div>

                    <div className="flex items-center gap-2 mb-2">
                      <FontAwesomeIcon icon={alertType.icon} className={`${alertType.color} text-lg`} />
                      <span className="text-2xl font-bold text-white">{count}</span>
                    </div>
                    <p className="text-gray-300 text-xs font-medium truncate">{alertType.title}</p>

                    {/* Hover tooltip */}
                    <div className="absolute inset-0 bg-gray-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-center">
                      <p className="text-white text-xs font-medium">Click to filter</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
                      <div className={`${alertInfo.color} bg-gray-800 p-4 rounded-xl relative`}>
                        <FontAwesomeIcon icon={alertInfo.icon} className="text-2xl" />
                        {alertInfo.emoji && (
                          <span className="absolute -top-1 -right-1 text-2xl">{alertInfo.emoji}</span>
                        )}
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
                            {(alertInfo.type === 'Emergency Signal' || alertInfo.type === 'Distress' || alertInfo.type === 'Attention') && (
                              <>
                                <span className="bg-gray-800 px-2 py-1 rounded text-blue-400">Hand Gesture Detection</span>
                                <span className="bg-gray-800 px-2 py-1 rounded text-blue-400">Real-time Monitoring</span>
                              </>
                            )}
                            {alertInfo.type === 'Lone Woman' && (
                              <>
                                <span className="bg-gray-800 px-2 py-1 rounded text-purple-400">Gender Detection</span>
                                <span className="bg-gray-800 px-2 py-1 rounded text-purple-400">Person Count</span>
                              </>
                            )}
                            {(alertInfo.type === 'Woman Surrounded' || alertInfo.type === 'Woman Surrounded Spatial') && (
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
