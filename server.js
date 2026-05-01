console.log("🔥 NEWS SERVER RUNNING");

const express = require("express");
const cors = require("cors");
const Parser = require("rss-parser");

const app = express();
const parser = new Parser();

const PORT = process.env.PORT || 5173;

app.use(cors());

// RSS feeds
const feeds = [
  "https://feeds.bbci.co.uk/news/world/rss.xml",
  "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
  "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en"
];

let cache = [];
let lastUpdated = 0;

// Fetch news
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
          source: data.title
        });
      });

    } catch (err) {
      console.log("❌ Feed error:", err.message);
    }
  }

  all.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  cache = all.slice(0, 20);
  lastUpdated = Date.now();

  console.log("✅ News updated:", cache.length);
}

// Routes
app.get("/", (req, res) => {
  res.send("📰 News API Running ✅");
});

app.get("/api/news", (req, res) => {
  res.json({
    updated: lastUpdated,
    data: cache
  });
});

// Start server (ONLY ONCE)
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);

  updateNews();
  setInterval(updateNews, 5 * 60 * 1000);
});
