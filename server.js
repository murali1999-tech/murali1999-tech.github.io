console.log("🔥 MY SERVER STARTED");

const express = require("express");
const app = express();

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("ROOT WORKING ✅");
});

app.get("/api/news", (req, res) => {
  res.json([{ title: "API WORKING ✅" }]);
});

// ONLY ONE listen
app.listen(5173, () => {
  console.log("🚀 Server running at http://localhost:5173");
});
