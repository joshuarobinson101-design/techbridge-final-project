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

// Work out each task's status from the list of completed task numbers:
//   completed    -> in the list
//   in-progress  -> the first task that is not completed
//   not-started  -> everything after that
function withStatus(tasks, completed) {
  let currentFound = false;
  return tasks.map(function (task) {
    let status = "not-started";
    if (completed.includes(task.id)) { status = "completed"; }
    else if (!currentFound) { status = "in-progress"; currentFound = true; }
    return Object.assign({}, task, { status: status });
  });
}

function summary(tasks, completed) {
  const total = tasks.length;
  const done = completed.length;
  return {
    total: total,
    completed: done,
    remaining: total - done,
    percent: Number(((done / total) * 100).toFixed(1))
  };
}

module.exports = { read, write, withStatus, summary };
