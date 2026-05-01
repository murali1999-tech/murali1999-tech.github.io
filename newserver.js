console.log("🔥 NEW SERVER FILE RUNNING");

const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("NOW IT WORKS ✅");
});

app.listen(5173, () => {
  console.log("🚀 http://localhost:5173");
});
