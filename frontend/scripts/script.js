/* =====================================================================
   TechBridge Internship Roadmap  (Task 4)
   This file lets visitors switch between two internship tracks
   without the page reloading.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. VARIABLES
   A variable is a named box that holds a value.
   - const = the value never changes.
   - let   = the value can change later.
--------------------------------------------------------------------- */
const totalDays = 30;            // the internship is 30 days long (never changes)
let selectedTrack = "data";      // which track is showing now (changes when a button is clicked)


/* ---------------------------------------------------------------------
   2 + 3. ARRAYS AND OBJECTS
   An object  { ... } describes ONE thing using name: value pairs.
   An array   [ ... ] is a list of things.
   So each track is an ARRAY (list) of 8 task OBJECTS.
--------------------------------------------------------------------- */
const dataAnalyticsTasks = [
  { number: 1, title: "Data Cleaning Basics", day: 1,
    description: "Clean a messy dataset using Google Sheets or Excel. Identify and fix duplicate rows, blank cells, inconsistent formatting, and incorrect data types.",
    difficulty: "Beginner" },
  { number: 2, title: "Formulas & Pivot Tables", day: 4,
    description: "Use spreadsheet formulas and Pivot Tables to answer questions and extract useful insights from a dataset.",
    difficulty: "Beginner" },
  { number: 3, title: "Data Visualization", day: 8,
    description: "Create charts and a simple dashboard that communicate useful insights from a dataset.",
    difficulty: "Beginner → Intermediate" },
  { number: 4, title: "Introduction to SQL", day: 11,
    description: "Practice basic SQL queries and use them to answer real-world questions about data.",
    difficulty: "Beginner → Intermediate" },
  { number: 5, title: "SQL Joins & Aggregations", day: 15,
    description: "Use JOIN, GROUP BY and aggregate functions such as COUNT, SUM and AVG to analyze information across multiple tables.",
    difficulty: "Intermediate" },
  { number: 6, title: "Lookup Functions & Data Wrangling", day: 19,
    description: "Use VLOOKUP or XLOOKUP to combine related datasets and handle data mismatches.",
    difficulty: "Intermediate" },
  { number: 7, title: "Mini Analysis Project", day: 22,
    description: "Complete a small end-to-end analysis involving data cleaning, formulas, Pivot Tables, charts and recommendations.",
    difficulty: "Intermediate" },
  { number: 8, title: "Capstone Project", day: 26,
    description: "Complete a larger project combining spreadsheet analysis and SQL using at least two related tables.",
    difficulty: "Intermediate" }
];

const webDevelopmentTasks = [
  { number: 1, title: "Build the TechBridge Homepage", day: 1,
    description: "Create the first version of the TechBridge website using HTML and CSS.",
    difficulty: "Beginner" },
  { number: 2, title: "Build the TechBridge Programs Experience", day: 4,
    description: "Create a Programs experience presenting TechBridge's available learning programs.",
    difficulty: "Beginner" },
  { number: 3, title: "Build the Internship Tasks Experience", day: 8,
    description: "Create an interface that presents the TechBridge internship tasks and helps users understand the internship journey.",
    difficulty: "Beginner → Intermediate" },
  { number: 4, title: "Build an Interactive Internship Roadmap", day: 11,
    description: "Use JavaScript to allow visitors to switch between the Data Analytics and Web Development internship tracks.",
    difficulty: "Beginner → Intermediate" },
  { number: 5, title: "Build the Intern Registration Experience", day: 15,
    description: "Create a professional registration and onboarding interface for TechBridge interns.",
    difficulty: "Intermediate" },
  { number: 6, title: "Build the Task Submission System", day: 19,
    description: "Create an interface through which interns can prepare and submit their task work.",
    difficulty: "Intermediate" },
  { number: 7, title: "Build the Intern Dashboard", day: 22,
    description: "Create a dashboard where an intern can view their profile, progress, tasks and submissions.",
    difficulty: "Intermediate" },
  { number: 8, title: "Build the Complete TechBridge Internship Platform", day: 26,
    description: "Combine the different components created during the internship into a complete TechBridge platform.",
    difficulty: "Intermediate" }
];

// A small object used to look up the display name of each track.
const trackNames = {
  data: "Data Analytics",
  web: "Web Development"
};


