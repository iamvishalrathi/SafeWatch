import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faClock,
  faArrowRight,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import AlertCard from "./AlertCard";
import { useAlerts } from "../hooks/useApi";

const RecentAlerts = ({ limit = 5 }) => {
  const { alerts, loading, error } = useAlerts(10000); // Poll every 10 seconds for home page
  const [recentAlerts, setRecentAlerts] = useState([]);

  useEffect(() => {
    if (alerts && alerts.length > 0) {
      // Sort by timestamp (most recent first) and limit
      const sorted = [...alerts]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
      setRecentAlerts(sorted);
    } else {
      setRecentAlerts([]);
    }
  }, [alerts, limit]);

  if (loading && !alerts) {
    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-400">Loading recent alerts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="text-center py-8">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-2xl mb-2" />
          <p className="text-red-500">Error loading alerts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500 text-xl" />
          <h3 className="text-xl font-bold text-white">Recent Alerts</h3>
        </div>
        {recentAlerts.length > 0 && (
          <Link
            to="/all-alerts"
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
          >
            View All
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </Link>
        )}
      </div>

      {/* Alerts List */}
      {recentAlerts.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <FontAwesomeIcon icon={faShieldAlt} className="text-green-500 text-3xl mb-3" />
            <p className="text-green-500 font-medium mb-1">All Clear!</p>
            <p className="text-gray-400 text-sm">No recent safety alerts detected</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {recentAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} compact={true} />
          ))}
        </div>
      )}

      {/* Stats Footer */}
      {alerts && alerts.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Total Alerts: {alerts.length}</span>
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faClock} />
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

RecentAlerts.propTypes = {
  limit: PropTypes.number,
};

export default RecentAlerts;