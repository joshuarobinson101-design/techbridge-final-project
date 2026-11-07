const express = require("express");
const store = require("./store");
const router = express.Router();

const VALID = ["not-started", "in-progress", "completed"];

// Everything the dashboard needs, in one response.
function payload() {
  const progress = store.read("progress");
  const allTasks = store.read("tasks");
  const tasks = store.withStatus(allTasks, progress.completed, progress.inProgress);
  return { intern: progress.intern, tasks: tasks, summary: store.summary(allTasks, progress.completed, progress.inProgress) };
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

// PATCH /api/tasks/:id/status   body: { "status": "not-started" | "in-progress" | "completed" }
router.patch("/:id/status", function (req, res) {
  const id = Number(req.params.id);
  const status = req.body && req.body.status;
  const allTasks = store.read("tasks");

  if (!allTasks.some(function (t) { return t.id === id; })) {
    return res.status(404).json({ error: "Task not found" });
  }
  if (!VALID.includes(status)) {
    return res.status(400).json({ error: "status must be one of: " + VALID.join(", ") });
  }

  const progress = store.read("progress");
  // Make sure both lists exist, then take this task out of both...
  let completed = progress.completed.filter(function (n) { return n !== id; });
  let inProgress = store.getInProgress(allTasks, progress.completed, progress.inProgress)
    .filter(function (n) { return n !== id; });

  // ...and put it in the right one.
  if (status === "completed") { completed.push(id); }
  if (status === "in-progress") { inProgress.push(id); }

  progress.completed = completed.sort(function (a, b) { return a - b; });
  progress.inProgress = inProgress.sort(function (a, b) { return a - b; });
  store.write("progress", progress);
  res.json(payload());
});

// POST /api/tasks/reset -> back to the demo state (Tasks 1 to 5 done, Task 6 in progress)
router.post("/reset", function (req, res) {
  const progress = store.read("progress");
  progress.completed = [1, 2, 3, 4, 5];
  progress.inProgress = [6];
  store.write("progress", progress);
  res.json(payload());
});

module.exports = router;