/* ---------------------------------------------------------------------
   Grab the parts of the page we want to change.
   document.getElementById("x") finds the element with id="x" in the HTML.
   document.querySelectorAll(".x") finds ALL elements with class="x".
--------------------------------------------------------------------- */
const trackButtons   = document.querySelectorAll(".track-btn");
const timelineList   = document.getElementById("timeline");
const journeyTrack   = document.getElementById("jb-track");
const viewingName    = document.getElementById("viewing-name");
const viewingSummary = document.getElementById("viewing-summary");


/* ---------------------------------------------------------------------
   4 + 6. FUNCTIONS AND CONDITIONAL LOGIC
   A function is a named set of steps you can run whenever you need it.
   "if / else" lets the code choose between options.
--------------------------------------------------------------------- */

// Decide WHICH list of tasks to use.
function getTasksForTrack(trackKey) {
  if (trackKey === "web") {
    return webDevelopmentTasks;
  } else {
    return dataAnalyticsTasks;
  }
}

// Turn the difficulty text into a number from 1 to 3.
function getLevelNumber(difficulty) {
  if (difficulty === "Beginner") {
    return 1;
  } else if (difficulty === "Beginner → Intermediate") {
    return 2;
  } else {
    return 3;
  }
}

// Text shown next to the task number.
function getStatusText(day) {
  if (day === 1) {
    return "Available from the start";
  } else {
    return "Opens on Day " + day;
  }
}

// Build the three small bars that show difficulty (1, 2 or 3 filled).
function buildMeter(level) {
  let bars = "";
  for (let i = 1; i <= 3; i++) {
    if (i <= level) {
      bars += '<i class="on"></i>';   // filled bar
    } else {
      bars += '<i></i>';              // empty bar
    }
  }
  return bars;
}

// Draw the sticky Day 1 -> Day 30 bar at the top.
function renderJourneyBar(tasks) {
  let html = "";

  tasks.forEach(function (task) {
    // Work out how far along the bar this day sits (0% = Day 1, 100% = Day 30).
    const position = ((task.day - 1) / (totalDays - 1)) * 100;

    html += `
      <li style="--pos:${position.toFixed(1)}%">
        <a href="#task-${task.number}" aria-label="Task ${task.number}, Day ${task.day}">
          <span>${task.number}</span><small>Day ${task.day}</small>
        </a>
      </li>`;
  });

  // The final marker at the end of the bar.
  html += `<li class="jb-end" style="--pos:100%" aria-hidden="true"><span></span><small>Day ${totalDays}</small></li>`;

  journeyTrack.innerHTML = html;
}

// Draw the 8 task cards.
function renderTimeline(tasks) {
  let html = "";

  tasks.forEach(function (task, index) {
    const level = getLevelNumber(task.difficulty);

    // The backtick ` string lets us drop values in with ${ ... }.
    html += `
      <li class="task lvl-${level}" id="task-${task.number}" style="--i:${index}">
        <div class="task-day" aria-hidden="true"><small>Day</small><span>${task.day}</span></div>
        <article class="task-card">
          <div class="task-meta">
            <p class="task-num">Task ${task.number}</p>
            <p class="task-status">${getStatusText(task.day)}</p>
          </div>
          <h3>${task.title}</h3>
          <p class="task-desc">${task.description}</p>
          <p class="task-level"><span class="meter" aria-hidden="true">${buildMeter(level)}</span>${task.difficulty}</p>
        </article>
      </li>`;
  });

  timelineList.innerHTML = html;
}

// The main function: show everything for the chosen track.
function showTrack(trackKey) {
  selectedTrack = trackKey;                       // remember the choice
  const tasks = getTasksForTrack(trackKey);       // pick the right list

  // 7. DOM MANIPULATION: change what the visitor sees.
  document.body.dataset.track = trackKey;         // lets CSS change the track colour

  trackButtons.forEach(function (button) {
    if (button.dataset.track === trackKey) {
      button.setAttribute("aria-pressed", "true");    // highlight this button
    } else {
      button.setAttribute("aria-pressed", "false");
    }
  });

  viewingName.textContent = trackNames[trackKey];
  viewingSummary.textContent =
    tasks.length + " tasks, opening from Day " + tasks[0].day +
    " to Day " + tasks[tasks.length - 1].day + ".";

  renderJourneyBar(tasks);
  renderTimeline(tasks);
}


/* ---------------------------------------------------------------------
   5. EVENT LISTENERS
   "Listen" for a click on each track button, then run showTrack().
--------------------------------------------------------------------- */
trackButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    showTrack(button.dataset.track);   // data-track="data" or "web" in the HTML
  });
});


/* ---------------------------------------------------------------------
   Run once when the page loads so a track is already showing.
--------------------------------------------------------------------- */
showTrack(selectedTrack);
