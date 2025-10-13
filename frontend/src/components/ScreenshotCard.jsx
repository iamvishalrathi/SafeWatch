import { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faExpand,
  faCamera,
  faClock,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import API from "../utils/api";
import { getGestureEmoji, getGestureName } from "../utils/gestureUtils";

const ScreenshotCard = ({ alert, onImageError = () => {} }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const downloadImage = async () => {
    try {
      await API.downloadAlertImage(alert.id, `alert_screenshot_${alert.id}.jpg`);
    } catch (err) {
      console.error("Failed to download image:", err);
    }
  };

  const openFullscreen = () => {
    const imageUrl = API.getAlertImageUrl(alert.id);
    window.open(imageUrl, '_blank');
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
    onImageError(alert.id);
  };

  if (imageError) {
    return (
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
        <div className="aspect-video bg-gray-700 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <FontAwesomeIcon icon={faCamera} className="text-4xl mb-2" />
            <p className="text-sm">Image unavailable</p>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold text-sm">
              Alert #{alert.id}
            </h3>
            <span className="text-xs text-gray-400">
              {formatDate(alert.timestamp)}
            </span>
          </div>
          <p className="text-gray-400 text-xs">
            Screenshot could not be loaded
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
      {/* Image Container */}
      <div className="relative aspect-video bg-gray-700">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        <img
          src={API.getAlertImageUrl(alert.id)}
          alt={`Alert screenshot ${alert.id}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-3">
          <button
            onClick={openFullscreen}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
            title="View fullscreen"
          >
            <FontAwesomeIcon icon={faExpand} />
          </button>
          <button
            onClick={downloadImage}
            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
            title="Download image"
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>

        {/* Alert Type Badge */}
        <div className="absolute top-2 left-2">
          <span className="bg-red-600/90 text-white text-xs px-2 py-1 rounded-full font-medium">
            {alert.alert_type.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-semibold text-sm">
            Alert #{alert.id}
          </h3>
          <span className="text-xs text-gray-400">
            <FontAwesomeIcon icon={faClock} className="mr-1" />
            {formatDate(alert.timestamp)}
          </span>
        </div>

        {/* Alert Details */}
        <div className="space-y-1 text-xs text-gray-400">
          {alert.gesture && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">{getGestureEmoji(alert.gesture)}</span>
              <span className="font-medium text-yellow-400">{getGestureName(alert.gesture)}</span>
            </div>
          )}
          
          <p>
            <span className="font-medium">Detection:</span> {alert.male_count} Male{alert.male_count !== 1 ? 's' : ''}, {alert.female_count} Female{alert.female_count !== 1 ? 's' : ''}
          </p>

          {alert.confidence && (
            <p>
              <span className="font-medium">Confidence:</span> {(alert.confidence * 100).toFixed(1)}%
            </p>
          )}

          {alert.latitude && alert.longitude && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${alert.latitude},${alert.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
              View Location
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

ScreenshotCard.propTypes = {
  alert: PropTypes.shape({
    id: PropTypes.number.isRequired,
    alert_type: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    gesture: PropTypes.string,
    male_count: PropTypes.number,
    female_count: PropTypes.number,
    confidence: PropTypes.number,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }).isRequired,
  onImageError: PropTypes.func,
};

export default ScreenshotCard;