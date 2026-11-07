
const API_BASE = isLocal ? "http://localhost:3000" : "https://techbridge-i5aw.onrender.com";

async function api(path, options) {
  const response = await fetch(API_BASE + path, options);
  if (!response.ok) { throw new Error("Request failed: " + response.status); }
  return response.json();
}