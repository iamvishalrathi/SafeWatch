import { useState, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faSortAmountDown,
  faImages,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import ScreenshotCard from "../components/ScreenshotCard";
import EmptyState from "../components/EmptyState";
import { useAlerts, useScreenshots } from "../hooks/useApi";
import API from "../utils/api";

const Screenshots = () => {
  const { alerts } = useAlerts(5000); // Get all alerts for stats
  const { screenshots, loading, error } = useScreenshots(5000); // Poll every 5 seconds for screenshots
  const [filteredScreenshots, setFilteredScreenshots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [unavailableImages, setUnavailableImages] = useState(new Set());

  // Use screenshots from dedicated endpoint, filter out unavailable images
  const screenshotsData = useMemo(() => 
    screenshots ? screenshots.filter(alert => 
      !unavailableImages.has(alert.id)
    ) : []
  , [screenshots, unavailableImages]);

  useEffect(() => {
    if (screenshotsData && screenshotsData.length > 0) {
      let filtered = [...screenshotsData];

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

      // Limit to top 10 recent screenshots
      setFilteredScreenshots(filtered.slice(0, 10));
    } else {
      setFilteredScreenshots([]);
    }
  }, [screenshotsData, searchTerm, filterType, sortOrder]);

  const handleImageError = (alertId) => {
    setUnavailableImages(prev => new Set([...prev, alertId]));
  };

  const downloadAllImages = async () => {
    try {
      const promises = filteredScreenshots.map(alert =>
        API.downloadAlertImage(alert.id, `screenshot_${alert.id}_${alert.alert_type}.jpg`)
      );
      await Promise.all(promises);
    } catch (err) {
      console.error("Failed to download images:", err);
    }
  };

  const alertTypes = [
    { value: "all", label: "All Types" },
    { value: "distress", label: "Distress" },
    { value: "lone_woman_night", label: "Lone Woman Night" },
    { value: "woman_surrounded", label: "Woman Surrounded" },
    { value: "woman_surrounded_spatial", label: "Spatial Risk" },
  ];

  if (loading && !screenshots) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading screenshots...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">Error loading screenshots: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FontAwesomeIcon icon={faImages} className="text-blue-500 text-3xl" />
            <h1 className="text-4xl font-bold text-white">Captured Screenshots</h1>
          </div>
          <p className="text-gray-400">
            Showing top 10 recent screenshots • Available: {filteredScreenshots.length} screenshot{filteredScreenshots.length !== 1 ? 's' : ''}
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

          {/* Download All Button */}
          {filteredScreenshots.length > 0 && (
            <button
              onClick={downloadAllImages}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              title="Download all visible screenshots"
            >
              <FontAwesomeIcon icon={faDownload} />
              <span className="hidden sm:inline">Download All</span>
            </button>
          )}
        </div>

        {/* Screenshots Grid */}
        {filteredScreenshots.length === 0 ? (
          <EmptyState 
            type={searchTerm || filterType !== "all" ? "filtered" : "screenshots"} 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredScreenshots.map((alert) => (
              <ScreenshotCard 
                key={alert.id} 
                alert={alert} 
                onImageError={handleImageError}
              />
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {alerts && alerts.length > 0 && (
          <div className="mt-8 bg-gray-800 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{alerts.length}</div>
                <div className="text-gray-400 text-sm">Total Alerts</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">{screenshotsData.length}</div>
                <div className="text-gray-400 text-sm">With Screenshots</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {((screenshotsData.length / alerts.length) * 100).toFixed(1)}%
                </div>
                <div className="text-gray-400 text-sm">Capture Rate</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Screenshots;