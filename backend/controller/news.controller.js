const axios = require('axios');

async function fetchWikinews(page = 1) {
  const wikinewsAPI = 'https://en.wikinews.org/w/api.php';
  const params = {
    action: 'query',
    format: 'json',
    prop: 'extracts',
    generator: 'categorymembers',
    gcmtitle: 'Category:Published',
    gcmsort: 'timestamp',
    gcmdir: 'descending',
    gcmlimit: 10,
    gcmcontinue: page > 1 ? (page - 1) * 10 : undefined,
    exintro: true,
    explaintext: true,
  };

  try {
    const response = await axios.get(wikinewsAPI, { params });
    const data = response.data;

    if (!data?.query?.pages) return []; // Return empty array if no data

    return Object.values(data.query.pages).map((page) => ({
      title: page.title || 'No Title',
      summary: page.extract || 'No summary available',
      link: `https://en.wikinews.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
    }));
  } catch (error) {
    console.error('Error fetching news:', error.message);
    return [];
  }
}

exports.getNews = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  try {
    const newsItems = await fetchWikinews(page);
    if (newsItems.length === 0) return res.status(204).send(); // No more data
    res.json(newsItems);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching news' });
  }
};
