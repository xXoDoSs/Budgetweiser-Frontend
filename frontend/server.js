const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');

const app = express();

// ---------- Paths ----------
const ROOT = __dirname;

// MPA lives one level up from this server file: ../mpa
const mpaPath = path.join(ROOT, 'mpa');

// Try to find the built Angular SPA output
function findSpaDist() {
  const distRoot = path.join(ROOT, 'spa', 'dist');

  if (!fs.existsSync(distRoot)) return null;

  // Case 1: custom build directly under /dist
  if (fs.existsSync(path.join(distRoot, 'index.html'))) return distRoot;

  // Case 2: typical Angular layouts
  // Angular 17+: dist/<project>/browser
  // Angular <=16: dist/<project>
  const entries = fs.readdirSync(distRoot, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  for (const dir of entries) {
    const v17 = path.join(distRoot, dir, 'browser');
    const legacy = path.join(distRoot, dir);

    if (fs.existsSync(path.join(v17, 'index.html'))) return v17;
    if (fs.existsSync(path.join(legacy, 'index.html'))) return legacy;
  }
  return null;
}

const spaDistPath = findSpaDist();

// ---------- Middleware ----------
app.use(compression());

// Simple health check
app.get('/health', (_req, res) => res.status(200).send('ok'));

// Endpoint to provide configuration to the frontend
app.get('/config', (_req, res) => {
  res.json({
    backendUrl: process.env.BACKEND_URL || 'https://budgetweiser-a9722999c31d.herokuapp.com/graphql'
  });
});

// ---------- Serve MPA (root) ----------
if (fs.existsSync(mpaPath)) {
  app.use(express.static(mpaPath, {
    etag: true,
    lastModified: true,
    maxAge: '1d'
  }));
} else {
  console.warn('⚠  MPA path not found:', mpaPath);
}

// Root route → redirect to your homepage document
app.get('/', (_req, res) => {
  res.sendFile(path.join(mpaPath, 'homepage', 'homepage.html'));
});

// ---------- Serve SPA at /app ----------
if (spaDistPath) {
  // Serve static assets under /app
  app.use('/app', express.static(spaDistPath, {
    etag: true,
    lastModified: true,
    maxAge: '1y',               // cache busting handled by Angular hashes
    index: false
  }));

  // SPA deep-link fallback for anything under /app/*
  app.get('/app/*', (_req, res) => {
    res.sendFile(path.join(spaDistPath, 'index.html'));
  });

  console.log('✅ Angular SPA served from:', spaDistPath);
} else {
  console.warn('⚠  No built Angular SPA found under /dist. Did the build run?');
}

// ---------- Start server ----------
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
  console.log('BACKEND_URL from environment:', process.env.BACKEND_URL);
});