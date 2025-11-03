eslint-disable no-console /
const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');

const app = express();

// ---------- Paths ----------
const ROOT = __dirname; // -> /app/frontend on Heroku
const mpaPath = path.join(ROOT, 'mpa'); // optional legacy MPA

// Find the built Angular SPA output under /frontend/spa/dist
function findSpaDist() {
  const distRoot = path.join(ROOT, 'spa', 'dist'); // ✅ /app/frontend/spa/dist

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
console.log('Resolved SPA dist path:', spaDistPath  'NOT FOUND');

// ---------- Middleware ----------
app.use(compression());

// Simple health check
app.get('/health', (_req, res) => res.status(200).send('ok'));

// Endpoint to provide configuration to the frontend
app.get('/config', (_req, res) => {
  res.json({
    backendUrl:
      process.env.BACKEND_URL 
      'https://budgetweiser-a9722999c31d.herokuapp.com/graphql',
  });
});

// ---------- (Optional) Serve legacy MPA static files ----------
if (fs.existsSync(mpaPath)) {
  app.use(
    '/mpa',
    express.static(mpaPath, {
      etag: true,
      lastModified: true,
      maxAge: '1d',
      index: false,
    })
  );
} else {
  console.warn('⚠  MPA path not found:', mpaPath);
}


if (spaDistPath) {
  app.use(
    '/app',
    express.static(spaDistPath, {
      etag: true,
      lastModified: true,
      maxAge: '1y', // Angular file hashing handles cache-busting
      index: false,
    })
  );

  // SPA deep-link fallback for anything under /app/
  app.get('/app/*', (_req, res) => {
    // Use absolute root to avoid "path must be absolute" errors
    res.sendFile('index.html', { root: spaDistPath });
  });
} else {
  console.warn('⚠  No built Angular SPA found under /frontend/spa/dist. Did the build run?');
}

// ---------- Redirect root to the SPA ----------
app.get('/', (_req, res) => res.redirect(302, '/app'));

// ---------- Start server ----------
const PORT = process.env.PORT  8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(Server listening on http:0.0.0.0:${PORT});
  console.log('BACKEND_URL:', process.env.BACKEND_URL  '(default)');
});