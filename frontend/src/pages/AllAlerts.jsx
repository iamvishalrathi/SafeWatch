import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faSortAmountDown,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import AlertCard from "../components/AlertCard";
import EmptyState from "../components/EmptyState";
import { useAlerts } from "../hooks/useApi";
import API from "../utils/api";

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
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Recent Alerts</h1>
          <p className="text-gray-400">
            Showing top 10 recent alerts • Total: {filteredAlerts.length} alert{filteredAlerts.length !== 1 ? 's' : ''}
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

        {/* Alerts Grid */}
        {filteredAlerts.length === 0 ? (
          <EmptyState 
            type={searchTerm || filterType !== "all" ? "filtered" : (alerts && alerts.length === 0 ? "safe" : "alerts")} 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAlerts.slice(0, 10).map((alert) => (
              <div key={alert.id} className="relative group">
                <AlertCard alert={alert} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadAlertImage(alert.id);
                  }}
                  className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  title="Download alert image"
                >
                  <FontAwesomeIcon icon={faDownload} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAlerts;
