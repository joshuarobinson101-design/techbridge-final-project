const express = require("express");
const store = require("./store");
const router = express.Router();

// GET /api/challenges  (optional ?track=Web Development&difficulty=Beginner)
router.get("/", function (req, res) {
  let list = store.read("challenges");
  if (req.query.track)      { list = list.filter(function (c) { return c.track === req.query.track; }); }
  if (req.query.difficulty) { list = list.filter(function (c) { return c.difficulty === req.query.difficulty; }); }
  res.json(list);
});

router.get("/:id", function (req, res) {
  const found = store.read("challenges").find(function (c) { return c.id === req.params.id; });
  if (!found) { return res.status(404).json({ error: "Challenge not found" }); }
  res.json(found);
});

module.exports = router;
