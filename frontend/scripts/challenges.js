/* =====================================================================
   TechBridge Challenge Hub  (Task 8: data comes from the API)
   This file makes the Challenge Hub interactive:
     1. Shows the challenge cards          (built from data)
     2. Filters by track and difficulty    (plus search and sorting)
     3. Opens a details pop-up             (View Challenge)
     4. Runs the glass carousel            (featured challenges)
   Nothing here reloads the page.
   ===================================================================== */


/* ---------------------------------------------------------------------
   1. THE DATA
   Each challenge is an OBJECT. All challenges live in one ARRAY.
   The page is built from this list, so to add a new challenge you only
   add one more object here. No HTML needed.
--------------------------------------------------------------------- */
let challenges = [];          // filled from GET /api/challenges


// The order the featured challenges appear in the carousel.
// We list ids so we can mix both tracks instead of showing one track first.
const featuredIds = ["da-1", "wd-1", "da-3", "wd-2", "da-5", "wd-4", "da-4", "wd-5"];

// Difficulty text -> number, used for sorting and for the little bars.
const levelNumbers = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 };


/* ---------------------------------------------------------------------
   2. VARIABLES THAT REMEMBER WHAT THE VISITOR CHOSE
   One object holds every filter. When a button is clicked we change one
   value here and then redraw the list.
--------------------------------------------------------------------- */
const filters = {
  track: "all",
  difficulty: "all",
  search: "",
  sort: "default"
};


/* ---------------------------------------------------------------------
   3. GRAB THE PARTS OF THE PAGE WE NEED
--------------------------------------------------------------------- */
const grid         = document.getElementById("challenge-grid");
const resultCount  = document.getElementById("result-count");
const noResults    = document.getElementById("no-results");
const searchInput  = document.getElementById("search");
const sortSelect   = document.getElementById("sort");
const chipButtons  = document.querySelectorAll(".chip");
const modal        = document.getElementById("challenge-modal");
const modalBody    = document.getElementById("modal-body");

const carousel     = document.getElementById("carousel");
const carTrack     = document.getElementById("car-track");
const carDots      = document.getElementById("car-dots");
const carPrev      = document.getElementById("car-prev");
const carNext      = document.getElementById("car-next");
const carPause     = document.getElementById("car-pause");


/* ---------------------------------------------------------------------
   4. SMALL HELPER FUNCTIONS
--------------------------------------------------------------------- */

// "Data Analytics" -> "data", "Web Development" -> "web" (used as a CSS class)
function trackClass(track) {
  return track === "Data Analytics" ? "data" : "web";
}

// Three small bars: 1, 2 or 3 are filled depending on difficulty.
function buildMeter(difficulty) {
  const level = levelNumbers[difficulty];
  let bars = "";
  for (let i = 1; i <= 3; i++) {
    bars += i <= level ? '<i class="on"></i>' : "<i></i>";
  }
  return '<span class="meter" aria-hidden="true">' + bars + "</span>";
}

// Find one challenge object by its id.
function findChallenge(id) {
  return challenges.find(function (c) { return c.id === id; });
}


/* ---------------------------------------------------------------------
   5. BUILDING THE CARDS
   Template strings (backticks) let us drop values in with ${ ... }.
--------------------------------------------------------------------- */
function buildCard(c, index) {
  return `
    <li class="c-card track-${trackClass(c.track)} diff-${levelNumbers[c.difficulty]}" style="--i:${index}">
      <div class="c-top">
        <span class="track-pill">${c.track}</span>
        <span class="c-time">${c.time}</span>
      </div>
      <h3>${c.title}</h3>
      <p class="c-level">${buildMeter(c.difficulty)}<span>${c.difficulty}</span></p>
      <p class="c-desc">${c.description}</p>
      <p class="c-outcome"><strong>Expected outcome</strong>${c.outcome}</p>
      <button type="button" class="btn-view" data-open="${c.id}" aria-label="View challenge: ${c.title}">View Challenge</button>
    </li>`;
}


/* ---------------------------------------------------------------------
   6. FILTERING, SEARCHING AND SORTING
   filter() keeps only the items that pass the test.
   Every filter must say yes for a challenge to be shown.
--------------------------------------------------------------------- */
function getVisibleChallenges() {
  const searchText = filters.search.trim().toLowerCase();

  let list = challenges.filter(function (c) {
    const trackOk      = filters.track === "all" || c.track === filters.track;
    const difficultyOk = filters.difficulty === "all" || c.difficulty === filters.difficulty;
    const searchOk     = searchText === "" || c.title.toLowerCase().includes(searchText);
    return trackOk && difficultyOk && searchOk;
  });

  // Sorting: copy first with slice() so we never disturb the original order.
  if (filters.sort === "easiest") {
    list = list.slice().sort(function (a, b) { return levelNumbers[a.difficulty] - levelNumbers[b.difficulty]; });
  } else if (filters.sort === "hardest") {
    list = list.slice().sort(function (a, b) { return levelNumbers[b.difficulty] - levelNumbers[a.difficulty]; });
  }
  return list;
}

// Redraw the grid, the count and the "no results" message.
function renderChallenges() {
  const list = getVisibleChallenges();

  let html = "";
  list.forEach(function (c, index) { html += buildCard(c, index); });
  grid.innerHTML = html;

  // "Showing 3 of 10 challenges"
  resultCount.textContent = "Showing " + list.length + " of " + challenges.length + " challenges";

  // Show the friendly message only when nothing matches.
  const empty = list.length === 0;
  noResults.hidden = !empty;
  grid.hidden = empty;
}

// Light up the button that matches the current choice.
function updateChipStates() {
  chipButtons.forEach(function (chip) {
    const group = chip.dataset.filter;           // "track" or "difficulty"
    const isActive = filters[group] === chip.dataset.value;
    chip.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function resetFilters() {
  filters.track = "all";
  filters.difficulty = "all";
  filters.search = "";
  filters.sort = "default";
  searchInput.value = "";
  sortSelect.value = "default";
  updateChipStates();
  renderChallenges();
}


/* ---------------------------------------------------------------------
   7. THE DETAILS POP-UP (MODAL)
   The <dialog> element is built into the browser. showModal() opens it
   on top of the page, dims the background, traps keyboard focus inside,
   and closes with the Esc key.
--------------------------------------------------------------------- */
function openChallenge(id) {
  const c = findChallenge(id);
  if (!c) { return; }

  const listItems = function (items) {
    return items.map(function (item) { return "<li>" + item + "</li>"; }).join("");
  };

  modalBody.innerHTML = `
    <div class="modal-head track-${trackClass(c.track)}">
      <button type="button" class="modal-x" data-close aria-label="Close challenge details">&times;</button>
      <div class="c-top">
        <span class="track-pill">${c.track}</span>
        <span class="c-time">Estimated time: ${c.time}</span>
      </div>
      <h3 id="modal-title">${c.title}</h3>
      <p class="c-level diff-${levelNumbers[c.difficulty]}">${buildMeter(c.difficulty)}<span>${c.difficulty}</span></p>
    </div>

    <div class="modal-content">
      <h4>Objective</h4>
      <p>${c.objective}</p>

      <h4>Skills you will use</h4>
      <ul class="tag-list">${listItems(c.skills)}</ul>

      <h4>Tools you may use</h4>
      <ul class="tag-list tools">${listItems(c.tools)}</ul>

      <h4>What you need to produce</h4>
      <ul class="produce-list">${listItems(c.produce)}</ul>

      <h4>Expected result</h4>
      <p>${c.outcome}</p>

      <div class="stumble">
        <strong>Where beginners often get stuck</strong>
        <p>${c.stumble}</p>
      </div>

      <div class="modal-actions">
        <a class="btn btn-primary" href="https://forms.gle/8EbdSy5ttGfLZfjv5" target="_blank" rel="noopener noreferrer">Apply for the Internship</a>
        <button type="button" class="btn-close" data-close>Close</button>
      </div>
    </div>`;

  document.body.classList.add("modal-open");       // stops the page behind from scrolling
  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");                // very old browsers
  }
  modal.scrollTop = 0;
}

function closeChallenge() {
  if (typeof modal.close === "function") {
    modal.close();
  } else {
    modal.removeAttribute("open");
  }
  document.body.classList.remove("modal-open");
}


/* ---------------------------------------------------------------------
   8. EVENT LISTENERS
   "Listen" for clicks and typing, then run the matching function.
   EVENT DELEGATION: instead of adding a listener to every card button
   (they get rebuilt on every filter), we listen once on the parent and
   check what was clicked with closest().
--------------------------------------------------------------------- */

// Filter buttons
chipButtons.forEach(function (chip) {
  chip.addEventListener("click", function () {
    filters[chip.dataset.filter] = chip.dataset.value;
    updateChipStates();
    renderChallenges();
  });
});

// Search box: runs on every keystroke
searchInput.addEventListener("input", function () {
  filters.search = searchInput.value;
  renderChallenges();
});

// Sort dropdown
sortSelect.addEventListener("change", function () {
  filters.sort = sortSelect.value;
  renderChallenges();
});

// Reset buttons
document.getElementById("reset-filters").addEventListener("click", resetFilters);
document.getElementById("no-results-reset").addEventListener("click", resetFilters);

// View Challenge buttons: in the grid AND in the carousel
function handleViewClick(event) {
  const button = event.target.closest("[data-open]");
  if (button) { openChallenge(button.dataset.open); }
}
grid.addEventListener("click", handleViewClick);
carTrack.addEventListener("click", handleViewClick);

// Closing the pop-up: the X, the Close button, or a click on the dark backdrop
modal.addEventListener("click", function (event) {
  if (event.target.closest("[data-close]") || event.target === modal) {
    closeChallenge();
  }
});
// Also fires when the visitor presses Esc
modal.addEventListener("close", function () {
  document.body.classList.remove("modal-open");
});


/* ---------------------------------------------------------------------
   9. THE GLASS CAROUSEL
   All slides sit in one long row (the "track"). To show different slides
   we slide the whole row left or right with translateX.
   - position = the number of the first slide you can see
   - perView  = how many slides fit (3 desktop, 2 tablet, 1 phone)
--------------------------------------------------------------------- */
let featured = [];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let position = 0;
let perView = 3;
let autoTimer = null;
let userPaused = reduceMotion;      // visitors who prefer less motion get no auto-sliding
let hoverPaused = false;

function buildSlide(c, index) {
  return `
    <li class="slide" data-index="${index}">
      <article class="glass-card track-${trackClass(c.track)} diff-${levelNumbers[c.difficulty]}">
        <div class="c-top">
          <span class="track-pill">${c.track}</span>
          <span class="c-time">${c.time}</span>
        </div>
        <h3>${c.title}</h3>
        <p class="c-level">${buildMeter(c.difficulty)}<span>${c.difficulty}</span></p>
        <p class="slide-outcome">${c.outcome}</p>
        <button type="button" class="btn-view" data-open="${c.id}" aria-label="View challenge: ${c.title}">View Challenge</button>
      </article>
    </li>`;
}

// How many slides fit at the current screen width?
function getPerView() {
  if (window.innerWidth >= 960) { return 3; }
  if (window.innerWidth >= 640) { return 2; }
  return 1;
}

function maxPosition() {
  return Math.max(0, featured.length - perView);
}

function buildDots() {
  let html = "";
  for (let i = 0; i <= maxPosition(); i++) {
    html += '<button type="button" class="dot" data-pos="' + i + '" aria-label="Show challenges starting at ' + (i + 1) + '"></button>';
  }
  carDots.innerHTML = html;
}

// Move the row to the current position and update everything that depends on it.
function updateCarousel() {
  const slides = carTrack.children;
  const gap = parseFloat(getComputedStyle(carTrack).columnGap) || 0;
  const slideWidth = slides[0].getBoundingClientRect().width;

  carTrack.style.transform = "translateX(" + (-position * (slideWidth + gap)) + "px)";

  Array.prototype.forEach.call(slides, function (slide, i) {
    const visible = i >= position && i < position + perView;
    slide.classList.toggle("is-out", !visible);
    slide.inert = !visible;                       // hidden slides can't be tabbed into
    slide.setAttribute("aria-hidden", visible ? "false" : "true");
  });

  Array.prototype.forEach.call(carDots.children, function (dot, i) {
    if (i === position) { dot.setAttribute("aria-current", "true"); }
    else { dot.removeAttribute("aria-current"); }
  });
}

function goTo(newPosition) {
  // Wrap around: past the end goes back to the start, before the start goes to the end.
  if (newPosition > maxPosition()) { newPosition = 0; }
  if (newPosition < 0) { newPosition = maxPosition(); }
  position = newPosition;
  updateCarousel();
}

// Auto-sliding
function startAuto() {
  stopAuto();
  if (userPaused || hoverPaused) { return; }
  autoTimer = setInterval(function () { goTo(position + 1); }, 5000);
}
function stopAuto() {
  clearInterval(autoTimer);
  autoTimer = null;
}

function setupCarousel() {
  carTrack.innerHTML = featured.map(buildSlide).join("");
  perView = getPerView();
  carousel.style.setProperty("--per", perView);
  buildDots();
  position = Math.min(position, maxPosition());
  updateCarousel();
  startAuto();
}

// Carousel events
carPrev.addEventListener("click", function () { goTo(position - 1); startAuto(); });
carNext.addEventListener("click", function () { goTo(position + 1); startAuto(); });
carDots.addEventListener("click", function (event) {
  const dot = event.target.closest(".dot");
  if (dot) { goTo(Number(dot.dataset.pos)); startAuto(); }
});

// Pause / Play button (people must be able to stop moving content)
function updatePauseButton() {
  carPause.textContent = userPaused ? "Play" : "Pause";
  carPause.setAttribute("aria-pressed", userPaused ? "true" : "false");
  carPause.setAttribute("aria-label", userPaused ? "Start automatic sliding" : "Pause automatic sliding");
}
carPause.addEventListener("click", function () {
  userPaused = !userPaused;
  updatePauseButton();
  startAuto();
});

// Pause while the mouse is over it or a keyboard user is inside it
carousel.addEventListener("mouseenter", function () { hoverPaused = true; stopAuto(); });
carousel.addEventListener("mouseleave", function () { hoverPaused = false; startAuto(); });
carousel.addEventListener("focusin",    function () { hoverPaused = true; stopAuto(); });
carousel.addEventListener("focusout",   function () { hoverPaused = false; startAuto(); });

// Arrow keys
carousel.addEventListener("keydown", function (event) {
  if (event.key === "ArrowRight") { goTo(position + 1); }
  if (event.key === "ArrowLeft")  { goTo(position - 1); }
});

// Swipe on phones: remember where the finger went down, compare where it lifted.
let swipeStartX = null;
carousel.addEventListener("pointerdown", function (event) { swipeStartX = event.clientX; });
carousel.addEventListener("pointerup", function (event) {
  if (swipeStartX === null) { return; }
  const distance = event.clientX - swipeStartX;
  swipeStartX = null;
  if (Math.abs(distance) > 50) {
    goTo(distance < 0 ? position + 1 : position - 1);
    startAuto();
  }
});
carousel.addEventListener("pointercancel", function () { swipeStartX = null; });

// Pause sliding when the browser tab is hidden
document.addEventListener("visibilitychange", function () {
  if (document.hidden) { stopAuto(); } else { startAuto(); }
});

// Re-measure if the screen size changes (rotating a phone, resizing a window)
let resizeTimer = null;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    const newPerView = getPerView();
    if (newPerView !== perView) {
      perView = newPerView;
      carousel.style.setProperty("--per", perView);
      buildDots();
      position = Math.min(position, maxPosition());
    }
    updateCarousel();
  }, 120);
});


/* ---------------------------------------------------------------------
   10. RUN ONCE WHEN THE PAGE LOADS
--------------------------------------------------------------------- */
updatePauseButton();

async function loadChallenges() {
  resultCount.textContent = "Loading challenges...";
  noResults.hidden = true;
  try {
    challenges = await api("/api/challenges");
    featured = featuredIds.map(findChallenge).filter(Boolean);
    renderChallenges();
    setupCarousel();
  } catch (error) {
    grid.innerHTML = "";
    resultCount.innerHTML = 'Unable to load challenges. Please try again. <button type="button" class="btn btn-primary" id="retry-ch">Retry</button>';
    document.getElementById("retry-ch").addEventListener("click", loadChallenges);
  }
}
loadChallenges();
