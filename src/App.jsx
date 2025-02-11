import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import { NewsService } from './services/api';
import NewsCard from './components/NewsCard.jsx';
import TopBar from './components/TopBar.jsx';

const App = () => {
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [continueToken, setContinueToken] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const observer = useRef();
  const wheelTimeout = useRef(null);

  const fetchNews = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    try {
      const { newsItems, continueToken: newToken } = await NewsService.getNews(continueToken);
      if (newsItems.length === 0) {
        setHasMore(false);
        return;
      }
      // Filter out duplicate articles based on their link.
      setNewsData((prev) => {
        const existingLinks = new Set(prev.map(article => article.link));
        const filteredNewsItems = newsItems.filter(article => !existingLinks.has(article.link));
        return [...prev, ...filteredNewsItems];
      });
      setContinueToken(newToken);
      if (!newToken) {
        setHasMore(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [continueToken, hasMore, isLoading]);

  useEffect(() => {
    fetchNews();
  }, []);

  // Infinite Scroll Observer
  const lastNewsRef = useCallback(
    (node) => {
      if (!hasMore || isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchNews();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchNews, hasMore, isLoading]
  );

  // Swipe handlers to navigate between news cards
  const swipeHandlers = useSwipeable({
    onSwipedUp: () => setCurrentIndex((prev) => Math.min(prev + 1, newsData.length - 1)),
    onSwipedDown: () => setCurrentIndex((prev) => Math.max(prev - 1, 0)),
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
  });

  // Enable two-finger trackpad scrolling via the wheel event
  const handleWheel = useCallback((e) => {
    if (wheelTimeout.current) return;
    if (e.deltaY > 0) {
      setCurrentIndex((prev) => Math.min(prev + 1, newsData.length - 1));
    } else if (e.deltaY < 0) {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }
    wheelTimeout.current = setTimeout(() => {
      wheelTimeout.current = null;
    }, 500); // Adjust the timeout as needed for smoother scrolling
  }, [newsData.length]);

  return (
    <div className="h-screen overflow-hidden bg-black">
      <TopBar />
      {/* Swipeable News Cards with wheel scrolling enabled */}
      <div {...swipeHandlers} onWheel={handleWheel} className="h-full">
        <div
          className="transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateY(-${currentIndex * 100}vh)`,
            height: `${newsData.length * 100}vh`,
          }}
        >
          {newsData.map((article, index) => (
            <div key={index} ref={index === newsData.length - 1 ? lastNewsRef : null} className="h-screen">
              <NewsCard article={article} />
            </div>
          ))}
        </div>
      </div>
      {/* Navigation Indicators */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 space-y-2">
        {newsData.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-blue-600' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
      {/* Loading Indicator */}
      {isLoading && hasMore && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-white text-center py-4">
          Loading...
        </div>
      )}
      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-center py-4">
          Error: {error}
        </div>
      )}
      {/* No More Data Message */}
      {!hasMore && (
        <div className="text-gray-400 text-center py-4">
          No more news available.
        </div>
      )}
    </div>
  );
};

export default App;
