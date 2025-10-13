import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPaper, faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const GestureDetection = () => {
  const [gestureData, setGestureData] = useState({
    detected: false,
    type: null,
    confidence: 0,
    handsCount: 0,
  });
  const [history, setHistory] = useState([]);
  const [showInfo, setShowInfo] = useState(false);

  // Poll gesture detection status from backend
  useEffect(() => {
    const fetchGestureStatus = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/gesture_status");
        if (response.ok) {
          const data = await response.json();
          setGestureData(data);
          
          // Add to history if gesture detected
          if (data.detected && data.type) {
            setHistory(prev => {
              const newHistory = [{
                type: data.type,
                confidence: data.confidence,
                timestamp: new Date().toLocaleTimeString()
              }, ...prev];
              return newHistory.slice(0, 5); // Keep last 5 gestures
            });
          }
        }
      } catch (error) {
        console.error("Error fetching gesture status:", error);
      }
    };

    const interval = setInterval(fetchGestureStatus, 500); // Poll every 500ms
    return () => clearInterval(interval);
  }, []);

  const getGestureColor = (type) => {
    switch (type) {
      case "thumb_palm":
        return "text-red-400";
      case "wave":
        return "text-yellow-400";
      case "thumb_folded":
        return "text-orange-400";
      default:
        return "text-gray-400";
    }
  };

  const getGestureName = (type) => {
    switch (type) {
      case "thumb_palm":
        return "Thumb-Palm (Distress)";
      case "wave":
        return "Wave Gesture";
      case "thumb_folded":
        return "Thumb Folded";
      default:
        return "Unknown";
    }
  };

  const getGestureEmoji = (type) => {
    switch (type) {
      case "thumb_palm":
        return "✊";
      case "wave":
        return "👋";
      case "thumb_folded":
        return "👍";
      default:
        return "🤚";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Current Detection Status */}
      <div className="bg-[#3A3A3A] rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-300">Live Detection</span>
          <div className="flex items-center gap-2">
            {/* Info Icon */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="relative group"
              aria-label="Gesture Information"
            >
              <FontAwesomeIcon 
                icon={faInfoCircle} 
                className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer text-sm"
              />
              {/* Tooltip on hover */}
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-50">
                <div className="bg-gray-800 text-white text-xs rounded-lg p-3 shadow-xl w-64 border border-gray-700">
                  <h4 className="font-bold mb-2 text-blue-400">Gesture Types</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">✊</span>
                      <div>
                        <p className="font-medium text-red-400">Thumb-Palm</p>
                        <p className="text-gray-400 text-[10px]">Emergency signal</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">👋</span>
                      <div>
                        <p className="font-medium text-yellow-400">Wave</p>
                        <p className="text-gray-400 text-[10px]">Attention needed</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">👍</span>
                      <div>
                        <p className="font-medium text-orange-400">Thumb Folded</p>
                        <p className="text-gray-400 text-[10px]">Help signal</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-[9px] mt-2 italic">Use your left hand for gestures</p>
                </div>
              </div>
            </button>
            <div className={`w-3 h-3 rounded-full ${gestureData.detected ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
          </div>
        </div>
        
        {gestureData.detected ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-xl flex items-center justify-center">
                <span className="text-3xl">{getGestureEmoji(gestureData.type)}</span>
              </div>
              <div className="flex-1">
                <p className={`font-bold text-sm ${getGestureColor(gestureData.type)}`}>
                  {getGestureName(gestureData.type)}
                </p>
                <p className="text-xs text-gray-400">
                  Confidence: {(gestureData.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-600">
              <span>Hands Detected: {gestureData.handsCount}</span>
              <span className="text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Active
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-3 bg-[#1A1A1A] rounded-xl flex items-center justify-center">
              <span className="text-4xl">🤚</span>
            </div>
            <p className="text-sm text-gray-400">No gesture detected</p>
            <p className="text-xs text-gray-500 mt-1">Monitoring hands...</p>
          </div>
        )}
      </div>

      {/* Gesture History */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <h3 className="text-sm font-semibold text-gray-300 mb-2">Recent Gestures</h3>
        {history.length > 0 ? (
          <div className="space-y-2">
            {history.map((item, index) => (
              <div 
                key={index}
                className="bg-[#3A3A3A] rounded-lg p-3 border-l-2 border-opacity-50"
                style={{ 
                  borderColor: item.type === "thumb_palm" ? "#f87171" : 
                               item.type === "wave" ? "#fbbf24" : "#fb923c"
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${getGestureColor(item.type)}`}>
                      {getGestureName(item.type)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.timestamp}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {(item.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <FontAwesomeIcon icon={faHandPaper} className="text-3xl mb-2" />
            <p className="text-xs">No recent gestures</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestureDetection;
