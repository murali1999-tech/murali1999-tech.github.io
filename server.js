console.log("🔥 NEWS SERVER RUNNING");

const express = require("express");
const cors = require("cors");
const Parser = require("rss-parser");

const app = express();
const parser = new Parser();

// ✅ Render handles PORT automatically
const PORT = process.env.PORT || 10000;

app.use(cors({
  origin: "*"
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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

  try {
    const results = await Promise.all(
      feeds.map(feed => parser.parseURL(feed))
    );

    let all = [];

    results.forEach(data => {
      data.items.forEach(item => {
        all.push({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          source: data.title
        });
      });
    });

    all.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

    cache = all.slice(0, 20);
    lastUpdated = Date.now();

    console.log("✅ News updated:", cache.length);

  } catch (err) {
    console.log("❌ Fetch error:", err.message);
  }
}

// Routes
app.get("/", (req, res) => {
  res.send("📰 News API Running on Render ✅");
});

app.get("/api/news", (req, res) => {
  if (!cache.length) {
    return res.status(503).json({
      message: "News not ready yet",
      updated: lastUpdated,
      data: []
    });
  }

  res.json({
    updated: lastUpdated,
    data: cache
  });
});

// Start server
app.listen(PORT, async () => {
  console.log("🚀 Server running on port " + PORT);

  await updateNews();
  setInterval(updateNews, 5 * 60 * 1000);
});
