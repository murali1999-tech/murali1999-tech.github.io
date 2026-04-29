const express = require("express");
const cors = require("cors");
const Parser = require("rss-parser");

const app = express();
const parser = new Parser();

app.use(cors());

const feeds = [
  "https://feeds.bbci.co.uk/news/world/rss.xml",
  "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
  "https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en"
];

let cache = [];
let lastUpdated = 0;

// fetch news
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
          pubDate: item.pubDate
        });
      });

    } catch (err) {
      console.log("Feed error:", err.message);
    }
  }

  all.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  cache = all.slice(0, 20);
  lastUpdated = Date.now();

  console.log("✅ News updated:", cache.length);
}

// API endpoint
app.get("/news", (req, res) => {
  res.json({
    updated: lastUpdated,
    data: cache
  });
});

// start server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
  updateNews();
  setInterval(updateNews, 5 * 60 * 1000);
});