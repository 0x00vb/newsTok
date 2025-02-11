import { useState, useEffect, useRef, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import { NewsService } from './services/api';
import NewsCard from './components/NewsCard.jsx';
import TopBar from './components/TopBar.jsx';

const App = () => {
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Prevent unnecessary calls
  const [currentIndex, setCurrentIndex] = useState(0);
  const observer = useRef();

  const fetchNews = useCallback(async () => {
    if (!hasMore || isLoading) return; // Prevent unnecessary calls
    setIsLoading(true);
    
    try {
      const data = await NewsService.getNews(page);
      if (data.length === 0) {
        setHasMore(false); // Stop fetching if no more articles
        return;
      }
      setNewsData((prev) => [...prev, ...data]);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, hasMore, isLoading]);

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

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedUp: () => setCurrentIndex((prev) => Math.min(prev + 1, newsData.length - 1)),
    onSwipedDown: () => setCurrentIndex((prev) => Math.max(prev - 1, 0)),
    trackMouse: true,
    preventDefaultTouchmoveEvent: true,
  });

  return (
    <div className="h-screen overflow-hidden bg-black">
      <TopBar />
      
      {/* Swipeable News Cards */}
      <div {...swipeHandlers} className="h-full">
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
