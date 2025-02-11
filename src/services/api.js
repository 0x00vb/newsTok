// Base API configuration
const API_BASE = 'http://localhost:3000/api';

// Common headers configuration
const headers = {
  'Content-Type': 'application/json',
};

// Helper function for handling responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

export const NewsService = {
    async getNews(page = 1) {
      try {
        const response = await fetch(`${API_BASE}/news?page=${page}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 204) return []; // No more news
        if (!response.ok) throw new Error('Failed to fetch news');
        
        return response.json();
      } catch (error) {
        throw new Error(`Failed to fetch news: ${error.message}`);
      }
    },
  };
  