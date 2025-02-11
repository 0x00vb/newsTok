const axios = require('axios');

async function fetchWikinews(continueToken) {
  const wikinewsAPI = 'https://en.wikinews.org/w/api.php';
  const params = {
    action: 'query',
    format: 'json',
    prop: 'extracts|pageimages',
    generator: 'categorymembers',
    gcmtitle: 'Category:Published',
    gcmsort: 'timestamp',
    gcmdir: 'descending',
    gcmlimit: 10,
    exintro: true,
    explaintext: true,
    piprop: 'thumbnail',
    pithumbsize: 400,
  };

  if (continueToken) {
    params.gcmcontinue = continueToken;
  }

  try {
    const response = await axios.get(wikinewsAPI, { params });
    const data = response.data;

    // Sort pages by the "index" property to ensure proper ordering
    const newsItems = !data?.query?.pages
      ? []
      : Object.values(data.query.pages)
            .sort((a, b) => a.index - b.index)
            .map((page) => ({
              title: page.title || 'No Title',
              summary: page.extract || 'No summary available',
              link: `https://en.wikinews.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
              image: page.thumbnail?.source || null,
            }));

    const newContinueToken = data.continue ? data.continue.gcmcontinue : null;
    return { newsItems, continueToken: newContinueToken };
  } catch (error) {
    console.error('Error fetching news:', error.message);
    return { newsItems: [], continueToken: null };
  }
}

exports.getNews = async (req, res) => {
  const continueToken = req.query.continue;
  try {
    const { newsItems, continueToken: newToken } = await fetchWikinews(continueToken);
    if (newsItems.length === 0) return res.status(204).send();
    res.json({ newsItems, continueToken: newToken });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching news' });
  }
};
