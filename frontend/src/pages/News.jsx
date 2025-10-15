import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faNewspaper, 
  faCalendarAlt, 
  faExternalLinkAlt, 
  faSearch,
  faSpinner,
  faExclamationTriangle,
  faSync
} from '@fortawesome/free-solid-svg-icons';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('women safety');
  const [activeCategory, setActiveCategory] = useState('safety');

  // News categories related to women safety
  const categories = [
    { id: 'safety', label: 'Women Safety', query: 'women safety' },
    { id: 'crime', label: 'Crimes Against Women', query: 'crimes against women' },
    { id: 'harassment', label: 'Harassment', query: 'women harassment workplace' },
    { id: 'rights', label: 'Women Rights', query: 'women rights empowerment' },
    { id: 'domestic', label: 'Domestic Violence', query: 'domestic violence women' }
  ];

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      setError(null);

      try {
        // Using NewsAPI.org with environment variable
        const API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'c4bbe80f686a4bf0b550d1dbc26f8e3c';
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'error') {
          throw new Error(data.message || 'API returned an error');
        }
        
        // NewsAPI returns articles in data.articles
        const articles = data.articles || [];
        setNews(articles);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError(`Failed to fetch news: ${err.message}. Please try again later.`);
        setLoading(false);
      }
    };

    loadNews();
  }, [searchQuery]);

  const fetchNews = () => {
    setSearchQuery(searchQuery + ' '); // Force refresh by updating query
    setTimeout(() => setSearchQuery(searchQuery.trim()), 0);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category.id);
    setSearchQuery(category.query);
  };

  const handleRefresh = () => {
    fetchNews();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 text-transparent bg-clip-text">
              <FontAwesomeIcon icon={faNewspaper} className="mr-3 text-pink-500" />
              Women Safety News
            </h1>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
              disabled={loading}
            >
              <FontAwesomeIcon icon={faSync} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
          <p className="text-gray-400 text-lg">
            Stay informed about the latest news on women safety, rights, and empowerment
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/50'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <FontAwesomeIcon icon={faSpinner} spin className="text-6xl text-pink-500 mb-4" />
            <p className="text-xl text-gray-400">Loading latest news...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-6xl text-red-500 mb-4" />
            <p className="text-xl text-red-400 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* News Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-800 overflow-hidden">
                  {article.image || article.urlToImage ? (
                    <img
                      src={article.image || article.urlToImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faNewspaper} className="text-6xl text-gray-700" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                    {article.source?.name || 'News Source'}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-pink-400 transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {article.description || 'No description available.'}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500 text-sm">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                      {formatDate(article.publishedAt)}
                    </div>
                    
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-pink-500 hover:text-pink-400 transition-colors text-sm font-medium"
                    >
                      Read More
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && news.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <FontAwesomeIcon icon={faSearch} className="text-6xl text-gray-600 mb-4" />
            <p className="text-xl text-gray-400">No news articles found</p>
            <p className="text-gray-500 mt-2">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
