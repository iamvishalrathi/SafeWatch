import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faCamera,
  faShieldAlt,
  faSearchMinus,
} from "@fortawesome/free-solid-svg-icons";

const EmptyState = ({ type = "alerts", className = "" }) => {
  const getEmptyStateConfig = () => {
    switch (type) {
      case "alerts":
        return {
          icon: faExclamationTriangle,
          title: "No Alerts Found",
          message: "No safety alerts have been triggered yet. The system is monitoring and will display alerts when incidents are detected.",
          bgColor: "bg-yellow-500/10",
          iconColor: "text-yellow-500",
          borderColor: "border-yellow-500/20",
        };
      case "screenshots":
        return {
          icon: faCamera,
          title: "No Screenshots Available",
          message: "No captured screenshots are available. Screenshots will appear here when alerts are triggered and frames are saved.",
          bgColor: "bg-blue-500/10",
          iconColor: "text-blue-500",
          borderColor: "border-blue-500/20",
        };
      case "filtered":
        return {
          icon: faSearchMinus,
          title: "No Results Found",
          message: "No alerts match your current search criteria. Try adjusting your filters or search terms.",
          bgColor: "bg-gray-500/10",
          iconColor: "text-gray-400",
          borderColor: "border-gray-500/20",
        };
      case "safe":
        return {
          icon: faShieldAlt,
          title: "All Clear",
          message: "Everything looks safe! No recent safety concerns have been detected by the monitoring system.",
          bgColor: "bg-green-500/10",
          iconColor: "text-green-500",
          borderColor: "border-green-500/20",
        };
      default:
        return {
          icon: faExclamationTriangle,
          title: "No Data Available",
          message: "No data is currently available to display.",
          bgColor: "bg-gray-500/10",
          iconColor: "text-gray-400",
          borderColor: "border-gray-500/20",
        };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <div
      className={`
        ${config.bgColor} 
        ${config.borderColor} 
        border-2 border-dashed 
        rounded-xl 
        p-8 md:p-12 
        text-center 
        transition-all 
        duration-300 
        hover:scale-[1.02] 
        ${className}
      `}
    >
      <div className="flex flex-col items-center space-y-4">
        {/* Icon */}
        <div className={`
          ${config.bgColor} 
          p-4 
          rounded-full 
          border 
          ${config.borderColor}
        `}>
          <FontAwesomeIcon
            icon={config.icon}
            className={`${config.iconColor} text-3xl md:text-4xl`}
          />
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-xl md:text-2xl">
          {config.title}
        </h3>

        {/* Message */}
        <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed">
          {config.message}
        </p>

        {/* Optional Action Button */}
        {type === "filtered" && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

EmptyState.propTypes = {
  type: PropTypes.oneOf(["alerts", "screenshots", "filtered", "safe"]),
  className: PropTypes.string,
};

export default EmptyState;