const express = require("express");
const store = require("./store");
const router = express.Router();

function matches(item, words) {
  const text = [item.title, item.description, item.track, item.difficulty]
    .concat(item.skills || [], item.tools || []).join(" ").toLowerCase();
  return words.every(function (w) { return text.includes(w); });
}

// GET /api/search?q=javascript -> { query, tasks: [...], challenges: [...] }
router.get("/", function (req, res) {
  const q = String(req.query.q || "").trim().toLowerCase();
  if (!q) { return res.json({ query: "", tasks: [], challenges: [] }); }
  const words = q.split(/\s+/);
  res.json({
    query: q,
    tasks: store.read("tasks").filter(function (t) { return matches(t, words); }),
    challenges: store.read("challenges").filter(function (c) { return matches(c, words); })
  });
});

module.exports = router;
