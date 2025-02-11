import React, {useState, useEffect} from 'react';

const NewsCard = ({ article }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchWikimediaImage = async () => {
      try {
        // Extract keywords from the title (remove stopwords for better accuracy)
        const searchQuery = article.title; // Remove special chars
        // Wikimedia API endpoint
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=original&titles=${encodeURIComponent(searchQuery)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.query) {
          const imagePages = Object.values(data.query.pages);
          if (imagePages.length > 0 && imagePages[0].imageinfo) {
            setImageUrl(imagePages[0].imageinfo[0].url);
          }
        }
      } catch (error) {
        console.error('Error fetching Wikimedia image:', error);
      }
    };
    fetchWikimediaImage();
  }, [article.title]);

  const fallbackImage = 'https://euaa.europa.eu/sites/default/files/styles/width_600px/public/default_images/news-default-big.png?itok=NNXAZZTc';
  return (
    <div 
      style={{
        backgroundImage: `url(${imageUrl || fallbackImage})`,
        backgroundSize: 'cover', // Ensures the image covers the full div
        backgroundPosition: 'center', // Centers the image properly
        backgroundRepeat: 'no-repeat', // Prevents tiling
      }}
      onError={(e) => {
        // Fallback to a default image if loading the Unsplash image fails.
        e.target.style.backgroundImage = `url(${fallbackImage})`;
      }}
      className="h-screen flex flex-col justify-center items-center p-8 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className=" w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          {article.title}
        </h1>

        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-lg font-medium"
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default NewsCard;