// Small helper that reads and writes the JSON "database" files in /data.
const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..", "data");

function read(name) {
  return JSON.parse(fs.readFileSync(path.join(dir, name + ".json"), "utf8"));
}
function write(name, data) {
  fs.writeFileSync(path.join(dir, name + ".json"), JSON.stringify(data, null, 2));
}

// Which tasks are "in progress"?
// Newer progress.json files store an "inProgress" list.
// Older ones do not, so we fall back to the old rule: the first task that is not completed.
function getInProgress(tasks, completed, inProgress) {
  if (Array.isArray(inProgress)) {
    return inProgress.filter(function (id) { return !completed.includes(id); });
  }
  const first = tasks.find(function (task) { return !completed.includes(task.id); });
  return first ? [first.id] : [];
}

// Give every task a status:
//   completed    -> in the completed list
//   in-progress  -> in the inProgress list
//   not-started  -> everything else
function withStatus(tasks, completed, inProgress) {
  const active = getInProgress(tasks, completed, inProgress);
  return tasks.map(function (task) {
    let status = "not-started";
    if (completed.includes(task.id)) { status = "completed"; }
    else if (active.includes(task.id)) { status = "in-progress"; }
    return Object.assign({}, task, { status: status });
  });
}

function summary(tasks, completed, inProgress) {
  const total = tasks.length;
  const done = completed.length;
  const active = getInProgress(tasks, completed, inProgress).length;
  return {
    total: total,
    completed: done,
    inProgress: active,
    notStarted: total - done - active,
    remaining: total - done,
    percent: Number(((done / total) * 100).toFixed(1))
  };
}

module.exports = { read, write, withStatus, summary, getInProgress };
