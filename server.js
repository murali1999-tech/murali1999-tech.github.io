const express = require("express");
const cors = require("cors");
const Parser = require("rss-parser");

const app = express();
const parser = new Parser();

app.use(cors());

// RSS feeds
const feeds = [
  "https://feeds.bbci.co.uk/news/world/rss.xml",
  "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
  "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en"
];

// Cache
let cache = [];
let lastUpdated = 0;

// Fetch news function
async function updateNews() {
  console.log("🔄 Fetching news...");

  let all = [];

  for (let feed of feeds) {
    try {
      const data = await parser.parseURL(feed);

      data.items.forEach(item => {
        all.push({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          source: data.title,
          image: item.enclosure?.url || null
        });
      });

    } catch (err) {
      console.log("❌ Feed error:", err.message);
    }
  }

  // Sort latest first
  all.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // Store top 20
  cache = all.slice(0, 20);
  lastUpdated = Date.now();

  console.log("✅ News updated:", cache.length);
}

// ✅ Root route (ONLY ONCE)
app.get("/", (req, res) => {
  res.send("🚀 News API is running");
});

// ✅ API route (ONLY ONCE)
app.get("/api/news", (req, res) => {
  if (cache.length === 0) {
    return res.json({ message: "⏳ Loading news, please wait..." });
  }

  const limit = parseInt(req.query.limit) || 20;

  res.json({
    updated: lastUpdated,
    total: cache.length,
    data: cache.slice(0, limit)
  });
});

// Start server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");

  // Initial fetch
  updateNews();

  // Auto update every 5 minutes
  setInterval(updateNews, 5 * 60 * 1000);
});
