const express = require('express');
const path = require('path');

const app = express();

// --- Paths ---
const spaDistPath = path.join(__dirname, 'dist', 'spa', 'browser');
const mpaPath = path.join(__dirname, '..', 'mpa');

// --- Serve MPA ---
// Serve the entire MPA directory statically.
// This makes resources available at URLs like /homepage/homepage.html, /about_us/about_us.html, etc.
app.use(express.static(mpaPath));

// --- SPA Routes ---
// Serve static files for the Angular app from the /app route
app.use('/app', express.static(spaDistPath));
// For all routes starting with /app, serve the Angular app's index.html for deep linking
app.get('/app/*', (req, res) => {
  res.sendFile(path.join(spaDistPath, 'index.html'));
});

// --- Root Route ---
// Redirect the root path to the homepage
app.get('/', (req, res) => {
  res.redirect('/homepage/homepage.html');
});

// Start the app
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});