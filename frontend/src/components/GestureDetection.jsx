import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandPaper, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const GestureDetection = () => {
  const [gestureData, setGestureData] = useState({
    detected: false,
    type: null,
    confidence: 0,
    handsCount: 0,
  });
  const [history, setHistory] = useState([]);

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

  return (
    <div className="h-full flex flex-col">
      {/* Current Detection Status */}
      <div className="bg-[#3A3A3A] rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-300">Live Detection</span>
          <div className={`w-3 h-3 rounded-full ${gestureData.detected ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
        </div>
        
        {gestureData.detected ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon 
                icon={gestureData.type === "thumb_palm" ? faExclamationTriangle : faHandPaper} 
                className={`text-2xl ${getGestureColor(gestureData.type)}`}
              />
              <div>
                <p className={`font-bold ${getGestureColor(gestureData.type)}`}>
                  {getGestureName(gestureData.type)}
                </p>
                <p className="text-xs text-gray-400">
                  Confidence: {(gestureData.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>Hands Detected: {gestureData.handsCount}</span>
              <span className="text-green-400">Active</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <FontAwesomeIcon icon={faHandPaper} className="text-4xl text-gray-600 mb-2" />
            <p className="text-sm text-gray-400">No gesture detected</p>
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

      {/* Gesture Legend */}
      <div className="mt-4 bg-[#3A3A3A] rounded-lg p-3">
        <h4 className="text-xs font-semibold text-gray-400 mb-2">Gesture Types</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400"></div>
            <span className="text-gray-300">Thumb-Palm: Emergency signal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span className="text-gray-300">Wave: Attention needed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
            <span className="text-gray-300">Thumb Folded: Help signal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestureDetection;
