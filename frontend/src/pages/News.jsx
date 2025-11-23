import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faNewspaper, 
  faCalendarAlt, 
  faExternalLinkAlt, 
  faSearch,
  faSpinner,
  faExclamationTriangle,
  faSync,
  faBalanceScale,
  faTrophy,
  faShieldAlt,
  faGavel,
  faStar,
  faAward
} from '@fortawesome/free-solid-svg-icons';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('women safety');
  const [activeCategory, setActiveCategory] = useState('safety');
  const [activeTab, setActiveTab] = useState('articles'); // articles, laws, stories

  // News categories related to women safety
  const categories = [
    { id: 'safety', label: 'Women Safety', query: 'women safety' },
    { id: 'crime', label: 'Crimes Against Women', query: 'crimes against women' },
    { id: 'harassment', label: 'Harassment', query: 'women harassment workplace' },
    { id: 'rights', label: 'Women Rights', query: 'women rights empowerment' },
    { id: 'domestic', label: 'Domestic Violence', query: 'domestic violence women' }
  ];

  // Women's Rights and Protection Laws
  const laws = [
    {
      title: "Sexual Harassment of Women at Workplace Act, 2013",
      description: "Provides protection against sexual harassment of women at workplace and for the prevention and redressal of complaints of sexual harassment.",
      category: "Workplace",
      year: "2013",
      icon: faShieldAlt,
      link: "https://legislative.gov.in/sites/default/files/A2013-14.pdf"
    },
    {
      title: "Protection of Women from Domestic Violence Act, 2005",
      description: "Provides for more effective protection of the rights of women guaranteed under the Constitution who are victims of violence of any kind occurring within the family.",
      category: "Domestic Violence",
      year: "2005",
      icon: faShieldAlt,
      link: "https://legislative.gov.in/sites/default/files/A2005-43.pdf"
    },
    {
      title: "Dowry Prohibition Act, 1961",
      description: "Prohibits the giving or taking of dowry. Provides penalties for demanding, giving, or taking dowry.",
      category: "Marriage",
      year: "1961",
      icon: faGavel,
      link: "https://legislative.gov.in/sites/default/files/A1961-28.pdf"
    },
    {
      title: "Criminal Law Amendment Act, 2013",
      description: "Amended Indian Penal Code, Criminal Procedure Code, and Indian Evidence Act to provide for stringent punishment for sexual offences including rape.",
      category: "Criminal",
      year: "2013",
      icon: faBalanceScale,
      link: "https://legislative.gov.in/sites/default/files/A2013-13_0.pdf"
    },
    {
      title: "Maternity Benefit Act, 1961",
      description: "Regulates employment of women in certain establishments for certain periods before and after child-birth and provides for maternity benefit and certain other benefits.",
      category: "Employment",
      year: "1961",
      icon: faShieldAlt,
      link: "https://labour.gov.in/sites/default/files/TheMaternityBenefitAct1961.pdf"
    },
    {
      title: "Equal Remuneration Act, 1976",
      description: "Provides for payment of equal remuneration to men and women workers for the same work or work of a similar nature.",
      category: "Employment",
      year: "1976",
      icon: faBalanceScale,
      link: "https://labour.gov.in/sites/default/files/equal_remuneration_act_1976.pdf"
    },
    {
      title: "Pre-Conception and Pre-Natal Diagnostic Techniques Act, 1994",
      description: "Prohibits sex selection before or after conception and regulates prenatal diagnostic techniques to prevent misuse.",
      category: "Healthcare",
      year: "1994",
      icon: faShieldAlt,
      link: "https://main.mohfw.gov.in/sites/default/files/953522324.pdf"
    },
    {
      title: "Prohibition of Child Marriage Act, 2006",
      description: "Prohibits child marriages and provides for stringent punishments for those who promote, permit, or conduct child marriages.",
      category: "Marriage",
      year: "2006",
      icon: faGavel,
      link: "https://wcd.nic.in/sites/default/files/childmarriageact.pdf"
    }
  ];

  // Success Stories
  const successStories = [
    {
      title: "Kiran Bedi - First Woman IPS Officer",
      description: "Kiran Bedi broke barriers by becoming India's first woman IPS officer in 1972. She revolutionized prison reforms and continues to inspire women to pursue careers in law enforcement.",
      category: "Law Enforcement",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop",
      achievement: "First Female IPS Officer"
    },
    {
      title: "Nirbhaya Case - Legal Reforms",
      description: "The 2012 Delhi gang rape case led to widespread protests and significant amendments to India's rape laws, including faster trials and harsher punishments for sexual assault.",
      category: "Legal Reform",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop",
      achievement: "Strengthened Sexual Assault Laws"
    },
    {
      title: "Bachendri Pal - Conquering Everest",
      description: "Bachendri Pal became the first Indian woman to reach the summit of Mount Everest in 1984, proving that women can excel in any field including extreme sports.",
      category: "Sports",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      achievement: "First Indian Woman on Everest"
    },
    {
      title: "Indra Nooyi - Global Business Leader",
      description: "Served as CEO of PepsiCo for 12 years, becoming one of the most powerful business executives globally and paving the way for women in corporate leadership.",
      category: "Business",
      image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=250&fit=crop",
      achievement: "Former CEO of PepsiCo"
    },
    {
      title: "Malala Yousafzai - Education Advocate",
      description: "Despite being shot by the Taliban, Malala continued her fight for girls' education, becoming the youngest Nobel Prize laureate and a global icon for women's rights.",
      category: "Education",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop",
      achievement: "Nobel Peace Prize Winner"
    },
    {
      title: "Savitribai Phule - Pioneer of Women's Education",
      description: "Founded India's first school for girls in 1848, fighting against caste and gender discrimination to champion education for women and marginalized communities.",
      category: "Education",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop",
      achievement: "First Female Teacher in India"
    },
    {
      title: "Mary Kom - Boxing Champion",
      description: "Six-time World Amateur Boxing Champion and Olympic bronze medalist, proving that women can excel in traditionally male-dominated sports.",
      category: "Sports",
      image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=250&fit=crop",
      achievement: "World Boxing Champion"
    },
    {
      title: "Sudha Murty - Philanthropist & Author",
      description: "First female engineer at India's largest auto manufacturer and chairperson of Infosys Foundation, dedicated to education and women's empowerment.",
      category: "Social Work",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=250&fit=crop",
      achievement: "Social Innovation Leader"
    }
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
              News & Updates
            </h1>
            {activeTab === 'articles' && (
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faSync} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            )}
          </div>
          <p className="text-gray-400 text-lg">
            Stay informed about the latest news, laws, and success stories on women safety, rights, and empowerment
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-4 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-3 font-medium transition-all duration-300 relative ${
              activeTab === 'articles'
                ? 'text-pink-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <FontAwesomeIcon icon={faNewspaper} className="mr-2" />
            Articles
            {activeTab === 'articles' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('laws')}
            className={`px-6 py-3 font-medium transition-all duration-300 relative ${
              activeTab === 'laws'
                ? 'text-pink-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <FontAwesomeIcon icon={faBalanceScale} className="mr-2" />
            Laws & Rights
            {activeTab === 'laws' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-6 py-3 font-medium transition-all duration-300 relative ${
              activeTab === 'stories'
                ? 'text-pink-500'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <FontAwesomeIcon icon={faTrophy} className="mr-2" />
            Success Stories
            {activeTab === 'stories' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600"></div>
            )}
          </button>
        </div>

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <>
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
          </>
        )}

        {/* Laws Tab */}
        {activeTab === 'laws' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {laws.map((law, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 group"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-lg flex items-center justify-center group-hover:from-pink-500/30 group-hover:to-purple-600/30 transition-all">
                    <FontAwesomeIcon icon={law.icon} className="text-2xl text-pink-500" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-pink-500/20 text-pink-400 text-xs rounded-full">
                        {law.category}
                      </span>
                      <span className="text-gray-500 text-xs">
                        Est. {law.year}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-pink-400 transition-colors">
                      {law.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      {law.description}
                    </p>

                    <a
                      href={law.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-pink-500 hover:text-pink-400 transition-colors text-sm font-medium"
                    >
                      Read Full Act
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Success Stories Tab */}
        {activeTab === 'stories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-pink-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-800 overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop';
                    }}
                  />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <FontAwesomeIcon icon={faStar} className="text-yellow-400" />
                    <span>{story.category}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faAward} className="text-pink-500" />
                    <span className="text-sm text-pink-400 font-medium">{story.achievement}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-pink-400 transition-colors">
                    {story.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {story.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
