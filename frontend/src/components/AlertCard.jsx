import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faMapMarkerAlt,
  faClock,
  faHand,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { getGestureEmoji, getGestureName } from '../utils/gestureUtils';

const AlertCard = ({ alert, compact = false }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/alert/${alert.id}`);
  };
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
    
    // Format for IST timezone
    return date.toLocaleString("en-IN", {
      timeZone: 'Asia/Kolkata',
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short"
    });
  };

  if (compact) {
    return (
      <div
        onClick={handleCardClick}
        className={`bg-gradient-to-r ${getAlertColor(
          alert.alert_type
        )} p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer`}
      >
        <div className="flex items-start gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <FontAwesomeIcon
              icon={getAlertIcon(alert.alert_type)}
              className="text-white text-lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">
              {getAlertTitle(alert.alert_type)}
            </h3>
            <p className="text-white/80 text-xs mt-1">
              <FontAwesomeIcon icon={faClock} className="mr-1" />
              {formatDate(alert.timestamp)}
            </p>
            {alert.gesture && (
              <p className="text-white/90 text-xs mt-1 flex items-center">
                <span className="mr-1">{getGestureEmoji(alert.gesture)}</span>
                <span className="capitalize">{getGestureName(alert.gesture)}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className={`bg-gradient-to-r ${getAlertColor(
        alert.alert_type
      )} p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-full">
            <FontAwesomeIcon
              icon={getAlertIcon(alert.alert_type)}
              className="text-white text-xl"
            />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">
              {getAlertTitle(alert.alert_type)}
            </h3>
            <p className="text-white/80 text-sm">Alert ID: #{alert.id}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-white/90 text-sm">
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faClock} className="text-white/70" />
          <span>{formatDate(alert.timestamp)}</span>
        </div>

        {alert.gesture && (
          <div className="flex items-center gap-2">
            <span className="text-white/70 text-lg">{getGestureEmoji(alert.gesture)}</span>
            <span className="capitalize">{getGestureName(alert.gesture)}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUserGroup} className="text-white/70" />
          <span>
            {alert.male_count} Male{alert.male_count !== 1 ? 's' : ''}, {alert.female_count} Female{alert.female_count !== 1 ? 's' : ''}
          </span>
        </div>

        {alert.latitude && alert.longitude && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${alert.latitude},${alert.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors mt-3 bg-white/10 p-2 rounded-lg hover:bg-white/20"
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            <span>View Location on Map</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default AlertCard;
