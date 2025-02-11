const API_BASE = 'https://newstok-api.vercel.app/api';

const headers = {
  'Content-Type': 'application/json',
};

export const NewsService = {
  async getNews(continueToken) {
    try {
      const url = `${API_BASE}/news${continueToken ? `?continue=${continueToken}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (response.status === 204) return { newsItems: [], continueToken: null };
      if (!response.ok) throw new Error('Failed to fetch news');

      return response.json();
    } catch (error) {
      throw new Error(`Failed to fetch news: ${error.message}`);
    }
  },
};
