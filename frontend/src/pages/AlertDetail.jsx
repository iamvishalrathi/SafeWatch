import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faExclamationTriangle,
  faClock,
  faMapMarkerAlt,
  faUserGroup,
  faDownload,
  faEye,
  faInfoCircle,
  faCamera,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import API from '../utils/api';
import { getGestureEmoji, getGestureName } from '../utils/gestureUtils';

const AlertDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Mock camera data - In production, this should come from alert.camera_id
  const getCameraInfo = (alertLocation) => {
    // Default camera based on alert location
    const cameras = [
      {
        id: 1,
        name: "Main Entrance Camera",
        position: "Main Entrance",
        location: "Rohini",
        status: "Online",
        type: "Fixed Dome",
        resolution: "1080p",
        fieldOfView: "120°",
      },
      {
        id: 2,
        name: "Parking Area Camera",
        position: "Parking Area",
        location: "Rohini",
        status: "Offline",
        type: "PTZ Camera",
        resolution: "4K",
        fieldOfView: "360°",
      },
    ];

    // If alert has location, try to match to nearby camera
    // For now, return Camera 1 as default
    return cameras[0];
  };

  useEffect(() => {
    const fetchAlertDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/alert/${id}`);
        if (!response.ok) {
          throw new Error('Alert not found');
        }
        const data = await response.json();
        setAlert(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAlertDetail();
    }
  }, [id]);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'distress':
        return faExclamationTriangle;
      case 'lone_woman_night':
        return faClock;
      case 'woman_surrounded':
      case 'woman_surrounded_spatial':
        return faUserGroup;
      default:
        return faExclamationTriangle;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'distress':
        return 'from-red-600 to-red-700';
      case 'lone_woman_night':
        return 'from-yellow-600 to-yellow-700';
      case 'woman_surrounded':
      case 'woman_surrounded_spatial':
        return 'from-orange-600 to-orange-700';
      default:
        return 'from-red-600 to-red-700';
    }
  };

  const getAlertTitle = (type) => {
    switch (type) {
      case 'distress':
        return 'Distress Signal Detected';
      case 'lone_woman_night':
        return 'Lone Woman at Night';
      case 'woman_surrounded':
        return 'Woman Surrounded by Multiple Men';
      case 'woman_surrounded_spatial':
        return 'Spatial Risk Detected';
      default:
        return 'Safety Alert';
    }
  };

  const getAlertDescription = (type) => {
    switch (type) {
      case 'distress':
        return 'A distress gesture was detected indicating someone may need help.';
      case 'lone_woman_night':
        return 'A woman was detected alone during nighttime hours, which may pose safety risks.';
      case 'woman_surrounded':
        return 'A woman was detected surrounded by multiple men, indicating a potentially unsafe situation.';
      case 'woman_surrounded_spatial':
        return 'Spatial analysis detected a woman in close proximity to men, indicating potential risk.';
      default:
        return 'A safety alert was triggered by the monitoring system.';
    }
  };

  const getPriorityLevel = (type) => {
    switch (type) {
      case 'distress':
        return { level: 'CRITICAL', color: 'text-red-500 bg-red-100' };
      case 'woman_surrounded':
      case 'woman_surrounded_spatial':
        return { level: 'HIGH', color: 'text-orange-500 bg-orange-100' };
      case 'lone_woman_night':
        return { level: 'MEDIUM', color: 'text-yellow-500 bg-yellow-100' };
      default:
        return { level: 'LOW', color: 'text-blue-500 bg-blue-100' };
    }
  };

  const formatDetailedDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp);

    // Check if the timestamp has timezone info, if not assume it's IST
    const options = {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    };

    return date.toLocaleString('en-IN', options);
  };

  const downloadAlertImage = async () => {
    try {
      await API.downloadAlertImage(alert.id);
    } catch (err) {
      console.error('Failed to download alert image:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading alert details...</div>
      </div>
    );
  }

  if (error || !alert) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">
            {error || 'Alert not found'}
          </div>
          <button
            onClick={() => navigate('/all-alerts')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Back to Alerts
          </button>
        </div>
      </div>
    );
  }

  const priority = getPriorityLevel(alert.alert_type);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/all-alerts')}
            className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Alert Details</h1>
            <p className="text-gray-400">Alert ID: #{alert.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Alert Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Alert Overview */}
            <div className={`bg-gradient-to-r ${getAlertColor(alert.alert_type)} p-6 rounded-xl shadow-lg`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-4 rounded-full">
                    <FontAwesomeIcon
                      icon={getAlertIcon(alert.alert_type)}
                      className="text-white text-2xl"
                    />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-2xl">
                      {getAlertTitle(alert.alert_type)}
                    </h2>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mt-2 ${priority.color}`}>
                      {priority.level} PRIORITY
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-white/90 text-lg leading-relaxed">
                {getAlertDescription(alert.alert_type)}
              </p>
            </div>

            {/* Detailed Information */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faInfoCircle} />
                Detailed Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faClock} className="text-blue-400 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">Timestamp (IST)</p>
                      <p className="text-white font-medium">
                        {formatDetailedDate(alert.timestamp)}
                      </p>
                    </div>
                  </div>

                  {alert.gesture && (
                    <div className="flex items-start gap-3">
                      <span className="text-2xl mt-1">{getGestureEmoji(alert.gesture)}</span>
                      <div>
                        <p className="text-gray-400 text-sm">Detected Gesture</p>
                        <p className="text-white font-medium">
                          {getGestureName(alert.gesture)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <FontAwesomeIcon icon={faUserGroup} className="text-green-400 mt-1" />
                    <div>
                      <p className="text-gray-400 text-sm">People Detected</p>
                      <p className="text-white font-medium">
                        {alert.male_count} Male{alert.male_count !== 1 ? 's' : ''}, {alert.female_count} Female{alert.female_count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {alert.confidence && (
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faEye} className="text-purple-400 mt-1" />
                      <div>
                        <p className="text-gray-400 text-sm">Detection Confidence</p>
                        <p className="text-white font-medium">
                          {(alert.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )}

                  {alert.latitude && alert.longitude && (
                    <div className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-400 mt-1" />
                      <div>
                        <p className="text-gray-400 text-sm">Location</p>
                        <p className="text-white font-medium">
                          {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Map Button */}
              {alert.latitude && alert.longitude && (
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${alert.latitude},${alert.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    View on Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Alert Image */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faCamera} />
                Captured Frame
              </h3>
              {alert.frame_path ? (
                <div className="relative">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-700 rounded-lg">
                      <div className="text-gray-400">Loading image...</div>
                    </div>
                  )}
                  {!imageError ? (
                    <img
                      src={`http://localhost:5000/alert_image/${alert.id}`}
                      alt="Alert frame"
                      className="w-full rounded-lg shadow-md"
                      onLoad={() => setImageLoading(false)}
                      onError={() => {
                        setImageError(true);
                        setImageLoading(false);
                      }}
                    />
                  ) : (
                    <div className="bg-gray-700 rounded-lg p-8 text-center">
                      <FontAwesomeIcon icon={faCamera} className="text-gray-500 text-4xl mb-2" />
                      <p className="text-gray-400">Image not available</p>
                    </div>
                  )}
                  {!imageError && (
                    <button
                      onClick={downloadAlertImage}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors"
                      title="Download image"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-gray-700 rounded-lg p-8 text-center">
                  <FontAwesomeIcon icon={faCamera} className="text-gray-500 text-4xl mb-2" />
                  <p className="text-gray-400">No image captured</p>
                </div>
              )}
            </div>

            {/* Camera Details */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faVideo} />
                Camera Details
              </h3>
              {(() => {
                const cameraInfo = getCameraInfo(alert.latitude);
                return (
                  <div className="space-y-4">
                    {/* Camera Name & Status */}
                    <div className="flex items-center justify-between pb-3 border-b border-gray-700">
                      <div>
                        <p className="text-white font-semibold text-lg">{cameraInfo.name}</p>
                        <p className="text-gray-400 text-sm">{cameraInfo.position}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        cameraInfo.status === 'Online' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {cameraInfo.status}
                      </span>
                    </div>

                    {/* Camera Specs */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Camera ID</span>
                        <span className="text-white font-medium">#{cameraInfo.id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Location</span>
                        <span className="text-white font-medium">{cameraInfo.location}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Camera Type</span>
                        <span className="text-white font-medium">{cameraInfo.type}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Resolution</span>
                        <span className="text-white font-medium">{cameraInfo.resolution}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">Field of View</span>
                        <span className="text-white font-medium">{cameraInfo.fieldOfView}</span>
                      </div>
                    </div>

                    {/* View Camera Button */}
                    <div className="pt-3 border-t border-gray-700">
                      <button
                        onClick={() => navigate(`/camera/${cameraInfo.id}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <FontAwesomeIcon icon={faVideo} />
                        View Live Camera Feed
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h3 className="text-white font-bold text-xl mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Alert Type</span>
                  <span className="text-white capitalize">
                    {alert.alert_type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Priority</span>
                  <span className={`font-semibold ${priority.level === 'CRITICAL' ? 'text-red-400' : priority.level === 'HIGH' ? 'text-orange-400' : priority.level === 'MEDIUM' ? 'text-yellow-400' : 'text-blue-400'}`}>
                    {priority.level}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">People Count</span>
                  <span className="text-white">
                    {alert.male_count + alert.female_count} total
                  </span>
                </div>
                {alert.gesture && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Gesture</span>
                    <span className="text-white flex items-center gap-2">
                      <span className="text-lg">{getGestureEmoji(alert.gesture)}</span>
                      <span>{getGestureName(alert.gesture)}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertDetail;