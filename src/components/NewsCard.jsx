import React, {useState, useEffect} from 'react';

const NewsCard = ({ article }) => {
  const fallbackImage = 'https://euaa.europa.eu/sites/default/files/styles/width_600px/public/default_images/news-default-big.png?itok=NNXAZZTc';
  return (
    <div 
      style={{
        backgroundImage: `url(${article.image || fallbackImage})`,
        backgroundSize: 'contain', 
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat', 
      }}
      onError={(e) => {
        // Fallback to a default image if loading the Unsplash image fails.
        e.target.style.backgroundImage = `url(${fallbackImage})`;
      }}
      className=" relative h-screen flex flex-col justify-end items-center p-8 bg-gradient-to-br from-blue-50 to-purple-50"
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
        }}
      />
      <div className="w-full relative z-1">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          {article.title}
        </h1>

        <div className="text-right">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 text-pink-600 rounded-lg text-xl font-bold"
          >
            Read More &gt;
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;