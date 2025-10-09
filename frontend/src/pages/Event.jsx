import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarAlt, 
  faMapMarkerAlt, 
  faFilter, 
  faSearch, 
  faExclamationTriangle,
  faShieldAlt,
  faClock,
  faUserShield
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock data for events
  useEffect(() => {
    // In a real app, this would be an API call
    const mockEvents = [
      {
        id: 1,
        title: "Suspicious Activity Detected",
        description: "Multiple men surrounding a lone woman at night in a poorly lit area.",
        location: "Central Park, East Entrance",
        timestamp: "2023-06-15T22:45:00",
        severity: "high",
        status: "resolved",
        coordinates: { lat: 28.6139, lng: 77.2090 },
        imageUrl: "https://images.unsplash.com/photo-1517697471339-4aa32003c11a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80",
        details: "Security personnel were dispatched and escorted the woman safely to her destination. The group of men dispersed upon security arrival."
      },
      {
        id: 2,
        title: "Gender Ratio Anomaly",
        description: "Unusual gender distribution detected in public transport station.",
        location: "Metro Station, Line 3",
        timestamp: "2023-06-18T19:30:00",
        severity: "medium",
        status: "monitoring",
        coordinates: { lat: 28.6129, lng: 77.2295 },
        imageUrl: "https://images.unsplash.com/photo-1517732306149-e8f829eb588a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
        details: "System detected a 9:1 male to female ratio during off-peak hours. Station security was notified to increase patrols in the area."
      },
      {
        id: 3,
        title: "Distress Gesture Detected",
        description: "Woman making distress hand signals captured by camera.",
        location: "Shopping Mall, Food Court",
        timestamp: "2023-06-20T14:15:00",
        severity: "high",
        status: "resolved",
        coordinates: { lat: 28.5355, lng: 77.2410 },
        imageUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        details: "Mall security responded within 2 minutes. The woman was being harassed by an individual who was subsequently removed from the premises."
      },
      {
        id: 4,
        title: "Crowd Density Alert",
        description: "Unusually dense crowd with concerning gender distribution.",
        location: "Music Festival, Main Stage",
        timestamp: "2023-06-25T21:00:00",
        severity: "medium",
        status: "resolved",
        coordinates: { lat: 28.6304, lng: 77.2177 },
        imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        details: "Event security created a safe passage and designated women-only areas to ensure safety during the concert."
      },
      {
        id: 5,
        title: "Nighttime Safety Concern",
        description: "Woman walking alone in known high-risk area after midnight.",
        location: "Industrial District, Block B",
        timestamp: "2023-06-28T01:20:00",
        severity: "low",
        status: "monitoring",
        coordinates: { lat: 28.6139, lng: 77.2090 },
        imageUrl: "https://images.unsplash.com/photo-1531319842102-fd3d0d923fd4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        details: "Patrol car dispatched to area for preventative monitoring. Woman reached her destination safely."
      },
      {
        id: 6,
        title: "Public Transport Incident",
        description: "Harassment report triggered by SafeWatch mobile app.",
        location: "City Bus #42, Downtown Route",
        timestamp: "2023-07-02T08:45:00",
        severity: "high",
        status: "resolved",
        coordinates: { lat: 28.5921, lng: 77.2290 },
        imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
        details: "Bus driver was alerted and stopped at nearest police station. Perpetrator was detained and victim provided support."
      }
    ];

    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
    setLoading(false);
  }, []);

  // Filter events based on search term and filters
  useEffect(() => {
    let results = events;
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by severity
    if (selectedSeverity !== "all") {
      results = results.filter(event => event.severity === selectedSeverity);
    }
    
    // Filter by timeframe
    if (selectedTimeframe !== "all") {
      const now = new Date();
      const timeFrames = {
        "today": 1,
        "week": 7,
        "month": 30
      };
      
      const daysAgo = timeFrames[selectedTimeframe];
      const cutoffDate = new Date(now.setDate(now.getDate() - daysAgo));
      
      results = results.filter(event => new Date(event.timestamp) >= cutoffDate);
    }
    
    setFilteredEvents(results);
  }, [searchTerm, selectedSeverity, selectedTimeframe, events]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case "high": return "bg-red-600";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pb-10">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FontAwesomeIcon icon={faShieldAlt} className="text-5xl text-[#218EA6]" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Safety Events</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Monitor and analyze safety incidents detected by SafeWatch. Our AI-powered system identifies 
            potential threats and tracks resolution status in real-time.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#2a2a2a] rounded-xl p-6 mb-8 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2 bg-[#3a3a3a] border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#218EA6] text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faFilter} className="text-[#218EA6] mr-2" />
                <select
                  className="bg-[#3a3a3a] border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#218EA6] text-white"
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                >
                  <option value="all">All Severities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-[#218EA6] mr-2" />
                <select
                  className="bg-[#3a3a3a] border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#218EA6] text-white"
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Past Week</option>
                  <option value="month">Past Month</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#218EA6]"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-[#2a2a2a] rounded-xl max-w-6xl mx-auto">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
            <p className="text-gray-400">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredEvents.map((event) => (
              <div 
                key={event.id} 
                className="bg-[#2a2a2a] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02] cursor-pointer"
                onClick={() => handleEventClick(event)}
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1129&q=80";
                    }}
                  />
                  <div className={`absolute top-4 right-4 ${getSeverityColor(event.severity)} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                    {event.severity.toUpperCase()}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2 text-white">{event.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-[#218EA6]" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-[#218EA6]" />
                    <span>{formatDate(event.timestamp)}</span>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.status === 'resolved' ? 'bg-green-900/30 text-green-400' : 
                      event.status === 'monitoring' ? 'bg-blue-900/30 text-blue-400' : 
                      'bg-red-900/30 text-red-400'
                    }`}>
                      {event.status.toUpperCase()}
                    </span>
                    <button className="text-[#218EA6] hover:text-[#30b0d1] text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2a2a2a] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedEvent.imageUrl} 
                alt={selectedEvent.title}
                className="w-full h-64 object-cover rounded-t-xl"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1129&q=80";
                }}
              />
              <button 
                onClick={closeEventDetails}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-75"
              >
                ✕
              </button>
              <div className={`absolute top-4 left-4 ${getSeverityColor(selectedEvent.severity)} text-white text-sm font-bold px-3 py-1 rounded-full`}>
                {selectedEvent.severity.toUpperCase()} SEVERITY
              </div>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-gray-400">
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-[#218EA6]" />
                  <span>{selectedEvent.location}</span>
                </div>
                
                <div className="flex items-center text-gray-400">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-[#218EA6]" />
                  <span>{formatDate(selectedEvent.timestamp)}</span>
                </div>
                
                <div className="flex items-center text-gray-400">
                  <FontAwesomeIcon icon={faClock} className="mr-2 text-[#218EA6]" />
                  <span>{selectedEvent.status.toUpperCase()}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 text-[#218EA6]" />
                  Incident Description
                </h3>
                <p className="text-gray-300 leading-relaxed">{selectedEvent.description}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <FontAwesomeIcon icon={faUserShield} className="mr-2 text-[#218EA6]" />
                  Response Details
                </h3>
                <p className="text-gray-300 leading-relaxed">{selectedEvent.details}</p>
              </div>
              
              <div className="bg-[#1a1a1a] p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-2">Location Coordinates</h3>
                <p className="text-gray-400">Latitude: {selectedEvent.coordinates.lat}</p>
                <p className="text-gray-400">Longitude: {selectedEvent.coordinates.lng}</p>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={closeEventDetails}
                  className="px-4 py-2 bg-[#218EA6] text-white rounded-lg hover:bg-[#30b0d1] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Event;
