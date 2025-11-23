import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVideo,
  faBell,
  faMapMarkedAlt,
  faChartLine,
  faUsers,
  faShieldAlt,
  faCheckCircle,
  faLightbulb,
  faGraduationCap,
  faHandPointRight,
  faPlayCircle,
  faCamera,
  faExclamationTriangle,
  faFilter,
  faMousePointer,
  faCalendarAlt,
  faNewspaper,
  faBalanceScale,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const HowTo = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedCard, setExpandedCard] = useState(null);

  const sections = [
    { id: 'overview', label: 'Overview', icon: faShieldAlt },
    { id: 'live', label: 'Live Monitoring', icon: faVideo },
    { id: 'alerts', label: 'Alerts System', icon: faBell },
    { id: 'analytics', label: 'Analytics', icon: faChartLine },
    { id: 'news', label: 'News & Updates', icon: faNewspaper },
    { id: 'tips', label: 'Pro Tips', icon: faLightbulb },
  ];

  const tutorials = {
    overview: {
      title: 'Platform Overview',
      description: "Welcome to SafeWatch - Your AI-powered women's safety monitoring platform",
      cards: [
        {
          title: 'What is SafeWatch?',
          icon: faShieldAlt,
          content: "SafeWatch is an advanced AI-driven safety platform that monitors public spaces through CCTV cameras to detect potential threats and ensure women's safety.",
          features: [
            'Real-time video monitoring and analysis',
            'AI-powered threat detection',
            'Instant alert notifications',
            'Data-driven safety insights',
            'Hotspot identification and mapping',
          ]
        },
        {
          title: 'How It Works',
          icon: faGraduationCap,
          content: 'Our system uses computer vision and machine learning to analyze video feeds, detect anomalies, recognize distress gestures, and send immediate alerts.',
          steps: [
            { step: '1', text: 'Cameras capture live video feeds from public spaces' },
            { step: '2', text: 'AI analyzes gender distribution and behavior patterns' },
            { step: '3', text: 'System detects potential threats and anomalies' },
            { step: '4', text: 'Instant alerts sent to authorities and security' },
            { step: '5', text: 'Data collected for analysis and preventive measures' },
          ]
        },
        {
          title: 'Key Features',
          icon: faCheckCircle,
          content: 'Explore the powerful features that make SafeWatch an effective safety solution.',
          features: [
            'Live camera monitoring with real-time feeds',
            'Gesture recognition for distress signals',
            'Comprehensive alert management system',
            'Interactive analytics and hotspot maps',
            'News updates on women\'s safety and rights',
          ]
        },
      ]
    },
    live: {
      title: 'Live Monitoring Guide',
      description: 'Learn how to monitor live camera feeds and understand the interface',
      cards: [
        {
          title: 'Accessing Live Feeds',
          icon: faCamera,
          content: 'Navigate to the Live page to view all active camera feeds in real-time.',
          steps: [
            { step: '1', text: 'Click "Live" in the navigation bar' },
            { step: '2', text: 'View all active cameras in grid layout' },
            { step: '3', text: 'Click on any camera to see detailed view' },
            { step: '4', text: 'Monitor real-time detection statistics' },
          ]
        },
        {
          title: 'Camera Details',
          icon: faVideo,
          content: 'Click on any camera card to access detailed information and controls.',
          features: [
            'Live video stream display',
            'Location map with camera position',
            'Real-time detection counts (male/female)',
            'Recent alerts from this camera',
            'Camera status and health information',
          ]
        },
        {
          title: 'Understanding Detections',
          icon: faUsers,
          content: 'The system continuously analyzes video feeds and displays detection statistics.',
          features: [
            'Male count: Number of males detected',
            'Female count: Number of females detected',
            'Gender ratio analysis',
            'Anomaly detection indicators',
            'Real-time updates every few seconds',
          ]
        },
      ]
    },
    alerts: {
      title: 'Alert System Guide',
      description: 'Manage and understand the alert notification system',
      cards: [
        {
          title: 'Alert Overview',
          icon: faBell,
          content: 'SafeWatch generates alerts when potential threats or anomalies are detected.',
          features: [
            'Real-time threat notifications',
            'Alert severity levels',
            'Location and camera information',
            'Screenshot evidence capture',
            'Timestamp for each alert',
          ]
        },
        {
          title: 'Alert Statuses',
          icon: faExclamationTriangle,
          content: 'Alerts go through different status stages from detection to resolution.',
          steps: [
            { step: 'Unseen', text: 'New alert that hasn\'t been viewed yet', color: 'text-gray-400' },
            { step: 'Pending', text: 'Alert opened and under review', color: 'text-yellow-400' },
            { step: 'Resolved', text: 'Issue addressed and resolved', color: 'text-green-400' },
            { step: 'Closed', text: 'Alert closed and archived', color: 'text-blue-400' },
          ]
        },
        {
          title: 'Filtering Alerts',
          icon: faFilter,
          content: 'Use filters to find specific alerts quickly and efficiently.',
          features: [
            'Filter by alert status (unseen, pending, resolved, closed)',
            'Filter by alert type (gesture, anomaly, etc.)',
            'Sort by date and time',
            'Search by location or camera',
            'View alert details and screenshots',
          ]
        },
        {
          title: 'Alert Details',
          icon: faMousePointer,
          content: 'Click on any alert to view complete information and take action.',
          features: [
            'Full alert description and type',
            'Captured screenshot (if available)',
            'Camera location and map',
            'Detection counts at time of alert',
            'Update alert status',
            'View related alerts from same location',
          ]
        },
      ]
    },
    analytics: {
      title: 'Analytics Dashboard Guide',
      description: 'Understand data insights, trends, and hotspot analysis',
      cards: [
        {
          title: 'Time-Series Analysis',
          icon: faChartLine,
          content: 'View alerts over time to identify patterns and trends.',
          features: [
            'Interactive line graph showing alert frequency',
            'Time range selection (24 hours, 7 days, 30 days)',
            'Hover to see exact alert counts',
            'Identify peak alert times',
            'Track safety improvements over time',
          ]
        },
        {
          title: 'Hotspot Mapping',
          icon: faMapMarkedAlt,
          content: 'Interactive map showing areas with high alert concentration.',
          features: [
            'Color-coded risk zones (Critical, High, Medium, Low)',
            'Circle size indicates alert frequency',
            'Click on hotspots to view details',
            'Filter by time period',
            'Resource allocation planning',
          ]
        },
        {
          title: 'Statistics Overview',
          icon: faChartLine,
          content: 'Key metrics and statistics at a glance.',
          features: [
            'Total number of hotspots',
            'Critical areas count (10+ alerts)',
            'High risk areas (5-9 alerts)',
            'Top hotspot with most alerts',
            'Real-time updates',
          ]
        },
        {
          title: 'Using Analytics',
          icon: faLightbulb,
          content: 'Best practices for utilizing analytics data effectively.',
          steps: [
            { step: '1', text: 'Review time-series graph to identify trends' },
            { step: '2', text: 'Check hotspot map for high-risk areas' },
            { step: '3', text: 'Click on hotspots to see alert details' },
            { step: '4', text: 'Use insights for preventive planning' },
            { step: '5', text: 'Share data with authorities and planners' },
          ]
        },
      ]
    },
    news: {
      title: 'News & Updates Guide',
      description: 'Stay informed about women\'s safety, rights, and success stories',
      cards: [
        {
          title: 'News Articles',
          icon: faNewspaper,
          content: "Latest news and updates on women's safety and empowerment.",
          features: [
            'Real-time news from trusted sources',
            'Category filters (Safety, Crime, Rights, etc.)',
            'Refresh to get latest articles',
            'Click to read full article',
            'Source and publication date',
          ]
        },
        {
          title: 'Laws & Rights',
          icon: faBalanceScale,
          content: "Important laws protecting women's rights and safety.",
          features: [
            'Sexual Harassment at Workplace Act',
            'Domestic Violence Protection Act',
            'Dowry Prohibition Act',
            'Equal Remuneration Act',
            'Links to full legal documents',
          ]
        },
        {
          title: 'Success Stories',
          icon: faTrophy,
          content: 'Inspiring stories of women who made a difference.',
          features: [
            'Trailblazers in law enforcement',
            'Legal reform achievements',
            'Sports and business leaders',
            'Education advocates',
            'Social change makers',
          ]
        },
      ]
    },
    tips: {
      title: 'Pro Tips & Best Practices',
      description: 'Expert tips for getting the most out of SafeWatch',
      cards: [
        {
          title: 'Monitoring Tips',
          icon: faVideo,
          content: 'Best practices for effective live monitoring.',
          features: [
            'Check live feeds regularly for real-time awareness',
            'Focus on cameras in high-traffic areas',
            'Monitor detection counts for unusual patterns',
            'Report any camera malfunctions immediately',
            'Keep an eye on night-time monitoring',
          ]
        },
        {
          title: 'Alert Management',
          icon: faBell,
          content: 'Handle alerts efficiently and effectively.',
          features: [
            'Review new alerts promptly to avoid missing threats',
            'Update alert status to track progress',
            'Use filters to prioritize critical alerts',
            'Check screenshot evidence for context',
            'Coordinate with team members on responses',
          ]
        },
        {
          title: 'Data Analysis',
          icon: faChartLine,
          content: 'Make the most of analytics and insights.',
          features: [
            'Review hotspot maps weekly for trends',
            'Compare different time periods for insights',
            'Use data to plan patrol routes',
            'Share findings with city planners',
            'Track effectiveness of safety measures',
          ]
        },
        {
          title: 'Quick Actions',
          icon: faPlayCircle,
          content: 'Keyboard shortcuts and quick access features.',
          steps: [
            { step: 'Tip 1', text: 'Bookmark frequently used pages' },
            { step: 'Tip 2', text: 'Use status filters to manage workflow' },
            { step: 'Tip 3', text: 'Click camera cards for quick details' },
            { step: 'Tip 4', text: 'Refresh pages to get latest data' },
            { step: 'Tip 5', text: 'Use time filters in analytics' },
          ]
        },
      ]
    },
  };

  const currentSection = tutorials[activeSection];

  return (
    <div className="min-h-screen bg-[#1a1a1a] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FontAwesomeIcon icon={faGraduationCap} className="text-5xl text-blue-500" />
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                How To Use SafeWatch
              </h1>
              <p className="text-gray-400 text-lg mt-2">
                Interactive guide to master the platform and ensure maximum safety
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex flex-wrap gap-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id);
                setExpandedCard(null);
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <FontAwesomeIcon icon={section.icon} />
              {section.label}
            </button>
          ))}
        </div>

        {/* Section Header */}
        <div className="mb-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
          <h2 className="text-3xl font-bold text-white mb-2">{currentSection.title}</h2>
          <p className="text-gray-400 text-lg">{currentSection.description}</p>
        </div>

        {/* Tutorial Cards */}
        <div className="grid grid-cols-1 gap-6">
          {currentSection.cards.map((card, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300"
            >
              {/* Card Header */}
              <div
                className="p-6 cursor-pointer bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all"
                onClick={() => setExpandedCard(expandedCard === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={card.icon} className="text-white text-2xl" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                      <p className="text-gray-400 mt-1">{card.content}</p>
                    </div>
                  </div>
                  <FontAwesomeIcon
                    icon={faHandPointRight}
                    className={`text-blue-500 text-xl transition-transform duration-300 ${
                      expandedCard === index ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Card Content */}
              {expandedCard === index && (
                <div className="p-6 bg-gray-900 border-t border-gray-800 animate-fadeIn">
                  {/* Features */}
                  {card.features && (
                    <div className="space-y-3">
                      {card.features.map((feature, fIndex) => (
                        <div
                          key={fIndex}
                          className="flex items-start gap-3 bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
                        >
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="text-green-500 text-lg mt-1 flex-shrink-0"
                          />
                          <p className="text-gray-300 font-medium">{feature}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Steps */}
                  {card.steps && (
                    <div className="space-y-4">
                      {card.steps.map((step, sIndex) => (
                        <div
                          key={sIndex}
                          className="flex items-start gap-4 bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors"
                        >
                          <div className={`w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 ${step.color || ''}`}>
                            <span className="text-white font-bold">{step.step}</span>
                          </div>
                          <div>
                            <p className={`font-medium text-lg ${step.color || 'text-white'}`}>
                              {step.step}
                            </p>
                            <p className="text-gray-400 mt-1">{step.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faPlayCircle} className="text-blue-500" />
            Ready to Start?
          </h3>
          <p className="text-gray-300 mb-6">
            Jump right into the platform and start exploring these powerful features.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to="/live"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-4 text-center hover:shadow-lg hover:scale-105 transition-all"
            >
              <FontAwesomeIcon icon={faVideo} className="text-3xl mb-2" />
              <h4 className="font-bold">Live Feeds</h4>
            </Link>
            <Link
              to="/all-alerts"
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg p-4 text-center hover:shadow-lg hover:scale-105 transition-all"
            >
              <FontAwesomeIcon icon={faBell} className="text-3xl mb-2" />
              <h4 className="font-bold">Alerts</h4>
            </Link>
            <Link
              to="/analytics"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-4 text-center hover:shadow-lg hover:scale-105 transition-all"
            >
              <FontAwesomeIcon icon={faChartLine} className="text-3xl mb-2" />
              <h4 className="font-bold">Analytics</h4>
            </Link>
            <Link
              to="/news"
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg p-4 text-center hover:shadow-lg hover:scale-105 transition-all"
            >
              <FontAwesomeIcon icon={faNewspaper} className="text-3xl mb-2" />
              <h4 className="font-bold">News</h4>
            </Link>
          </div>
        </div>

        {/* Help Note */}
        <div className="mt-6 bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-start gap-4">
            <FontAwesomeIcon icon={faLightbulb} className="text-yellow-400 text-2xl mt-1" />
            <div>
              <h4 className="text-white font-bold text-lg mb-2">Need More Help?</h4>
              <p className="text-gray-400">
                Click on any card above to expand and view detailed instructions. You can also explore each
                section using the navigation tabs. For technical support or questions, feel free to reach out
                through the platform's support channels.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowTo;
