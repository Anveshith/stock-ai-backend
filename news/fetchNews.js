const axios = require("axios");

async function fetchNews(query) {
  const res = await axios.get("https://newsapi.org/v2/everything", {
    params: {
      q: query,
      language: "en",
      sortBy: "publishedAt",
      pageSize: 5,
      apiKey: process.env.NEWS_API_KEY
    }
  });

  return res.data.articles.map(a => ({
    title: a.title,
    description: a.description || "",
    source: a.source.name
  }));
}

module.exports = { fetchNews };
