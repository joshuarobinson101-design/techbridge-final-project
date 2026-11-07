/* Search tasks and challenges through GET /api/search?q=... */
const form = document.getElementById("search-form");
const input = document.getElementById("q");
const stateMsg = document.getElementById("search-state");
const results = document.getElementById("results");

function showState(text, isError) {
  stateMsg.hidden = !text;
  stateMsg.textContent = text;
  stateMsg.className = "state-msg" + (isError ? " state-error" : "");
}

function esc(text) {                       // never insert raw text into HTML
  const d = document.createElement("div");
  d.textContent = text;
  return d.innerHTML;
}

function group(title, items, build) {
  if (!items.length) { return ""; }
  return "<h2>" + title + " (" + items.length + ")</h2><ul class=\"search-list\">" + items.map(build).join("") + "</ul>";
}

async function runSearch(query) {
  results.innerHTML = "";
  if (!query.trim()) { showState("Type a word to search tasks and challenges.", false); return; }
  showState("Searching...", false);
  try {
    const data = await api("/api/search?q=" + encodeURIComponent(query));
    if (!data.tasks.length && !data.challenges.length) {
      showState("No matching results found.", false);
      return;
    }
    showState(data.tasks.length + data.challenges.length + " results for \"" + query + "\"", false);
    results.innerHTML =
      group("Tasks", data.tasks, function (t) {
        return "<li><strong>Task " + t.id + ": " + esc(t.title) + "</strong><p>" + esc(t.description) + "</p><a href=\"dashboard.html\">Open in Dashboard</a></li>";
      }) +
      group("Challenges", data.challenges, function (c) {
        return "<li><strong>" + esc(c.title) + "</strong><span> " + esc(c.track) + " · " + esc(c.difficulty) + "</span><p>" + esc(c.description) + "</p><a href=\"challenges.html\">Open in Challenge Hub</a></li>";
      });
  } catch (error) {
    showState("Unable to search. Please try again.", true);
  }
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  history.replaceState(null, "", "?q=" + encodeURIComponent(input.value));
  runSearch(input.value);
});

const startQuery = new URLSearchParams(location.search).get("q");
if (startQuery) { input.value = startQuery; runSearch(startQuery); }
