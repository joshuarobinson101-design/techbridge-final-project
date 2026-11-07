const express = require("express");
const store = require("./store");
const router = express.Router();

const VALID = ["not-started", "in-progress", "completed"];

// Everything the dashboard needs, in one response.
function payload() {
  const progress = store.read("progress");
  const tasks = store.withStatus(store.read("tasks"), progress.completed);
  return { intern: progress.intern, tasks: tasks, summary: store.summary(tasks, progress.completed) };
}

// GET /api/tasks  -> all 8 tasks with their status + progress summary
router.get("/", function (req, res) {
  res.json(payload());
});

// GET /api/tasks/:id  -> one task
router.get("/:id", function (req, res) {
  const task = payload().tasks.find(function (t) { return t.id === Number(req.params.id); });
  if (!task) { return res.status(404).json({ error: "Task not found" }); }
  res.json(task);
});

// PATCH /api/tasks/:id/status   body: { "status": "completed" }
// "completed" adds the task to the completed list; any other status removes it.
router.patch("/:id/status", function (req, res) {
  const id = Number(req.params.id);
  const status = req.body && req.body.status;
  const exists = store.read("tasks").some(function (t) { return t.id === id; });

  if (!exists) { return res.status(404).json({ error: "Task not found" }); }
  if (!VALID.includes(status)) {
    return res.status(400).json({ error: "status must be one of: " + VALID.join(", ") });
  }

  const progress = store.read("progress");
  if (status === "completed" && !progress.completed.includes(id)) {
    progress.completed.push(id);
  } else if (status !== "completed") {
    progress.completed = progress.completed.filter(function (n) { return n !== id; });
  }
  store.write("progress", progress);
  res.json(payload());
});

// POST /api/tasks/reset -> back to the demo state (Tasks 1 to 5 done)
router.post("/reset", function (req, res) {
  const progress = store.read("progress");
  progress.completed = [1, 2, 3, 4, 5];
  store.write("progress", progress);
  res.json(payload());
});

module.exports = router;
