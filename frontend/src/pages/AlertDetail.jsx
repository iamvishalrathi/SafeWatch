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
  faExpand,
  faTimes,
  faSearchPlus,
  faSearchMinus,
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
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);

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

  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const resetZoom = () => {
    setImageZoom(1);
  };

  const openFullScreen = () => {
    setIsFullScreen(true);
    resetZoom();
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
    resetZoom();
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
            <div className={`bg-gradient-to-r ${getAlertColor(alert.alert_type)} p-6 rounded-xl shadow-lg border-2 border-white/10`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                    <FontAwesomeIcon
                      icon={getAlertIcon(alert.alert_type)}
                      className="text-white text-3xl"
                    />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-2xl mb-2">
                      {getAlertTitle(alert.alert_type)}
                    </h2>
                    <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold shadow-md ${priority.color}`}>
                      {priority.level} PRIORITY
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-white/95 text-base leading-relaxed">
                  {getAlertDescription(alert.alert_type)}
                </p>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faInfoCircle} className="text-blue-400" />
                Detailed Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                    <FontAwesomeIcon icon={faClock} className="text-blue-400 mt-1 text-lg" />
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Timestamp (IST)</p>
                      <p className="text-white font-medium text-sm">
                        {formatDetailedDate(alert.timestamp)}
                      </p>
                    </div>
                  </div>

                  {alert.gesture && (
                    <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                      <span className="text-3xl">{getGestureEmoji(alert.gesture)}</span>
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Detected Gesture</p>
                        <p className="text-white font-medium text-sm">
                          {getGestureName(alert.gesture)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                    <FontAwesomeIcon icon={faUserGroup} className="text-green-400 mt-1 text-lg" />
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">People Detected</p>
                      <p className="text-white font-medium text-sm">
                        {alert.male_count} Male{alert.male_count !== 1 ? 's' : ''}, {alert.female_count} Female{alert.female_count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  {alert.confidence && (
                    <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                      <FontAwesomeIcon icon={faEye} className="text-purple-400 mt-1 text-lg" />
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Detection Confidence</p>
                        <p className="text-white font-medium text-sm">
                          {(alert.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )}

                  {alert.latitude && alert.longitude && (
                    <div className="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="text-red-400 mt-1 text-lg" />
                      <div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Location</p>
                        <p className="text-white font-medium text-sm">
                          {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Location Map Button */}
              {alert.latitude && alert.longitude && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${alert.latitude},${alert.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl font-medium"
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
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faCamera} className="text-blue-400" />
                Captured Frame
              </h3>
              {alert.frame_path ? (
                <div className="relative group">
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-700 rounded-lg">
                      <div className="text-gray-400">Loading image...</div>
                    </div>
                  )}
                  {!imageError ? (
                    <>
                      <img
                        src={`http://localhost:5000/alert_image/${alert.id}`}
                        alt="Alert frame"
                        className="w-full rounded-lg shadow-md cursor-pointer hover:opacity-90 transition-opacity border-2 border-gray-700 hover:border-blue-500"
                        onClick={openFullScreen}
                        onLoad={() => setImageLoading(false)}
                        onError={() => {
                          setImageError(true);
                          setImageLoading(false);
                        }}
                      />
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={openFullScreen}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-colors shadow-lg"
                          title="View full screen"
                        >
                          <FontAwesomeIcon icon={faExpand} />
                        </button>
                        <button
                          onClick={downloadAlertImage}
                          className="bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-lg transition-colors shadow-lg"
                          title="Download image"
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </button>
                      </div>
                      {/* Click to expand hint */}
                      <div className="mt-3 text-center">
                        <p className="text-gray-400 text-sm">
                          <FontAwesomeIcon icon={faExpand} className="mr-1" />
                          Click image to view full screen
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-700 rounded-lg p-8 text-center">
                      <FontAwesomeIcon icon={faCamera} className="text-gray-500 text-4xl mb-2" />
                      <p className="text-gray-400">Image not available</p>
                    </div>
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
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faVideo} className="text-blue-400" />
                Camera Details
              </h3>
              {(() => {
                const cameraInfo = getCameraInfo(alert.latitude);
                return (
                  <div className="space-y-4">
                    {/* Camera Name & Status */}
                    <div className="flex items-center justify-between pb-4 border-b border-gray-700">
                      <div>
                        <p className="text-white font-semibold text-lg">{cameraInfo.name}</p>
                        <p className="text-gray-400 text-sm mt-1">{cameraInfo.position}</p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${
                        cameraInfo.status === 'Online' 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {cameraInfo.status}
                      </span>
                    </div>

                    {/* Camera Specs */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 hover:bg-gray-700/50 rounded transition-colors">
                        <span className="text-gray-400 text-sm">Camera ID</span>
                        <span className="text-white font-medium">#{cameraInfo.id}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 hover:bg-gray-700/50 rounded transition-colors">
                        <span className="text-gray-400 text-sm">Location</span>
                        <span className="text-white font-medium">{cameraInfo.location}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 hover:bg-gray-700/50 rounded transition-colors">
                        <span className="text-gray-400 text-sm">Camera Type</span>
                        <span className="text-white font-medium">{cameraInfo.type}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 hover:bg-gray-700/50 rounded transition-colors">
                        <span className="text-gray-400 text-sm">Resolution</span>
                        <span className="text-white font-medium">{cameraInfo.resolution}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 hover:bg-gray-700/50 rounded transition-colors">
                        <span className="text-gray-400 text-sm">Field of View</span>
                        <span className="text-white font-medium">{cameraInfo.fieldOfView}</span>
                      </div>
                    </div>

                    {/* View Camera Button */}
                    <div className="pt-4 border-t border-gray-700">
                      <button
                        onClick={() => navigate(`/camera/${cameraInfo.id}`)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl font-medium"
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
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
              <h3 className="text-white font-bold text-xl mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-gray-400 font-medium">Alert Type</span>
                  <span className="text-white font-semibold capitalize">
                    {alert.alert_type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-gray-400 font-medium">Priority</span>
                  <span className={`font-bold ${priority.level === 'CRITICAL' ? 'text-red-400' : priority.level === 'HIGH' ? 'text-orange-400' : priority.level === 'MEDIUM' ? 'text-yellow-400' : 'text-blue-400'}`}>
                    {priority.level}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="text-gray-400 font-medium">People Count</span>
                  <span className="text-white font-semibold">
                    {alert.male_count + alert.female_count} total
                  </span>
                </div>
                {alert.gesture && (
                  <div className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                    <span className="text-gray-400 font-medium">Gesture</span>
                    <span className="text-white flex items-center gap-2 font-semibold">
                      <span className="text-xl">{getGestureEmoji(alert.gesture)}</span>
                      <span>{getGestureName(alert.gesture)}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {isFullScreen && !imageError && alert.frame_path && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeFullScreen}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeFullScreen}
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors z-10"
              title="Close"
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomOut();
                }}
                className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors"
                title="Zoom out"
                disabled={imageZoom <= 0.5}
              >
                <FontAwesomeIcon icon={faSearchMinus} />
              </button>
              <span className="bg-gray-800 text-white px-4 py-3 rounded-lg font-medium">
                {Math.round(imageZoom * 100)}%
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleZoomIn();
                }}
                className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-lg transition-colors"
                title="Zoom in"
                disabled={imageZoom >= 3}
              >
                <FontAwesomeIcon icon={faSearchPlus} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetZoom();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
                title="Reset zoom"
              >
                Reset
              </button>
            </div>

            {/* Download Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadAlertImage();
              }}
              className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2 z-10"
              title="Download image"
            >
              <FontAwesomeIcon icon={faDownload} />
              <span>Download</span>
            </button>

            {/* Image Container with Zoom */}
            <div 
              className="overflow-auto max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`http://localhost:5000/alert_image/${alert.id}`}
                alt="Alert frame - Full screen"
                className="max-w-none transition-transform duration-200"
                style={{ 
                  transform: `scale(${imageZoom})`,
                  transformOrigin: 'center center'
                }}
                draggable={false}
              />
            </div>

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 bg-gray-800/90 text-white px-4 py-3 rounded-lg backdrop-blur-sm">
              <p className="text-sm">
                <span className="font-semibold">Alert ID:</span> #{alert.id} | 
                <span className="ml-2 font-semibold">Captured:</span> {new Date(alert.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertDetail;