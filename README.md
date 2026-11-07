# TechBridge Intern Management Platform

## Project Description

The TechBridge Intern Management Platform is a full-stack web application for interns on the TechBridge 30-Day Practical Internship (by Baselink Services Limited). It helps interns track their internship progress, open and manage their 8 tasks, explore practical challenges in Data Analytics and Web Development, and search across everything.

The frontend (HTML, CSS, JavaScript) gets all task data from a Node.js and Express REST API using the Fetch API, so progress is saved on the server and not just in the browser.

**Live links**

- Frontend: https://joshuarobinson101-design.github.io/techbridge-final-project/frontend/index.html
- Backend API: https://techbridge-final-project.onrender.com/api/tasks

> The backend runs on a free Render plan, which goes to sleep when it is not used. The first request can take up to a minute. The dashboard shows a "Loading tasks..." message while it wakes up.

## Technologies Used

- HTML5
- CSS3 (responsive layout with Grid, Flexbox and media queries)
- JavaScript (ES6, Fetch API, async/await, DOM manipulation)
- Node.js
- Express.js
- REST API
- JSON (file-based data storage)
- GitHub and GitHub Pages, Render (hosting)

## Main Features

- **Landing page** with TechBridge branding, navigation and a Get Started / View Dashboard button
- **Intern Dashboard** showing intern name, track, internship status, total / completed / remaining tasks, overall progress percentage and a progress bar
- **Task management for Tasks 1 to 8**: each task shows its number, title, short description and status, with a **View Task** pop-up for more detail (no page refresh)
- **Status updates through the API**: Not Started, Start Task, In Progress, Mark as Completed, Completed (with Undo). Counts, percentage and progress bar update instantly
- **Challenge Hub** with 10 challenges (5 Data Analytics, 5 Web Development), each with title, track, difficulty, description, expected outcome and a View Challenge pop-up
- **Filtering** of challenges by track and difficulty, plus search and sorting
- **Search** across tasks and challenges, with a "No matching results found." message
- **Loading and error states**: "Loading tasks..." while data loads and "Unable to load tasks. Please try again." with a Try again button if the API fails
- **Responsive design** for desktop, tablet and mobile
- **Accessible UI**: keyboard-friendly controls, ARIA labels and live regions

## How to Run the Project

You need [Node.js](https://nodejs.org) installed.

```bash
# 1. Go into the backend folder
cd backend

# 2. Install the dependencies
npm install

# 3. Start the server
node server.js
```

The server starts at **http://localhost:3000**. It serves both the API and the frontend, so open http://localhost:3000 in your browser to use the whole platform.

> By default `frontend/scripts/api.js` points to the hosted Render backend. To use your local backend instead, change `API_BASE` in that file to `"http://localhost:3000"`.

### API Endpoints

| Method | Endpoint | What it does |
|--------|----------|--------------|
| GET | `/api/tasks` | All 8 tasks with status, the intern and a progress summary |
| GET | `/api/tasks/:id` | One task |
| PATCH | `/api/tasks/:id/status` | Change a task's status (`not-started`, `in-progress`, `completed`) |
| POST | `/api/tasks/reset` | Reset progress to the demo state |
| GET | `/api/challenges` | All challenges (optional `?track=` and `?difficulty=`) |
| GET | `/api/challenges/:id` | One challenge |
| GET | `/api/search?q=word` | Search tasks and challenges |
| GET | `/api/health` | Check that the server is running |

## Project Structure

```
techbridge-final-project/
│
├── frontend/
│   ├── index.html          Landing page
│   ├── dashboard.html      Intern Dashboard
│   ├── challenges.html     Challenge Hub
│   ├── search.html         Search page
│   ├── programs.html       Programs page
│   ├── tasks.html          Internship Tasks page
│   ├── roadmap.html        Internship Roadmap page
│   ├── styles/
│   │   └── styles.css      All styling
│   └── scripts/
│       ├── api.js          Shared fetch helper and API address
│       ├── dashboard.js    Dashboard logic (loads tasks, updates status)
│       ├── challenges.js   Challenge Hub (filters, search, pop-up)
│       ├── search.js       Search page logic
│       └── script.js       Roadmap page logic
│
├── backend/
│   ├── server.js           Express server (API and frontend)
│   ├── package.json
│   ├── routes/
│   │   ├── tasks.js        Task routes
│   │   ├── challenges.js   Challenge routes
│   │   ├── search.js       Search route
│   │   └── store.js        Reads and writes the JSON data
│   └── data/
│       ├── tasks.json      The 8 tasks
│       ├── challenges.json The 10 challenges
│       └── progress.json   Intern details and task progress
│
├── assets/
│   └── images/
│       └── techbridge.png  Logo
│
└── README.md
```

## Notes

- Data is stored in JSON files, as the project brief allows. On free hosting, saved progress can reset when the server redeploys. Use **Reset demo progress** on the dashboard to return to the starting state.
