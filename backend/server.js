// TechBridge Intern Management Platform: Express backend
// Run with:  npm install   then   node server.js
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Allow the frontend to call the API even if it is opened from another
// port (for example VS Code Live Server on :5500).
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  if (req.method === "OPTIONS") { return res.sendStatus(204); }
  next();
});

// API routes
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/challenges", require("./routes/challenges"));
app.use("/api/search", require("./routes/search"));
app.get("/api/health", function (req, res) { res.json({ ok: true }); });
app.use("/api", function (req, res) { res.status(404).json({ error: "Unknown API route" }); });

// Serve the frontend, so http://localhost:3000 shows the whole platform
app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));

app.listen(PORT, function () {
  console.log("TechBridge platform running at http://localhost:" + PORT);
});
